import { injectReducer } from '../../../store/reducers';
import { store } from '../../../main';
import Container from './containers';
import reducer from './modules';

export const moduleName = 'Tpl';
injectReducer(store, { key : moduleName, reducer });

export default Container;
