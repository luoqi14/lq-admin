import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import message from '../components/message';
import reducers from './reducers';
import { updateLocation, history } from './location';

function callAPIMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    const {
      types,
      callAPI,
      shouldCallAPI,
      payload = {},
      callback,
    } = action;

    if (!types) {
      // Normal action: pass it on
      return next(action);
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every((type) => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }


    if (typeof shouldCallAPI === 'function' && !shouldCallAPI(getState())) {
      const ret = {};
      ret.then = () => undefined; // fix the no then function error
      return ret;
    }

    const [requestType, successType, failureType] = types;

    dispatch(Object.assign({}, payload, {
      type: requestType,
    }));

    return callAPI(getState()).then(
      (response) => {
        if (response.errorCode === 0) {
          localStorage.setItem('accessToken', '');
          history.push('/SignIn');
        } else if (response.success) {
          const newPayload = {
            ...payload,
            data: response.payload,
            type: successType,
            success: true,
          };
          dispatch(newPayload);
          callback && callback(newPayload, dispatch, getState());
          return newPayload;
        }
        const failurePayload = {
          msg: response.msg,
          type: failureType,
          success: false,
        };
        message.error(response.msg);
        dispatch(failurePayload);
        callback && callback(failurePayload, dispatch, getState());
        return failurePayload;
      },
      (error) => {
        const errorPayload = {
          msg: error,
          type: failureType,
          success: false,
        };
        message.error(error);
        dispatch(errorPayload);
        callback && callback(errorPayload, dispatch, getState());
      }
    );
  };
}

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, callAPIMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];

  let composeEnhancers = compose;

  if (__LOCAL__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    reducers(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = history.listen(updateLocation(store));
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
