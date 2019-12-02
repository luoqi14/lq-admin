import { message } from 'antd';
import fetch from '../../../../util/fetch';
import {
  createAction,
  JSON_CONTENT_TYPE,
  mapReceivedData,
  mapToAntdFields,
} from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const ROLEDETAIL_REQUEST = 'ROLEDETAIL_REQUEST';
const ROLEDETAIL_SUCCESS = 'ROLEDETAIL_SUCCESS';
const ROLEDETAIL_FAILURE = 'ROLEDETAIL_FAILURE';
const ROLEDETAIL_RECORD_CHANGE = 'ROLEDETAIL_RECORD_CHANGE';
const ROLEDETAIL_RESET = 'ROLEDETAIL_RESET';
const ROLEDETAIL_SAVE_REQUEST = 'ROLEDETAIL_SAVE_REQUEST';
const ROLEDETAIL_SAVE_SUCCESS = 'ROLEDETAIL_SAVE_SUCCESS';
const ROLEDETAIL_SAVE_FAILURE = 'ROLEDETAIL_SAVE_FAILURE';
const ROLEDETAIL_MENU_REQUEST = 'ROLEDETAIL_MENU_REQUEST';
const ROLEDETAIL_MENU_SUCCESS = 'ROLEDETAIL_MENU_SUCCESS';
const ROLEDETAIL_MENU_FAILURE = 'ROLEDETAIL_MENU_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: params => ({
    types: [ROLEDETAIL_REQUEST, ROLEDETAIL_SUCCESS, ROLEDETAIL_FAILURE],
    callAPI: () =>
      fetch('/role/detail', params, { ...JSON_CONTENT_TYPE, urlParam: true }),
    payload: params,
  }),
  changeRecord: createAction('ROLEDETAIL_RECORD_CHANGE', 'fields'),
  reset: createAction('ROLEDETAIL_RESET'),
  save: params => ({
    types: [
      ROLEDETAIL_SAVE_REQUEST,
      ROLEDETAIL_SAVE_SUCCESS,
      ROLEDETAIL_SAVE_FAILURE,
    ],
    callAPI: () => fetch('/role/update', params, JSON_CONTENT_TYPE),
    payload: params,
  }),
  loadMenu: params => ({
    types: [
      ROLEDETAIL_MENU_REQUEST,
      ROLEDETAIL_MENU_SUCCESS,
      ROLEDETAIL_MENU_FAILURE,
    ],
    callAPI: () =>
      fetch('/menu/list', params, { ...JSON_CONTENT_TYPE, urlParam: true }),
    payload: { ...params, menuType: params.type },
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ROLEDETAIL_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [ROLEDETAIL_SUCCESS]: (state, action) => {
    return {
      ...state,
      record: mapReceivedData(action.data),
      loading: false,
    };
  },
  [ROLEDETAIL_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [ROLEDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [ROLEDETAIL_RESET]: state => ({
    ...state,
    record: mapToAntdFields(state.fields),
  }),
  [ROLEDETAIL_SAVE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [ROLEDETAIL_SAVE_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [ROLEDETAIL_SAVE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [ROLEDETAIL_MENU_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [ROLEDETAIL_MENU_SUCCESS]: (state, action) => {
    const newState = { ...state };
    if (action.menuType == 2) {
      newState.appMenuData = action.data;
    } else {
      newState.menuData = action.data;
    }
    return {
      ...newState,
      loading: false,
    };
  },
  [ROLEDETAIL_MENU_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  menuData: [],
  appMenuData: [],
  fields: [
    {
      label: '基础信息',
      type: 'title',
    },
    {
      label: 'ID',
      name: 'id',
      hidden: true,
    },
    {
      label: 'ID',
      name: 'roleId',
      hidden: true,
    },
    {
      label: '角色名称',
      name: 'roleName',
    },
    {
      label: '权限设置',
      type: 'title',
    },
    {
      label: '后台菜单',
      name: 'menuIdList',
      type: 'tree',
      wrapperSpan: 20,
      data: 'props:menuData',
      valueKey: 'id',
      title: 'name',
      canCheckAll: true,
      checkStrictly: true,
      required: false,
    },
    {
      label: 'app模块',
      name: 'appMenuIdList',
      type: 'tree',
      wrapperSpan: 20,
      data: 'props:appMenuData',
      valueKey: 'id',
      title: 'name',
      canCheckAll: true,
      checkStrictly: true,
    },
  ],
  buttons: [
    {
      label: '取消',
      type: 'default',
      onClick: 'func:cancel',
    },
    {
      label: '保存',
      onClick: 'func:submit',
    },
  ],
  typeMap: {
    1: '新增',
    2: '编辑',
    3: '详情',
  },
};

initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
