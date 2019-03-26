import fetch from '../../../../util/fetch';
import { createAction, mapToAntdFields } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const TPLDETAIL_REQUEST = 'TPLDETAIL_REQUEST';
const TPLDETAIL_SUCCESS = 'TPLDETAIL_SUCCESS';
const TPLDETAIL_FAILURE = 'TPLDETAIL_FAILURE';
const TPLDETAIL_RECORD_CHANGE = 'TPLDETAIL_RECORD_CHANGE';
const TPLDETAIL_RESET = 'TPLDETAIL_RESET';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [TPLDETAIL_REQUEST, TPLDETAIL_SUCCESS, TPLDETAIL_FAILURE],
    callAPI: () => fetch('/xxx', params),
    payload: params,
  }),
  reset: createAction('TPLDETAIL_RESET'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TPLDETAIL_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [TPLDETAIL_SUCCESS]: (state) => {
    return {
      ...state,
      loading: false,
    };
  },
  [TPLDETAIL_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [TPLDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [TPLDETAIL_RESET]: (state) => ({
    ...state,
    record: mapToAntdFields(state.fields),
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  fields: [{
    label: '实例',
    name: 'demo',
  }],
  buttons: [{
    label: '取消',
    type: 'default',
    onClick: 'func:cancel',
  }, {
    label: '保存',
    onClick: 'func:submit',
  }],
};

initialState.record = mapToAntdFields(initialState.fields);

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
