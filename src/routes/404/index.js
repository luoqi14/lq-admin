import { injectReducer } from '../../store/reducers';

export const moduleName = '404';

export default (store) => ({
  path : '*',
  onEnter: (opts, replace, next) => {
    next();
  },
  onLeave: () => {
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const propertyContainer = require('./containers/index').default;
      const reducer = require('./modules/index').default;

      injectReducer(store, { key: moduleName, reducer });

      cb(null, propertyContainer);
    });
  },
});
