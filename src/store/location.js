import createHistory from 'history/createBrowserHistory';
import { common } from './common';

export const history = createHistory();

// ------------------------------------
// Constants
// ------------------------------------
export const LOCATION_CHANGE = 'LOCATION_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export function locationChange(location = '/') {
  return {
    type    : LOCATION_CHANGE,
    payload : location,
  };
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
// 路由路径变化
export const updateLocation = ({ dispatch }) => (nextLocation) => {
  dispatch(locationChange(nextLocation));
  dispatch(common.initMenu());
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = history.location;
export default function locationReducer(state = initialState, action = {}) {
  return action.type === LOCATION_CHANGE
    ? action.payload
    : state;
}
