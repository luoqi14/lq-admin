import React, { Component } from 'react';
import { Tree as AntdTree } from 'antd';
import './style.scss';

const TreeNode = AntdTree.TreeNode;

export default class Tree extends Component {
  handleChange(value) {
    this.props.onChange(value);
  }

  renderTreeNodes = (data) => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });

  render() {
    const {
      data,
      value,
    } = this.props;
    return (
      <AntdTree
        defaultExpandAll
        {...this.props}
        checkedKeys={value}
        checkable
        onChange={this.handleChange.bind(this)}
      >
        {this.renderTreeNodes(data)}
      </AntdTree>
    );
  }
}
