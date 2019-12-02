import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import getTotal from '../selectors';
import { getMenuRouter } from '../../../../selectors';
import View from '../components';

const mapDispatchToProps = {
  ...actions,
};

const mapStateToProps = state => {
  const localState = state[moduleName];
  return {
    ...localState,
    total: getTotal(state),
    menuRouter: getMenuRouter(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
