import React, { Component } from 'react';
import { Modal, Tree } from 'antd';
import PropTypes from 'prop-types';

const TreeNode = Tree.TreeNode;

class MenuInTree extends Component {
  static propTypes = {
    modalTitle: PropTypes.string,
    okText: PropTypes.string,
    modalShow: PropTypes.bool,
    handleOk: PropTypes.func,
    handleCancel: PropTypes.func,
    onSelect: PropTypes.func,
    onExpand: PropTypes.func,
    expandedKeys: PropTypes.array,
    checkedKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    onCheck: PropTypes.func,
    treeData: PropTypes.array,
    treeTitle: PropTypes.string,
    treeKey: PropTypes.string,
    treeChildren: PropTypes.string,
    isTreeInModal: PropTypes.bool,
    disabled: PropTypes.bool,
    autoExpandParent: PropTypes.bool,
  };

  static defaultProps = {
    modalTitle: '',
    okText: '保存',
    modalShow: false,
    handleOk: undefined,
    handleCancel: undefined,
    onExpand: undefined,
    onCheck: undefined,
    onSelect: undefined,
    expandedKeys: [],
    checkedKeys: [],
    selectedKeys: [],
    treeData: [],
    treeTitle: undefined,
    treeKey: undefined,
    treeChildren: undefined,
    isTreeInModal: false,
    disabled: false,
    autoExpandParent: true,
  };

  renderTreeNodes = (data) => (
    data.map((item) => {
      const { treeTitle, treeKey, treeChildren } = item;
      if (treeChildren) {
        return (
          <TreeNode title={treeTitle} key={treeKey} dataRef={item}>
            {this.renderTreeNodes(treeChildren)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={treeTitle} key={treeKey} dataRef={item} />;
    })
  )

  render() {
    const {
      modalTitle,
      okText,
      modalShow,
      handleOk,
      handleCancel,
      onExpand,
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      onCheck,
      onSelect,
      treeData,
      isTreeInModal,
      disabled,
    } = this.props;
   
    const treeCont = (
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        disabled={disabled}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>);

    return (
      <div>
        {
          isTreeInModal ? 
            <Modal
              title={modalTitle}
              okText={okText}
              visible={modalShow}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              { treeCont }
            </Modal>
            :
            <div> { treeCont } </div>
        }
      </div>
    );
  }
}

export default MenuInTree;
