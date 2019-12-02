/* eslint-disable global-require,camelcase,import/first */
import React from 'react';
import ReactDOM from 'react-dom';
// import * as Sentry from '@sentry/browser';
import { LocaleProvider, message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import fetch from './util/fetch';
import './styles/core.scss';
import './util/fix';
import createStore from './store/createStore';
import { getBaseUrl } from './util';
import { history } from './store/location';

// if (__ONLINE__) {
//   Sentry.init({
//     dsn: 'https://e5c466edfe02450b8bc364725dc83237@sentry.dailuobo.com/9',
//   });
// }

message.config({
  maxCount: 1,
});

// ========================================================
// fetch init
// ========================================================

fetch.init({
  baseUrl: getBaseUrl,
  monitor: {
    start: () => {},
    end: () => {},
    error: () => {},
  },
  addAuth: () => localStorage.getItem('accessToken') || '',
  hash: process.env.version,
});

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);

window.storeManager = store;
// user logout or switch env should clear
window.storeManager.clear = (excludes = []) => {
  const state = window.storeManager.getState() || {};
  const keys = Object.keys(state);
  keys.forEach(key => {
    if (excludes.indexOf(key) === -1) {
      state[key] = undefined;
    }
  });
};

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const App = require('./containers/AppContainer').default;
  ReactDOM.render(
    <LocaleProvider locale={zhCN}>
      <App store={store} />
    </LocaleProvider>,
    MOUNT_NODE
  );
};

// This code is excluded from production bundle

const RedBox = __LOCAL__ ? require('redbox-react').default : null;

if (__LOCAL__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = error => {
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
    module.hot.accept(
      [
        './containers/AppContainer',
        './routes/index',
        './store/location.js',
        './store/createStore.js',
      ],
      () =>
        setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE);
          render();
        })
    );
  }
}

// ========================================================
// Go!
// ========================================================
render();

window.addEventListener(
  'keydown',
  e => {
    if (e.keyCode === 27) {
      // escape
      history.goBack();
    }
  },
  false
);

export default store;

export { store };
