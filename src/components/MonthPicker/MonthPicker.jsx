import React, { Component } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import moment from 'moment';

const AntdMonthPicker = AntdDatePicker.MonthPicker;
export default class MonthPicker extends Component {
  constructor(props) {
    super(props);
    let value = props.value || undefined;
    if (value) {
      value = moment(value);
    }
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined;
      if (value) {
        value = moment(value);
      }
      this.setState({ value });
    }
  }

  handleChange(value) {
    this.props.onChange(value);
  }

  render() {
    return (
      <AntdMonthPicker
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
