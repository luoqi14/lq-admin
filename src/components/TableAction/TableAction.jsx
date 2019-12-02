import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown, Menu, Popover } from 'antd';
import Popconfirm from '../Popconfirm';
import './style.scss';

export default class TableAction extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([
          PropTypes.node.isRequired,
          PropTypes.string.isRequired,
        ]),
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        confirm: PropTypes.oneOfType([
          PropTypes.node.isRequired,
          PropTypes.string.isRequired,
        ]),
        hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      })
    ),
  };

  static defaultProps = {
    buttons: [],
  };

  renderAction = (btn, index) => {
    const style = {};
    if (btn.disabled) {
      style.color = '#ccc';
    }
    const h = !btn.confirm ? (
      <a
        className="table-action-item"
        role="button"
        tabIndex={-1}
        key={index}
        onClick={() => {
          !btn.disabled && btn.onClick();
        }}
        style={style}
      >
        {btn.disabled && btn.disabledMsg ? (
          <Popover content={btn.disabledMsg}>{btn.label}</Popover>
        ) : (
          btn.label
        )}
      </a>
    ) : (
      <Popconfirm
        className="table-action-item"
        key={index}
        title={btn.confirm}
        subtitle={btn.subtitle}
        onConfirm={() => {
          btn.onClick();
        }}
        okText="确定"
        cancelText="取消"
      >
        <a style={style}>{btn.label}</a>
      </Popconfirm>
    );
    return !btn.hidden ? h : null;
  };

  renderMoreMenu = buttons => {
    return (
      <Menu>
        {buttons.map((i, index) => {
          return (
            /* eslint-disable react/no-array-index-key */
            <Menu.Item key={index}>{this.renderAction(i)}</Menu.Item>
          );
        })}
      </Menu>
    );
  };

  render() {
    const { buttons } = this.props;
    const visibleBtns = buttons.filter(i => !i.hidden);
    const isMore = visibleBtns.length > 3;
    return (
      <div className="fe-table-action">
        {visibleBtns.slice(0, isMore ? 2 : 3).map((btn, index) => {
          return this.renderAction(btn, index);
        })}
        {isMore && (
          <Dropdown
            overlay={this.renderMoreMenu(
              visibleBtns.slice(2, visibleBtns.length)
            )}
          >
            <a className="table-action-item">
              更多操作
              <Icon type="down" style={{ fontSize: 12, margin: 0 }} />
            </a>
          </Dropdown>
        )}
      </div>
    );
  }
}
