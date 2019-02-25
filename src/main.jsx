/* eslint-disable global-require,camelcase */
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'lq-fetch';
import { LocaleProvider, message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './styles/core.scss';
import './util/fix';
import createStore from './store/createStore';
import { getBaseUrl, getUserBaseUrl } from './util';
import { history } from './store/location';

message.config({
  maxCount: 1,
});

// ========================================================
// countly init
// ========================================================
// const getCountlyKey = (env) => {
//   if (env === 'online') {
//     return '';
//   }
//   return '';
// };
// CountlyUtil.init(getCountlyKey(getEnv()), getEnv());

// ========================================================
// fetch init
// ========================================================

fetch.init({
  baseUrl: getBaseUrl(),
  // different project has different token when ever not login yet
  addAuth: () => localStorage.getItem('accessToken') || 'Basic xxxxxxxx',
  monitor: {
    start: () => {},
    end: () => {},
    error: () => {},
  },
  hash: process.env.version,
  refreshToken: {
    invalidCode: '-5',
    url: `${getUserBaseUrl()}/token/refresh`,
    getValue: () => localStorage.getItem('refreshToken'),
    key: 'refreshToken',
    tokenName: 'access_token',
    beforeRefresh: () => {
      localStorage.setItem('accessToken', '');
    },
    afterRefresh: (res) => {
      if (res.resultCode === '0') {
        const { access_token, refresh_token } = res.resultData;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
      } else {
        localStorage.setItem('accessToken', '');
        history.push({ pathname: '/SignIn' });
        window.storeManager.clear();
      }
    },
  },
});

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);

window.storeManager = store;
// user logout or switch env should clear
window.storeManager.clear = () => {
  const state = window.storeManager.getState() || {};
  const keys = Object.keys(state);
  keys.forEach((key) => {
    state[key] = undefined;
  });
};

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const App = require('./containers/AppContainer').default;
  ReactDOM.render(
    <LocaleProvider locale={zhCN}><App store={store} /></LocaleProvider>,
    MOUNT_NODE
  );
};

// This code is excluded from production bundle

const RedBox = __LOCAL__ ? require('redbox-react').default : null;

if (__LOCAL__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept([
      './containers/AppContainer',
      './routes/index',
      './store/location.js',
      './store/createStore.js',
    ], () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      }));
  }
}

// ========================================================
// Go!
// ========================================================
render();

export default store;

export { store };
