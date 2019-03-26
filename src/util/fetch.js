/* eslint-disable no-use-before-define,consistent-return,no-param-reassign */
import 'whatwg-fetch';

const oldFetch = fetch;
const config = {};
let tokenInvalid = false;

const judgeTokenInvalid = ({ invalidCode, responseCode }) => {
  if (typeof invalidCode === 'string') {
    // 若 invalidCode 为字符串
    return responseCode === invalidCode;
  } else if (typeof invalidCode === 'function') {
    // 若 invalidCode 为方法
    return invalidCode(responseCode);
  } else if (typeof invalidCode === 'object' && invalidCode.constructor === Array) {
    // 若 invalidCode 为数组
    return invalidCode.findIndex((code) => (code === responseCode)) > -1;
  }
  return false;
};

const newFetch = (url, params = {}, opts = {}) => {
  const {
    baseUrl,
    headers = {},
    addAuth,
    authName,
    monitor,
    hash,
    resProps,
    refreshToken,
  } = config;
  const shouldBaseUrl = url.indexOf('//') === -1 && url.indexOf('http://') === -1 && url.indexOf('https://') === -1;

  const createOpts = (data, token) => {
    const defaultOpts = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers,
    };

    let newOpts = {
      ...defaultOpts,
    };

    if (addAuth) {
      newOpts.headers[authName] = token || addAuth();
    }

    newOpts = {
      ...defaultOpts,
      ...opts,
      headers: {
        ...defaultOpts.headers,
        ...opts.headers || {},
      },
    };

    if (!newOpts.headers['Content-Type']) {
      newOpts.headers['Content-Type'] = 'application/json';
    }

    if (newOpts.method === 'POST') {
      if (newOpts.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        let dataStr = '';
        const keys = Object.keys(data);
        keys.forEach((key, index) => {
          const a = index === 0 ? '' : '&';
          dataStr += `${a}${key}=${typeof data[key] !== 'undefined' ? data[key] : ''}`;
        });
        newOpts.body = dataStr;
      } else if (newOpts.headers['Content-Type'] === 'multipart/form-data') {
        const formData = new FormData();
        const keys = Object.keys(data);
        keys.forEach((key) => {
          formData.append(key, data[key]);
        });
        newOpts.body = formData;
        delete newOpts.headers['Content-Type'];
      } else {
        newOpts.body = JSON.stringify(data, (k, v) => {
          if (v === undefined) {
            return null;
          }
          return v;
        });
      }
    } else if (newOpts.method.toUpperCase() === 'GET') {
      let dataStr = '';
      const getKeys = Object.keys(data);
      getKeys.forEach((key, index) => {
        const a = index === 0 ? '' : '&';
        dataStr += `${a}${key}=${data[key]}`;
      });
      url = `${url}${url.indexOf('?') > -1 ? '&' : '?'}${dataStr}`;
    }

    if (newOpts.method.toUpperCase() === 'GET' && hash) {
      url = `${url}${url.indexOf('?') > -1 ? '&' : '?'}v=${hash}`;
    }

    return newOpts;
  };

  const errorHandler = (errorRes) => {
    const returnObj = {};
    const {
      resultCode,
      resultDesc,
    } = resProps;
    returnObj[resultCode] = '-1';
    returnObj[resultDesc] = `${errorRes.status} ${errorRes.statusText}`;
    return returnObj;
  };

  monitor.start();

  const createdOpts = createOpts(params);

  return new Promise((resolve) => {
    oldFetch(shouldBaseUrl ? (baseUrl + url) : url, createdOpts)
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          monitor.error(res);
          resolve(errorHandler(res));
        }
        monitor.end(res);

        return (res.headers.get('content-type').indexOf('application/json') > -1 ? res.json() : res.text());
      })
      .then((json) => {
        // token date out, request the refresh token
        if (typeof json === 'string') {
          json = JSON.parse(json);
        }
        if (judgeTokenInvalid({
          invalidCode: refreshToken.invalidCode,
          responseCode: json[resProps.resultCode] || 0,
        }) && refreshToken.getValue && !tokenInvalid) {
          tokenInvalid = true;
          const tokenParam = {};
          tokenParam[refreshToken.key] = refreshToken.getValue();
          refreshToken.beforeRefresh();
          oldFetch(refreshToken.url, createOpts(tokenParam))
            .then((refreshRes) => {
              if (refreshRes.status < 200 || refreshRes.status >= 300) {
                tokenInvalid = false;
                monitor.error(refreshRes);
                resolve(errorHandler(refreshRes));
              }
              return refreshRes.json();
            }).then((tokenRes) => {
              tokenInvalid = false;
              refreshToken.afterRefresh(tokenRes);
              // user center the result data is resultData
              const token = (tokenRes.resultData || {})[refreshToken.tokenName];
              if (token) {
                oldFetch(shouldBaseUrl ? (baseUrl + url) : url, createOpts(params, token))
                  .then((newRes) => {
                    if (newRes.status < 200 || newRes.status >= 300) {
                      monitor.error(newRes);
                      resolve(errorHandler(newRes));
                    }
                    resolve(newRes.headers.get('content-type').indexOf('application/json') > -1
                      ? newRes.json() : newRes.blob());
                  });
              } else {
                const returnObj = {};
                const {
                  resultCode,
                  resultDesc,
                } = resProps;
                returnObj[resultCode] = '-1000';
                returnObj[resultDesc] = '会话失效，请重新登录';
                resolve(returnObj);
              }
            });
        } else if (judgeTokenInvalid({
          invalidCode: refreshToken.invalidCode,
          responseCode: json[resProps.resultCode],
        }) && refreshToken.getValue && tokenInvalid) {
          const timer = setInterval(() => {
            if (!tokenInvalid) {
              clearInterval(timer);
              oldFetch(shouldBaseUrl ? (baseUrl + url) : url, createOpts(params))
                .then((res) => {
                  if (res.status < 200 || res.status >= 300) {
                    monitor.error(res);
                    resolve(errorHandler(res));
                  }
                  monitor.end(res);

                  resolve(res.headers.get('content-type').indexOf('application/json') > -1 ? res.json() : res.blob());
                });
            }
          }, 500);
        } else {
          resolve(json);
        }
      }).catch((e) => {
        monitor.error(e);
        const returnObj = {};
        const {
          resultCode,
          resultDesc,
        } = resProps;
        returnObj[resultCode] = '-1';
        returnObj[resultDesc] = '网络异常，请重试';
        resolve(returnObj);
      });
  });
};

newFetch.init = (opts = {}) => {
  const keys = Object.keys(opts);
  keys.forEach((key) => {
    if (typeof opts[key] === 'object') {
      const subKeys = Object.keys(opts[key]);
      subKeys.forEach((subKey) => {
        if (!config[key]) {
          config[key] = {};
        }
        config[key][subKey] = opts[key][subKey];
      });
    } else {
      config[key] = opts[key];
    }
  });
};

newFetch.init({
  headers: {},
  baseUrl: '',
  addAuth: undefined,
  authName: 'Authorization',
  monitor: {
    start: () => {},
    end: () => {},
    error: () => {},
  },
  hash: '',
  resProps: {
    resultCode: 'errorCode',
    resultDesc: 'msg',
    resultData: 'payload',
    success: 'success',
  },
  refreshToken: {
    invalidCode: '',
    url: '',
    getValue: undefined,
    tokenName: 'access_token',
    key: 'refreshToken',
    beforeRefresh: () => {},
    afterRefresh: () => {},
  },
});

export default newFetch;
