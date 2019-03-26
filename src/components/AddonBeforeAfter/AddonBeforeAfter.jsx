import React, { Component } from 'react';
import { Input as AntdInput, Select } from 'antd';

const { Option } = Select;

export default class AddonBefore extends Component {
  returnOption = (data) => {
    const cache = [];
    data.map((item) => cache.push(<Option key={item.value} value={item.value}>{item.label}</Option>));
    return cache;
  }

  returnDisabled = () => (
    <span>
      <span>{ this.props.form.getFieldValue(this.props.name) }</span>
      <span> { this.props.form.getFieldValue(this.props.addonAfter.disableName) }</span>
    </span>
  )

  render() {
    const {
      addonBefore = '',
      addonAfter = '',
      placeholder,
      disabled,
    } = this.props;

    let prefixSelector = '';
    let afterSelector = '';

    const { getFieldDecorator } = this.props.form;

    if (addonBefore) {
      prefixSelector = getFieldDecorator(addonBefore.name, {
        initialValue: addonBefore.initialValue,
      })((
        <Select
          style={{ width: addonBefore.width }}
          disabled={addonBefore.disabled}
        >
          {this.returnOption(addonBefore.value)}
        </Select>
      ));
    }

    if (addonAfter) {
      afterSelector = getFieldDecorator(addonAfter.name, {
        initialValue: addonAfter.initialValue,
      })((
        <Select style={{ width: addonAfter.width }} disabled={addonAfter.disabled}>
          {this.returnOption(addonAfter.value)}
        </Select>
      ));
    }

    return (
      disabled ? this.returnDisabled() :
        (<AntdInput
          placeholder={placeholder}
          addonBefore={prefixSelector}
          addonAfter={afterSelector}
          value={this.props.value}
          onChange={(e) => {
            this.props.onChange(e.target.value);
          }}
        />)
    );
  }
}
