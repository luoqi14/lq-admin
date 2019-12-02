import fetch from '../../../util/fetch';
import { JSON_CONTENT_TYPE, mapToSendData } from '../../../util';
import { hex_md5 as hexMd5 } from '../../../../lib/md5';
// ------------------------------------
// Constants
// ------------------------------------
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  login: params => ({
    types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
    callAPI: () =>
      fetch(
        `${window.location.origin}/users/login`,
        mapToSendData({ ...params, password: hexMd5(params.password) }),
        JSON_CONTENT_TYPE
      ),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => {
    localStorage.setItem('accessToken', action.data.token);
    localStorage.setItem('username', action.phone);
    return {
      ...state,
      loading: false,
    };
  },
  [LOGIN_FAILURE]: state => {
    localStorage.setItem('accessToken', '');
    return {
      ...state,
      user: '',
      loading: false,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  detail: true,
  username: '',
  password: '',
  user: '',
  loading: false,
};
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
