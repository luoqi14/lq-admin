import fetch from '@f12/fetch';
import { message } from 'antd';
import { createAction, mapReceivedData, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const @@MODULENAME@@_LOAD_REQUEST = '@@MODULENAME@@_LOAD_REQUEST';
const @@MODULENAME@@_LOAD_SUCCESS = '@@MODULENAME@@_LOAD_SUCCESS';
const @@MODULENAME@@_LOAD_FAILURE = '@@MODULENAME@@_LOAD_FAILURE';
const @@MODULENAME@@_SAVE_REQUEST = '@@MODULENAME@@_SAVE_REQUEST';
const @@MODULENAME@@_SAVE_SUCCESS = '@@MODULENAME@@_SAVE_SUCCESS';
const @@MODULENAME@@_SAVE_FAILURE = '@@MODULENAME@@_SAVE_FAILURE';
const @@MODULENAME@@_RECORD_CHANGE = '@@MODULENAME@@_RECORD_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [@@MODULENAME@@_LOAD_REQUEST, @@MODULENAME@@_LOAD_SUCCESS, @@MODULENAME@@_LOAD_FAILURE],
    callAPI: () => fetch('/detail', params),
    payload: params,
  }),
  save: (params) => ({
    types: [@@MODULENAME@@_SAVE_REQUEST, @@MODULENAME@@_SAVE_SUCCESS, @@MODULENAME@@_SAVE_FAILURE],
    callAPI: () => fetch('/detail/save', params),
    payload: params,
  }),
  changeRecord: createAction('@@MODULENAME@@_RECORD_CHANGE', 'fields'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [@@MODULENAME@@_LOAD_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [@@MODULENAME@@_LOAD_SUCCESS]: (state, action) => {
    return {
      ...state,
      record: mapReceivedData(action.data),
      loading: false,
    };
  },
  [@@MODULENAME@@_LOAD_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [@@MODULENAME@@_SAVE_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [@@MODULENAME@@_SAVE_SUCCESS]: (state) => {
    message('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [@@MODULENAME@@_SAVE_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [@@MODULENAME@@_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fields: [
    {
      type: 'title',
      label: '标题',
      className: 'warning',
    },
    {
      label: '输入框',
      name: 'input1',
      value: '默认值',
    },
  ],
  buttons: [
    {
      label: '提交',
      onClick: 'func:submit',
    },
  ],
};
initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
