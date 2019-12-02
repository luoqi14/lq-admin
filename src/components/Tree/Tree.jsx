import React, { Component, Fragment } from 'react';
import { Tree as AntdTree, Checkbox } from 'antd';
import './style.scss';

const TreeNode = AntdTree.TreeNode;

export default class Tree extends Component {
  handleChange(value) {
    let newValue = value;
    if (value.checked) {
      newValue = value.checked;
    }
    this.props.onChange(newValue);
  }
  forEachAllData = (data, key, array) => {
    data.forEach(item => {
      array.push(item[key]);
      if (item.children) {
        this.forEachAllData(item.children, key, array);
      }
    });
    return array;
  };
  handleCheckAll = e => {
    if (e.target.checked) {
      const keys = this.forEachAllData(
        this.props.data,
        this.props.valueKey,
        []
      );
      this.props.onChange(keys);
    } else {
      this.props.onChange([]);
    }
  };
  renderTreeNodes = (data, key, title, disabled, hideCheckBox) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item[title]}
            key={item[key]}
            className={hideCheckBox(item) ? 'hide-checkbox' : ''}
            checkable={disabled(item)}
          >
            {this.renderTreeNodes(
              item.children,
              key,
              title,
              disabled,
              hideCheckBox
            )}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          className={hideCheckBox(item) ? 'hide-checkbox' : ''}
          {...item}
          title={item[title]}
          key={item[key]}
          checkable={disabled(item)}
        />
      );
    });

  render() {
    const {
      data,
      value,
      valueKey = 'key',
      title = 'title',
      treeNodeDisabled = () => true,
      hideCheckBox = () => false,
      canCheckAll = false,
      checkable = true,
    } = this.props;
    return data.length ? (
      <Fragment>
        {canCheckAll && (
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox onChange={this.handleCheckAll}>全选</Checkbox>
          </div>
        )}
        <AntdTree
          {...this.props}
          checkedKeys={value}
          checkable={checkable}
          onCheck={this.handleChange.bind(this)}
        >
          {this.renderTreeNodes(
            data,
            valueKey,
            title,
            treeNodeDisabled,
            hideCheckBox
          )}
        </AntdTree>
      </Fragment>
    ) : (
      <div style={{ color: 'rgba(0,0,0,.25)', textAlign: 'center' }}>
        暂无数据
      </div>
    );
  }
}
