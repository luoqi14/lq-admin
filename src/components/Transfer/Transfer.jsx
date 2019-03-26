import React, { Component } from 'react';
import { Transfer as AntdTransfer } from 'antd';
import './style.scss';

export default class Transfer extends Component {
  handleChange(value) {
    this.props.onChange(value);
  }

  render() {
    const { value } = this.props;
    return (
      <AntdTransfer
        {...this.props}
        targetKeys={value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
