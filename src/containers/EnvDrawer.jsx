import React, { Component } from 'react';
import { Drawer, Input } from 'antd';

export default class EnvDrawer extends Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    document.body.addEventListener(
      'mousemove',
      e => {
        if (document.body.clientHeight === e.clientY + 1) {
          this.setState({
            visible: true,
          });
        }
      },
      false
    );
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
    const value = document.getElementById('global-env').value;
    if (value) {
      window.globalBaseUrl =
        value.startsWith('http') || value.startsWith('//')
          ? value
          : `//${value}`;
    }
  };

  render() {
    const { visible } = this.state;
    return (
      <Drawer
        placement="bottom"
        visible={visible}
        onClose={this.onClose}
        height={80}
      >
        <Input id="global-env" placeholder="自定义，请输入接口地址前缀" />
      </Drawer>
    );
  }
}
