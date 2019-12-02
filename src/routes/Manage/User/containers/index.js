import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import { getMenuRouter } from '../../../../selectors';
import View from '../components';

const mapDispatchToProps = {
  ...actions,
};

const mapStateToProps = state => {
  const localState = state[moduleName];
  return {
    ...localState,
    menuRouter: getMenuRouter(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
