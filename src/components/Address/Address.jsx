import React, { Component } from 'react';
import { Cascader } from 'antd';
import PropTypes from 'prop-types';
import CityUtil from '../../util/city';

// 为什么不用纯函数组件，原因antd不支持，纯函数不创建component实例，
// antd源码中有判断如果没有实例就会将fieldStore里的field和fieldMeta删除，设置值的时候取不到fieldMeta里的validate就报错

export default class Address extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    displayValue: PropTypes.bool,
    data: PropTypes.array,
    fieldNames: PropTypes.object,
    loadData: PropTypes.func,
    showSearch: PropTypes.bool,
    appendToBody: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    displayValue: false,
    data: undefined,
    fieldNames: undefined,
    loadData: () => {},
    showSearch: true,
    appendToBody: false,
  };

  handleChange(value, opts) {
    this.props.onChange(value, opts);
  }

  render() {
    const {
      displayValue,
      disabled,
      placeholder,
      changeOnSelect,
      data,
      value,
      fieldNames,
      loadData,
      showSearch,
      appendToBody,
    } = this.props;
    return (
      <Cascader
        loadData={loadData}
        fieldNames={fieldNames}
        changeOnSelect={changeOnSelect}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        options={data || CityUtil.treeCity(displayValue ? '' : 'id')}
        onChange={this.handleChange.bind(this)}
        getPopupContainer={node =>
          appendToBody ? document.body : node.parentNode
        }
        showSearch={showSearch}
      />
    );
  }
}
