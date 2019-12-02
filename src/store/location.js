import { createBrowserHistory } from 'history';
import { common } from './common';

export const history = createBrowserHistory();

// ------------------------------------
// Constants
// ------------------------------------
export const LOCATION_CHANGE = 'LOCATION_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export function locationChange(location = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location,
  };
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
// 路由路径变化
export const updateLocation = ({ dispatch }) => nextLocation => {
  // window.history.replaceState({
  //   key: nextLocation.key,
  //   state: nextLocation.state,
  // }, null, `${nextLocation.pathname}?_=${new Date().valueOf()}`);
  dispatch(locationChange(nextLocation));
  dispatch(common.initMenu());
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = history.location;
export default function locationReducer(state = initialState, action = {}) {
  return action.type === LOCATION_CHANGE ? action.payload : state;
}
