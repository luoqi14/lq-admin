import { combineReducers } from 'redux';
import commonReducer from './common';
import dictReducer from './dict';
import locationReducer from './location';

export const makeRootReducer = asyncReducers =>
  // 合并
  combineReducers({
    common: commonReducer,
    dict: dictReducer,
    location: locationReducer,
    ...asyncReducers,
  });

export const injectReducer = (store, { key, reducer }) => {
  const newStore = store;
  // if (Object.hasOwnProperty.call(newStore.asyncReducers, key)) return;
  newStore.asyncReducers[key] = reducer;
  newStore.replaceReducer(makeRootReducer(newStore.asyncReducers));
};

export function moduleReducer(
  state,
  action = {},
  initialState,
  ACTION_HANDLERS
) {
  const resState = state;
  // below code will not persist the loaded module state, and all will init
  // if (action.type === '@@redux/INIT') {
  //   resState = initialState;
  // }
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(resState, action) : resState;
}

export default makeRootReducer;
