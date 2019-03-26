import React, { Component } from 'react';
import { TimePicker as AntdTimePicker } from 'antd';
import moment from 'moment';

export default class TimePicker extends Component {
  formatPattern = 'HH:mm:ss';

  renderDisabled(value) {
    return value ? <span>{value.format(this.formatPattern)}</span> : <span className="fe-blank-holder">-</span>;
  }

  render() {
    let {
      value,
    } = this.props;

    const {
      disabled,
      defaultOpenValue = moment(),
    } = this.props;

    if (typeof value === 'string' && value) {
      value = moment(value, this.formatPattern);
    }

    return (
      disabled ? this.renderDisabled(value) : (
        <AntdTimePicker
          {...this.props}
          defaultOpenValue={defaultOpenValue}
          value={value}
          onChange={(val) => {
            this.props.onChange(val ? moment(val).format(this.formatPattern) : val);
          }}
        />
      )
    );
  }
}
