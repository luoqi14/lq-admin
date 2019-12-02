import { message, notification } from 'antd';
import React from 'react';
import fetch from '../util/fetch';
import { history } from '../store/location';
import { createAction, JSON_CONTENT_TYPE } from '../util';
import '../util/fix';
import { hex_md5 as hexMd5 } from '../../lib/md5';
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
export const MENU_OPEN_CHANGE = 'MENU_OPEN_CHANGE';
export const CITY_CHANGE_REQUEST = 'CITY_CHANGE_REQUEST';
export const CITY_CHANGE_SUCCESS = 'CITY_CHANGE_SUCCESS';
export const CITY_CHANGE_FAILURE = 'CITY_CHANGE_FAILURE';
export const CITY_CHANGE = 'CITY_CHANGE';
export const CITY_INIT = 'CITY_INIT';

// ------------------------------------
// Actions
// ------------------------------------
function IEVersion() {
  const { userAgent } = navigator;
  const isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE;
  const isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.exec(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion === 7) {
      return 7;
    } else if (fIEVersion === 8) {
      return 8;
    } else if (fIEVersion === 9) {
      return 9;
    } else if (fIEVersion === 10) {
      return 10;
    }
    return 6;
  } else if (isEdge) {
    return 12;
  } else if (isIE11) {
    return 11;
  }
  return -1;
}

const IE = IEVersion();

export const common = {
  loadMenu: () => ({
    types: [MENU_REQUEST, MENU_SUCCESS, MENU_FAILURE],
    callAPI: () =>
      fetch(
        `${window.location.origin}/mock/menu.json`,
        {},
        {
          method: 'get',
        }
      ),
    callback: (payload, dispatch, state) => {
      // if forward to '/Manage', redirect to first link url according with the menu data
      if (window.location.pathname === '/Manage') {
        const matchs =
          JSON.stringify(state.common.menus).match(/"href":"([^"]+)"/) || [];
        if (matchs[1]) {
          const firstLink = matchs[1];
          firstLink && history.replace(firstLink);
        }
      }
      // select the menu
      dispatch(common.initMenu());
    },
  }),
  clickTopMenu: (
    id // when click top menu, find the first link under it
  ) => (dispatch, getState) => {
    const { menus } = getState().common;
    const topMenu = menus.find(menu => menu.id === id);
    const findLink = ms => {
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
  initCity: createAction(CITY_INIT, 'cityData'),
  showEditPwd: createAction(SHOW_EDITPWD),
  hideEditPwd: createAction(HIDE_EDITPWD),
  changeOpen: createAction(MENU_OPEN_CHANGE, 'openedKeys'),
  changeCity: cityId => ({
    types: [CITY_CHANGE_REQUEST, CITY_CHANGE_SUCCESS, CITY_CHANGE_FAILURE],
    callAPI: () =>
      fetch('/city/switchUserCityId', { cityId }, JSON_CONTENT_TYPE),
    payload: {
      cityId,
    },
  }),
  changeCityClient: createAction(CITY_CHANGE, 'cityId'),
  savePwd: params => ({
    types: [SAVE_PWD_REQUEST, SAVE_PWD_SUCCESS, SAVE_PWD_FAILURE],
    callAPI: () => {
      return fetch(
        '/updatePwd',
        {
          ...params,
          oldPwd: hexMd5(params.oldPwd),
          newPwd: hexMd5(params.newPwd),
        },
        JSON_CONTENT_TYPE
      );
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [MENU_REQUEST]: state => ({
    ...state,
  }),
  [MENU_SUCCESS]: (state, action) => {
    const res = [];
    const permission = {};
    const filterMenu = (menus = [], children = res) => {
      for (let i = 0; i < menus.length; i += 1) {
        const menu = menus[i];
        menu.id = `${menu.id}`;
        children.push(menu);
        if (menu.type === '2') {
          if (!permission[menu.parentId]) {
            permission[menu.parentId] = {};
          }
          permission[menu.parentId][menu.action] = 1;
        }
        if (menu.children) {
          const childMenu = menu.children;
          menu.children = [];
          menu.children = filterMenu(childMenu, menu.children);
          if (menu.type === '2') {
            children.pop();
          }
        }
      }
      return children;
    };
    const filterData = filterMenu(action.data);
    return {
      ...state,
      menus: filterData,
      permission,
    };
  },
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
    index > -1
      ? state.openedKeys.splice(index, 1)
      : state.openedKeys.push(action.payload);
    localStorage.setItem(
      'menuKeys',
      JSON.stringify([
        state.selectedTopKeys,
        state.openedKeys,
        state.selectedKeys,
      ])
    );
    return {
      ...state,
      openedKeys: state.openedKeys,
    };
  },
  [CLICK_MENU_ITEM]: (state, action) => {
    const selectedKeys = [action.payload];
    // anyway, we should keep it persistent,
    // so we can get it previous state if some router not match the menu like detail page
    localStorage.setItem(
      'menuKeys',
      JSON.stringify([state.selectedTopKeys, state.openedKeys, selectedKeys])
    );
    return {
      ...state,
      selectedKeys,
    };
  },
  [INIT_MENU]: state => {
    const menuKeys = [];

    // recursion to find the matched menu and its parentIds
    const findMenu = menus => {
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
    if (menuKeys.length === 0) {
      // if not matched, get the menu state from storage
      [selectedTopKeys, openedKeys, selectedKeys] = [
        ...(JSON.parse(localStorage.getItem('menuKeys')) || [[], [], []]),
      ];
    } else {
      selectedTopKeys = [menuKeys[0]];
      selectedKeys = [menuKeys.pop()];
      openedKeys = menuKeys;
    }
    openedKeys = Array.from(new Set(openedKeys.concat(state.openedKeys))); // combine the submenu open state
    localStorage.setItem(
      'menuKeys',
      JSON.stringify([selectedTopKeys, openedKeys, selectedKeys])
    );

    return {
      ...state,
      // these key state is persistent, so we should save them to store
      selectedTopKeys,
      openedKeys,
      selectedKeys,
    };
  },
  [INIT_COMMON]: state => {
    // not usable
    // detect browser version
    const userAgent =
      (navigator.userAgent.match(/Chrome\/(\d+)\./) || [])[1] || 0;
    ((IE < 11 && IE !== -1) || (userAgent && +userAgent < 56)) &&
      notification.warning({
        duration: null,
        message:
          '时光荏苒，白马过隙，您的浏览器版本较低需要升级，以获得最好体验',
        description: (
          <div>
            请下载使用
            <a href="//www.chromeliulanqi.com/Chrome_Latest_Setup.exe">
              最新版chrome浏览器
            </a>
          </div>
        ),
      });
    return {
      ...state,
      editPwdVisible: false,
    };
  },
  [SHOW_EDITPWD]: state => ({
    ...state,
    editPwdVisible: true,
  }),
  [HIDE_EDITPWD]: state => ({
    ...state,
    editPwdVisible: false,
  }),
  [SAVE_PWD_REQUEST]: state => ({
    ...state,
    savePwdLoading: true,
  }),
  [SAVE_PWD_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      savePwdLoading: false,
      editPwdVisible: false,
    };
  },
  [SAVE_PWD_FAILURE]: state => {
    return {
      ...state,
      savePwdLoading: false,
    };
  },
  [COLLAPSE_SUB_MENU]: state => ({
    ...state,
    openedKeys: [],
  }),
  [MENU_OPEN_CHANGE]: (state, action) => ({
    ...state,
    openedKeys: action.openedKeys,
  }),
  [CITY_CHANGE_REQUEST]: state => ({
    ...state,
  }),
  [CITY_CHANGE_SUCCESS]: (state, action) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    user.city = {
      cityId: action.cityId,
      cityName: state.cityData.find(c => +c.cityId === +action.cityId).cityName,
    };
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      cityId: action.cityId,
    };
  },
  [CITY_CHANGE_FAILURE]: state => {
    return {
      ...state,
    };
  },
  [CITY_INIT]: (state, action) => {
    return {
      ...state,
      cityData: action.cityData,
    };
  },
  [CITY_CHANGE]: (state, action) => {
    return {
      ...state,
      cityId: action.cityId,
    };
  },
};

let cityListStr = localStorage.getItem('cityList');
if (cityListStr === 'undefined') {
  // why undefined string
  cityListStr = '[]';
}
const initialState = {
  menus: [],
  editPwdVisible: false,
  savePwdLoading: false,
  permission: {},
  selectedKeys: [],
  openedKeys: [],
  selectedTopKeys: [],
  cityData: JSON.parse(cityListStr),
  loading: false,
  cityId: localStorage.getItem('cityId'),
};
export default function commonReducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
