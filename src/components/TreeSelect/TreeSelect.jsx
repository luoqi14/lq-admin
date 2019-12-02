import React, { Component } from 'react';
import { TreeSelect as AntdTreeSelect } from 'antd';

export default class TreeSelect extends Component {
  static defaultProps = {
    allowClear: true,
    multiple: false,
    showSearch: true,
  };

  render() {
    const {
      treeData = [],
      fieldNames = { title: 'title', value: 'value' },
    } = this.props;
    const titleReg = new RegExp(fieldNames.title, 'g');
    const valueReg = new RegExp(fieldNames.value, 'g');
    const data = JSON.parse(
      JSON.stringify(treeData)
        .replace(titleReg, 'title')
        .replace(valueReg, 'value')
    );
    return (
      <AntdTreeSelect
        searchPlaceholder="请输入搜索"
        {...this.props}
        treeNodeFilterProp="title"
        treeData={data}
      />
    );
  }
}
