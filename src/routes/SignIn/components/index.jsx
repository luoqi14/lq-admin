import React, { Component } from 'react';
import { Layout } from 'antd';
import { Redirect } from 'react-router-dom';
import WrappedNormalLoginForm from './LoginForm';
import { parseUrl } from '../../../util';
import './style.scss';

const { Content, Footer } = Layout;

class View extends Component {
  componentDidMount() {
    window.particleground(document.getElementById('login-bg'), {
      dotColor: '#4e8dca',
      lineColor: '#4e8dca',
    });
  }

  login(values) {
    this.props.login(values);
  }

  render() {
    if (localStorage.getItem('accessToken')) {
      const returnUrl = parseUrl().returnUrl || '/Manage';
      return <Redirect to={returnUrl} />;
    }

    return (
      <Layout className="login-layout">
        <div
          id="login-bg"
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
          }}
        />
        <Content className="login-content">
          <WrappedNormalLoginForm
            login={this.login.bind(this)}
            loading={this.props.loading}
            changeType={this.props.changeType}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; xxxx有限公司
        </Footer>
      </Layout>
    );
  }
}

export default View;
