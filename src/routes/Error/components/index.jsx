import React, { Component } from 'react';
import './style.scss';

class View extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div style={{ width: '100%' }} className="flex flex-c error-wrapper">
        <div><img alt="" style={{ width: '100%' }} src="/error.png" /></div>
        <div>
          <p className="error-title">哎呦~ 服务器居然累倒了!</p>
          <p className="error-text">工程师正在紧急处理，请您耐心等待。</p>
        </div>
      </div>
    );
  }
}

export default View;
