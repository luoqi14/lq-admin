import React, { Component } from 'react';
import { Switch as AntdSwitch } from 'antd';
import './style.scss';

export default class Switch extends Component {
  render() {
    const {
      value,
      disabled,
      checkedChildren,
      unCheckedChildren,
      addonAfter = '',
    } = this.props;

    return (
      <div>
        <AntdSwitch
          disabled={disabled}
          checked={!!+value}
          checkedChildren={checkedChildren}
          unCheckedChildren={unCheckedChildren}
          onChange={val => {
            this.props.onChange(Number(val));
          }}
        />
        {addonAfter}
      </div>
    );
  }
}
