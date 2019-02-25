import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { history } from '../store/location';
import Routes from '../routes';

// APP容器
class AppContainer extends Component {
  static propTypes = {
    store  : PropTypes.object.isRequired,
  }

  // 数据更新时调用，这里可以增加判断，返回值是boolean
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <div className="flex" style={{ height: '100%', flex: 'auto' }}>
          <Router history={history}>
            <Routes />
          </Router>
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
