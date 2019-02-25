import { connect } from 'react-redux';
import { actions } from '../modules/index';
import { moduleName } from '../index';

import View from '../components/index';

const mapDispatchToProps = {
  ...actions,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
