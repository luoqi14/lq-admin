import { message } from 'antd';
import fetch from '../util/fetch';
// ------------------------------------
// Constants
// ------------------------------------
const DICT_REQUEST = 'DICT_REQUEST';
const DICT_SUCCESS = 'DICT_SUCCESS';
const DICT_FAILURE = 'DICT_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
const dictRequest = (type) => ({
  type: 'DICT_REQUEST',
  payload: type,
});

const dictSuccess = (data, type) => ({
  type: 'DICT_SUCCESS',
  payload: data,
  dictType: type,
});

const dictFailure = (msg) => ({
  type: 'DICT_FAILURE',
  payload: msg,
});

export const dict = (type) => (dispatch, getState) => {
  dispatch(dictRequest(type));
  const dictCache = getState().dict;
  return new Promise((resolve, reject) => {
    if (dictCache[type]) {
      dispatch(dictSuccess(dictCache[type], type));
      resolve(dictCache[type]);
    } else {
      fetch('/dict/list', {
        type,
      })
        .then((json) => {
          if (json.resultCode === '0') {
            dispatch(dictSuccess(json.resultData, type));
            resolve(json.resultData.dicts);
          } else {
            dispatch(dictFailure(json.resultDesc));
            reject(json.resultDesc);
          }
        });
    }
  });
};

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [DICT_REQUEST]: (state) => ({
    ...state,
  }),
  [DICT_SUCCESS]: (state, action) => {
    const newState = {
      ...state,
    };

    newState[action.dictType] = action.payload.dicts;
    return newState;
  },
  [DICT_FAILURE]: (state, action) => {
    message.error(action.payload);
    return {
      ...state,
    };
  },
};

const initialState = {
};
export default function dictReducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
