import { message } from 'antd';
import fetch from '../../../../util/fetch';
import {
  createAction,
  mapReceivedData,
  mapToAntdFields,
  mapToSendData,
} from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const TPLDETAIL_REQUEST = 'TPLDETAIL_REQUEST';
const TPLDETAIL_SUCCESS = 'TPLDETAIL_SUCCESS';
const TPLDETAIL_FAILURE = 'TPLDETAIL_FAILURE';
const TPLDETAIL_RECORD_CHANGE = 'TPLDETAIL_RECORD_CHANGE';
const TPLDETAIL_RESET = 'TPLDETAIL_RESET';
const TPLDETAIL_SAVE_REQUEST = 'TPLDETAIL_SAVE_REQUEST';
const TPLDETAIL_SAVE_SUCCESS = 'TPLDETAIL_SAVE_SUCCESS';
const TPLDETAIL_SAVE_FAILURE = 'TPLDETAIL_SAVE_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: params => ({
    types: [TPLDETAIL_REQUEST, TPLDETAIL_SUCCESS, TPLDETAIL_FAILURE],
    callAPI: () => fetch('/xxx', params, { urlParam: true }),
    payload: params,
  }),
  changeRecord: createAction('TPLDETAIL_RECORD_CHANGE', 'fields'),
  reset: createAction('TPLDETAIL_RESET'),
  save: params => ({
    types: [
      TPLDETAIL_SAVE_REQUEST,
      TPLDETAIL_SAVE_SUCCESS,
      TPLDETAIL_SAVE_FAILURE,
    ],
    callAPI: () => fetch('/xxx', mapToSendData(params)),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TPLDETAIL_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [TPLDETAIL_SUCCESS]: (state, action) => {
    return {
      ...state,
      record: mapReceivedData(action.data),
      loading: false,
    };
  },
  [TPLDETAIL_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [TPLDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [TPLDETAIL_RESET]: state => ({
    ...state,
    record: mapToAntdFields(state.fields),
  }),
  [TPLDETAIL_SAVE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [TPLDETAIL_SAVE_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [TPLDETAIL_SAVE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  fields: [
    {
      label: '实例',
      name: 'demo',
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
