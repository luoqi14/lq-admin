import { message } from 'antd';
import fetch from '../../../../util/fetch';
import {
  createAction,
  mapToAntdFields,
  mapToSendData,
  JSON_CONTENT_TYPE,
} from '../../../../util';
import { moduleReducer } from '../../../../store/reducers';
// ------------------------------------
// Constants
// ------------------------------------
const ROLE_REQUEST = 'ROLE_REQUEST';
const ROLE_SUCCESS = 'ROLE_SUCCESS';
const ROLE_FAILURE = 'ROLE_FAILURE';
const ROLE_SEARCH_CHANGE = 'ROLE_SEARCH_CHANGE';
const ROLE_DELETE_REQUEST = 'ROLE_DELETE_REQUEST';
const ROLE_DELETE_SUCCESS = 'ROLE_DELETE_SUCCESS';
const ROLE_DELETE_FAILURE = 'ROLE_DELETE_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: params => ({
    types: [ROLE_REQUEST, ROLE_SUCCESS, ROLE_FAILURE],
    callAPI: () =>
      fetch('/role/list', mapToSendData(params), JSON_CONTENT_TYPE),
    payload: params,
  }),
  changeSearch: createAction(ROLE_SEARCH_CHANGE, 'fields'),
  delete: params => ({
    types: [ROLE_DELETE_REQUEST, ROLE_DELETE_SUCCESS, ROLE_DELETE_FAILURE],
    callAPI: () => fetch('/role/remove', params, JSON_CONTENT_TYPE),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ROLE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [ROLE_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.rows,
    loading: false,
    page: {
      pageNo: action.pageNo,
      pageSize: action.pageSize,
      total: action.data.total,
    },
  }),
  [ROLE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [ROLE_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [ROLE_DELETE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [ROLE_DELETE_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [ROLE_DELETE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  searchParams: {},
  page: {
    pageNo: 1,
    pageSize: 10,
  },
  columns: [
    {
      label: '角色名称',
      name: 'name',
      search: true,
    },
    {
      label: '创建者',
      name: 'createUser',
    },
    {
      label: '创建时间',
      name: 'createTime',
      type: 'datetime',
    },
    {
      label: '更新者',
      name: 'updateUser',
    },
    {
      label: '更新时间',
      name: 'updateTime',
      type: 'datetime',
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  buttons: [
    {
      label: '新增',
      onClick: 'func:btnClick',
    },
  ],
};
initialState.searchParams = mapToAntdFields(
  initialState.columns.filter(col => col.search)
);

export default function reducer(state = initialState, action = {}) {
  return moduleReducer(state, action, initialState, ACTION_HANDLERS);
}
