import { message, notification } from 'antd';
import React from 'react';
import fetch from 'lq-fetch';
import { history } from '../store/location';
import { createAction } from '../util';
import '../util/fix';

const CryptoJS = require('../../lib/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
export const MENU_REQUEST = 'MENU_REQUEST';
export const MENU_SUCCESS = 'MENU_SUCCESS';
export const MENU_FAILURE = 'MENU_FAILURE';
export const SHOW_EDITPWD = 'SHOW_EDITPWD';
export const HIDE_EDITPWD = 'HIDE_EDITPWD';
export const SAVE_PWD_REQUEST = 'SAVE_PWD_REQUEST';
export const SAVE_PWD_SUCCESS = 'SAVE_PWD_SUCCESS';
export const SAVE_PWD_FAILURE = 'SAVE_PWD_FAILURE';
export const CLICK_TOP_MENU = 'CLICK_TOP_MENU';
export const CLICK_SUB_MENU = 'CLICK_SUB_MENU';
export const CLICK_MENU_ITEM = 'CLICK_MENU_ITEM';
export const INIT_MENU = 'INIT_MENU';
export const INIT_COMMON = 'INIT_COMMON';
export const COLLAPSE_SUB_MENU = 'COLLAPSE_SUB_MENU';

// ------------------------------------
// Actions
// ------------------------------------
const key = CryptoJS.enc.Latin1.parse('eGluZ3Vhbmd4Yw==');
const iv = CryptoJS.enc.Latin1.parse('voskplutwrfnnpuk');

export const common = {
  loadMenu: () => ({
    types: [MENU_REQUEST, MENU_SUCCESS, MENU_FAILURE],
    callAPI: () => fetch(`//${window.location.host}/mock/menu.json`, {}, {
      method: 'GET',
    }),
    callback: (payload, dispatch) => {
      // if forward to '/Manage', redirect to first link url according with the menu data
      // if (location.pathname === '/Manage') {
      //   const matchs = JSON.stringify(state.common.menus).match(/"href":"([^"]*)"/) || [];
      //   if (matchs[1]) {
      //     const firstLink = matchs[1];
      //     firstLink && history.replace(firstLink);
      //   }
      // }
      // select the menu
      dispatch(common.initMenu());
    },
  }),
  clickTopMenu: (id) => // when click top menu, find the first link under it
    (dispatch, getState) => {
      const { menus } = getState().common;
      const topMenu = menus.find((menu) => menu.id === id);
      const findLink = (ms) => {
        for (let i = 0; i < ms.length; i += 1) {
          const menu = ms[i];
          if (menu.children) {
            return findLink(menu.children);
          } else if (menu.href) {
            return menu;
          }
        }
        return false;
      };

      const firstLeafMenu = findLink(topMenu.children);
      history.push(firstLeafMenu.href);
      // dispatch(common.initMenu())
    },
  clickMenuItem: createAction(CLICK_MENU_ITEM, 'payload'),
  clickSubMenu: createAction(CLICK_SUB_MENU, 'payload'),
  collapseSubMenu: createAction(COLLAPSE_SUB_MENU),
  initMenu: createAction(INIT_MENU),
  initCommon: createAction(INIT_COMMON),
  showEditPwd: createAction(SHOW_EDITPWD),
  hideEditPwd: createAction(HIDE_EDITPWD),
  savePwd: (params) => {
    const newParams = params;
    const oldPassword = CryptoJS.AES.encrypt(
      newParams.oldPassword,
      key,
      {
        iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      }
    );
    const newPassword = CryptoJS.AES.encrypt(
      newParams.newPassword,
      key,
      {
        iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      }
    );
    newParams.oldPassword = oldPassword.toString();
    newParams.newPassword = newPassword.toString();
    return {
      types: [SAVE_PWD_REQUEST, SAVE_PWD_SUCCESS, SAVE_PWD_FAILURE],
      callAPI: () => fetch('/modifyPWD', newParams),
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [MENU_REQUEST]: (state) => ({
    ...state,
  }),
  [MENU_SUCCESS]: (state, action) => ({
    ...state,
    menus: action.data,
  }),
  [MENU_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
    };
  },
  [CLICK_TOP_MENU]: (state, action) => {
    const selectedTopKeys = [action.payload];

    return {
      ...state,
      selectedTopKeys,
    };
  },
  [CLICK_SUB_MENU]: (state, action) => {
    // toggle the sideSubMenu, not the leaf
    const index = state.openedKeys.indexOf(action.payload);
    index > -1 ? state.openedKeys.splice(index, 1) : state.openedKeys.push(action.payload);
    localStorage.setItem('menuKeys', JSON.stringify([state.selectedTopKeys, state.openedKeys, state.selectedKeys]));
    return {
      ...state,
      openedKeys: state.openedKeys,
    };
  },
  [CLICK_MENU_ITEM]: (state, action) => {
    const selectedKeys = [action.payload];
    // anyway, we should keep it persistent,
    // so we can get it previous state if some router not match the menu like detail page
    localStorage.setItem('menuKeys', JSON.stringify([state.selectedTopKeys, state.openedKeys, selectedKeys]));
    return {
      ...state,
      selectedKeys,
    };
  },
  [INIT_MENU]: (state) => {
    const menuKeys = [];

    // recursion to find the matched menu and its parentIds
    const findMenu = (menus) => {
      let res = false;
      for (let i = 0; i < menus.length; i += 1) {
        const menu = menus[i];
        menuKeys.push(menu.id);
        if (menu.href === window.location.pathname) {
          return true;
        } else if (menu.children) {
          res = findMenu(menu.children);
          if (!res) {
            menuKeys.pop();
          } else {
            return true;
          }
        } else {
          menuKeys.pop();
        }
      }
      return res;
    };

    findMenu(state.menus);

    let selectedTopKeys = [];
    let openedKeys = [];
    let selectedKeys = [];
    if (menuKeys.length === 0) { // if not matched, get the menu state from storage
      [selectedTopKeys, openedKeys, selectedKeys] =
        [...(JSON.parse(localStorage.getItem('menuKeys')) || [[], [], []])];
    } else {
      selectedTopKeys = [menuKeys[0]];
      selectedKeys = [menuKeys.pop()];
      openedKeys = menuKeys;
    }
    openedKeys = Array.from(new Set(openedKeys.concat(state.openedKeys))); // combine the submenu open state
    localStorage.setItem('menuKeys', JSON.stringify([selectedTopKeys, openedKeys, selectedKeys]));

    return {
      ...state,
      // these key state is persistent, so we should save them to store
      selectedTopKeys,
      openedKeys,
      selectedKeys,
    };
  },
  [INIT_COMMON]: (state) => { // not usable
    const user = JSON.parse(localStorage.getItem('user'));

    // detect browser version
    const userAgent = (navigator.userAgent.match(/Chrome\/(\d+)\./) || [])[1] || 0;
    userAgent && (+userAgent < 54) && notification.warning({
      duration: null,
      message: '浏览器版本过低',
      description: <div>请下载<a href="http://www.chromeliulanqi.com/Chrome_Latest_Setup.exe">最新版chrome浏览器</a></div>,
    });
    return {
      ...state,
      editPwdVisible: (user && user.firstLogin) || false,
    };
  },
  [SHOW_EDITPWD]: (state) => ({
    ...state,
    editPwdVisible: true,
  }),
  [HIDE_EDITPWD]: (state) => ({
    ...state,
    editPwdVisible: false,
  }),
  [SAVE_PWD_REQUEST]: (state) => ({
    ...state,
    savePwdLoading: true,
  }),
  [SAVE_PWD_SUCCESS]: (state) => {
    message.success('操作成功');
    return {
      ...state,
      savePwdLoading: false,
      editPwdVisible: false,
    };
  },
  [SAVE_PWD_FAILURE]: (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      savePwdLoading: false,
    };
  },
  [COLLAPSE_SUB_MENU]: (state) => ({
    ...state,
    openedKeys: [],
  }),
};

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  menus: [],
  editPwdVisible: (user && user.firstLogin) || false,
  savePwdLoading: false,
  permission: {},
  selectedKeys: [],
  openedKeys: [],
  selectedTopKeys: [],
};
export default function commonReducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
