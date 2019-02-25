import { message } from 'antd';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const TPL_HELLO = 'TPL_HELLO';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  hello: createAction(TPL_HELLO),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TPL_HELLO]    : (state) => {
    message.info(state.helloText);
    return {
      ...state,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  helloText: 'I’m a mother father gentleman',
  nums: [1, 2],
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
