import { message } from 'antd';

const CryptoJS = require('../../../../lib/crypto-js');
// ------------------------------------
// Constants
// ------------------------------------
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
const loginRequest = (params) => ({
  type: LOGIN_REQUEST,
  payload: params,
});

const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

// const loginFailure = (params) => ({
//   type: LOGIN_FAILURE,
//   payload: params,
// });

const key = CryptoJS.enc.Latin1.parse('eGluZ3Vhbmd0YmI=');
const iv = CryptoJS.enc.Latin1.parse('svtpdprtrsjxabcd');

const login = (params) => (dispatch) => {
  const newParams = {
    ...params,
  };
  dispatch(loginRequest(newParams));
  const encrypted = CryptoJS.AES.encrypt(
    newParams.password,
    key,
    {
      iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
    }
  );
  newParams.password = encrypted.toString();

  return new Promise((resolve) => {
    dispatch(loginSuccess(newParams));
    resolve(newParams);
  });
};

export const actions = {
  login,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST]: (state, action) => ({
    ...state,
    username: action.payload.username,
    password: action.payload.password,
    loading: true,
  }),
  [LOGIN_SUCCESS]: (state, action) => {
    localStorage.setItem('accessToken', action.payload.password);
    localStorage.setItem('user', JSON.stringify(action.payload));
    return {
      ...state,
      user: action.payload,
      loading: false,
    };
  },
  [LOGIN_FAILURE]: (state, action) => {
    message.error(action.payload);
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
