/* eslint-disable no-self-compare */
import moment from 'moment';
import set from 'lodash/set';
import { Form } from 'antd';
import config from '../config.json';

export const JSON_CONTENT_TYPE = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/*
 * get url prefix according to the env, default local
 * */
export const getEnv = () => {
  let env = 'local';
  if (__ONLINE__) {
    env = 'online';
  } else if (__PRE__) {
    env = 'pre';
  } else if (__QAIF__) {
    env = 'qaif';
  } else if (__QAFC__) {
    env = 'qafc';
  } else if (__DEV__) {
    env = 'dev';
  } else if (__LOCAL__) {
    env = 'local';
  }
  return env;
};

export const getBaseUrl = () => {
  const address = config.apiAddress;
  let realAddress = address[getEnv()];

  if (__MOCK__) {
    realAddress =
      address.mock || `${window.location.protocol}//${window.location.host}`;
  }
  if (!__ONLINE__ && window.globalBaseUrl) {
    realAddress = window.globalBaseUrl;
  }
  return realAddress;
};

export const getGatewayBaseUrl = () => {
  const address = config.gatewayApiAddress;
  let realAddress = address[getEnv()];

  if (__MOCK__) {
    realAddress =
      address.mock || `${window.location.protocol}//${window.location.host}`;
  }
  if (!__ONLINE__ && window.globalBaseUrl) {
    realAddress = window.globalBaseUrl;
  }
  return realAddress;
};

export const getDictBaseUrl = () => {
  const address = config.dictApiAddress;
  if (__MOCK__) {
    return (
      address.mock || `${window.location.protocol}//${window.location.host}`
    );
  }
  return address[getEnv()];
};

export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function formatMoney(num, reduce, precision, dropZero, money) {
  let newNum = +num;
  if (
    Number.isNaN(newNum) ||
    num === '' ||
    num === undefined ||
    (!Number.isNaN(newNum) && typeof newNum !== 'number')
  ) {
    newNum = 0;
    return '';
  }
  const numStr = `${newNum}`;
  const nums = numStr.split('.');
  const digitalNum = (nums[1] || '').length;
  let resPrecision = digitalNum;

  if (reduce) {
    const leftNum = `${reduce}`.length - `${reduce}`.replace(/0/g, '').length;
    resPrecision = digitalNum + leftNum;
    newNum /= reduce;
  }

  if (typeof precision === 'number') {
    resPrecision = precision;
  }
  newNum = (+newNum).toFixed(resPrecision);
  const newNums = `${newNum}`.split('.');
  let res = newNum;
  if (money) {
    const integer = newNums[0]
      .toString()
      .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    res = newNums.length > 1 ? `${integer}.${newNums[1]}` : integer;
  }
  if (dropZero) {
    res = res.replace(/0*$/, '').replace(/\.$/, '');
  }
  return res;
}

function changeTime(value) {
  if (/\.000/.test(value)) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
  return value;
}

function isPathValue(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return !!value._path;
}

export function mapReceivedData(data, decorate, post) {
  let newData = { ...data };
  newData = decorate ? decorate(newData) : newData;
  const keys = Object.keys(newData);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (/^.*Start$/.test(key)) {
      const prefix = key.slice(0, key.length - 5);
      newData[prefix] = {};
      newData[prefix].value = [newData[key], data[`${prefix}End`]];
    }
    const param = newData[key];
    if (
      (typeof param === 'object' && param !== null && 'value' in param) ||
      isPathValue(param)
    ) {
      newData[key] = changeTime(param);
    } else {
      newData[key] = Form.createFormField({ value: changeTime(param) });
    }
  }
  return post ? post(newData) : newData;
}

const isField = val =>
  typeof val === 'object' &&
  val !== null &&
  !(val instanceof Array) &&
  'value' in val &&
  !val._d;

const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

const splitString = (key, separator) =>
  key.replace(/(\w+)(Time)/g, `$1${separator}$2`);

const shapeType = (param, key) => {
  let { value } = param;
  const res = {};
  switch (param.type) {
    case 'month':
      res[key] = param.format('YYYY-MM');
      break;
    case 'datetimeRange':
    case 'numberRange':
      value = value || [];
      res[key] = param.value;
      res[`start${capitalize(key)}`] = value[0]
        ? value[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      res[`end${capitalize(key)}`] = value[1]
        ? value[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      res[splitString(key, 'Start')] = value[0]
        ? value[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      res[splitString(key, 'End')] = value[1]
        ? value[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      res[`${key}Start`] = value[0]
        ? value[0].format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      res[`${key}End`] = value[1]
        ? value[1].format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      delete res[key];
      break;
    case 'dateRange':
      value = value || [];
      res[key] = param.value;
      res[`start${capitalize(key)}`] = value[0]
        ? value[0].startOf('day').format('YYYY-MM-DD')
        : undefined;
      res[`end${capitalize(key)}`] = value[1]
        ? value[1].endOf('day').format('YYYY-MM-DD')
        : undefined;
      res[splitString(key, 'Start')] = value[0]
        ? value[0].startOf('day').format('YYYY-MM-DD')
        : undefined;
      res[splitString(key, 'End')] = value[1]
        ? value[1].startOf('day').format('YYYY-MM-DD')
        : undefined;
      res[`${key}Start`] = value[0]
        ? value[0].startOf('day').format('YYYY-MM-DD')
        : undefined;
      res[`${key}End`] = value[1]
        ? value[1].endOf('day').format('YYYY-MM-DD')
        : undefined;
      delete res[key];
      break;
    case 'monthRange':
      value = value || [];
      res[key] = param.value;
      res[`start${capitalize(key)}`] = value[0].format('YYYY-MM');
      res[`end${capitalize(key)}`] = value[1].format('YYYY-MM');
      res[splitString(key, 'Start')] = value[0].format('YYYY-MM');
      res[splitString(key, 'End')] = value[1].format('YYYY-MM');
      res[`${key}Start`] = value[0].format('YYYY-MM');
      res[`${key}End`] = value[1].format('YYYY-MM');
      delete res[key];
      break;
    case 'date':
      if (param.value) {
        res[key] = moment(param.value).format('YYYY-MM-DD');
      } else {
        res[key] = '';
      }
      break;
    case 'datetime':
      if (param.value) {
        res[key] = moment(param.value).format('YYYY-MM-DD HH:mm:ss');
      } else {
        res[key] = '';
      }
      break;
    default:
      res[key] = param.value;
      typeof res[key] === 'string' && res[key].trim();
  }
  return res;
};

export function mapToSendData(params = {}, decorate, exludedNames = []) {
  let res = {};
  const keys = Object.keys(params);
  const lastType = ['datetimeRange', 'numberRange', 'dateRange', 'monthRange'];
  const selectedKeys = [];
  // calculate field may is cover by other, order these fields
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = params[key];
    if (isField(param) && lastType.indexOf(param.type) > -1) {
      selectedKeys.push(key);
    }
  }
  const resKeys = Array.from(new Set(selectedKeys.concat(keys))).reverse();
  for (let i = 0; i < resKeys.length; i += 1) {
    const key = resKeys[i];
    const param = params[key];
    if (isField(param)) {
      if (
        !param.local &&
        exludedNames.indexOf(key) === -1 &&
        key.indexOf('__') !== 0
      ) {
        const valueObj = shapeType(param, key);
        res = {
          ...res,
          ...valueObj,
        };
      }
    } else {
      res[key] = param;
    }
  }
  return decorate ? decorate(res) : res;
}

export function parseFields(fields) {
  return fields.map(field => {
    const newField = { ...field };
    const keys = Object.keys(newField);
    keys.forEach(key => {
      const value = newField[key];
      let matched;
      let funcName;
      let props;
      let params;
      let oppose = false;
      if (
        Object.prototype.toString.call(value) === '[object Array]' &&
        value[0] &&
        (typeof value[0] === 'object' && !moment.isMoment(value[0]))
      ) {
        // moment will lost parent prototype when ...
        newField[key] = parseFields.call(this, value);
      }
      if (typeof value === 'string') {
        matched = value.match(/func:([^:]+)/);
      }
      if (matched) {
        [, funcName] = matched;
        if (/:run/.test(value)) {
          const matched2 = value.match(/:run:([^:]+)/) || [];
          [, params] = matched2;
          newField[key] = this[funcName].bind(this)(params);
        } else {
          newField[key] = this[funcName].bind(this);
        }
      }
      if (typeof value === 'string') {
        matched = value.match(/props:([^:]+)/);
      }
      if (matched) {
        [, props] = matched;
        if (props.startsWith('!')) {
          oppose = true;
          props = props.slice(1);
        }
        const propsArr = props.split('.');
        newField[key] = propsArr.reduce((res, prop) => {
          return res[prop];
        }, this.props);
        if (oppose) {
          newField[key] = !newField[key];
        }
      }
    });
    return newField;
  });
}

function isPath(name = '') {
  return name.indexOf('.') > -1 || name.indexOf('[');
}

export function mapToAntdFields(fields) {
  const antdFields = {};
  fields.forEach(field => {
    if (field.type !== 'dynamicAddDel' && field.type !== 'tabs') {
      const newField = Form.createFormField({ ...field });
      if (!('value' in newField)) {
        newField.value = undefined;
      }
      if (isPath(field.name || field.itemName)) {
        set(antdFields, field.name || field.itemName, newField);
      } else if (newField.type !== 'title') {
        antdFields[newField.name] = newField;
      }
    }
  });
  return antdFields;
}

export function validatePassword(rule, value, callback) {
  if (/\s/.test(value)) {
    callback('密码不可包含空格');
  }
  if (!/[0-9]/.test(value) || !/[A-Za-z]/.test(value)) {
    callback('密码必须包含字母和数字');
  }
  callback();
}

export function parseUrl(url = window.location.href) {
  const qs = url.substring(url.lastIndexOf('?') + 1);
  const args = {};
  const items = qs.length > 0 ? qs.split('&') : [];
  let item = null;
  let name = null;
  let value = null;
  for (let i = 0; i < items.length; i += 1) {
    item = items[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);

    if (name.length) {
      args[name] = value;
    }
  }

  return args;
}

/**
 * 时间格式转换，将 CST 格式转换为 GMT 格式
 */
export function dateFormatByCST(strDate) {
  const dateStr = strDate.split(' ');
  const strGMT = `${dateStr[0]} ${dateStr[1]} ${dateStr[2]} ${dateStr[5]} ${
    dateStr[3]
  } GMT+0800`;
  return new Date(Date.parse(strGMT));
}

/**
 * 数组对象去重
 */
export function uniqueArray(arr, name) {
  const obj = {};
  let newArr = [];
  newArr = arr.reduce((item, next) => {
    if (!obj[next[name]]) {
      obj[next[name]] = true;
      item.push(next);
    }
    return item;
  }, []);
  return newArr;
}

export function diffArray(a1, a2, name) {
  const res = [];
  a1.forEach(i => {
    if (
      !a2.some(j => {
        return j[name] === i[name];
      })
    ) {
      res.push(i);
    }
  });
  return res;
}

export function isNone(value) {
  return value === null || value === undefined || value === '';
}

const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  }
  return x !== x && y !== y;
}

export function shallowEqual(objA, objB, excludes = []) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i += 1) {
    if (excludes.indexOf(keysA[i]) === -1) {
      if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }
  }

  return true;
}
