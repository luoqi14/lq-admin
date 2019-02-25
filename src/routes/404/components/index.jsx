import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { history } from '../../../store/location';
import './style.scss';

class View extends Component {
  componentDidMount() {
  }
  /* eslint-disable */
  render() {
    return (
      <div style={{ width: '100%' }} className="flex flex-c flex-v miss-wrapper">
        <div><img alt="" style={{ width: '100%' }} src="/404.png" /></div>
        <div className="miss-slogan">很抱歉，你访问的页面不在地球上...</div>
        <div>
          <div>
            <a
              role="button"
              tabIndex={0}
              onClick={() => history.goBack()}
            >
            返回上一级页面
            </a> |
            <Link to="/Manage">返回首页</Link>

          </div>
        </div>
      </div>
    );
  }
}

export default View;
