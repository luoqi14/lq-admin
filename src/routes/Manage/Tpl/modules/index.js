import { message } from 'antd';
import fetch from '../../../../util/fetch';
import { createAction, mapToAntdFields, mapToSendData } from '../../../../util';
import { moduleReducer } from '../../../../store/reducers';
// ------------------------------------
// Constants
// ------------------------------------
const TPL_REQUEST = 'TPL_REQUEST';
const TPL_SUCCESS = 'TPL_SUCCESS';
const TPL_FAILURE = 'TPL_FAILURE';
const TPL_SEARCH_CHANGE = 'TPL_SEARCH_CHANGE';
const TPL_DELETE_REQUEST = 'TPL_DELETE_REQUEST';
const TPL_DELETE_SUCCESS = 'TPL_DELETE_SUCCESS';
const TPL_DELETE_FAILURE = 'TPL_DELETE_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: params => ({
    types: [TPL_REQUEST, TPL_SUCCESS, TPL_FAILURE],
    callAPI: () => fetch('/xxx/list', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction(TPL_SEARCH_CHANGE, 'fields'),
  delete: params => ({
    types: [TPL_DELETE_REQUEST, TPL_DELETE_SUCCESS, TPL_DELETE_FAILURE],
    callAPI: () =>
      fetch('/xxx/delete', mapToSendData(params), { urlParam: true }),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TPL_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [TPL_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.rows,
    loading: false,
    page: {
      pageNo: action.pageNo,
      pageSize: action.pageSize,
      total: action.data.total,
    },
  }),
  [TPL_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [TPL_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [TPL_DELETE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [TPL_DELETE_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [TPL_DELETE_FAILURE]: state => ({
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
      label: '名称',
      name: 'name',
      search: true,
    },
    {
      label: '创建时间',
      name: 'createTime',
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
