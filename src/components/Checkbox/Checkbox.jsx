import React, { Component } from 'react';
import { Checkbox as AntdCheckbox, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './style.scss';
import { shallowEqual } from '../../util';

export default class Checkbox extends Component {
  static propTypes = {
    data: PropTypes.object,
    checkAll: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    checkAll: false,
  };

  shouldComponentUpdate(nextProps, newState) {
    return (
      !shallowEqual(this.props, nextProps, ['data-__field', 'data-__meta']) ||
      !shallowEqual(this.state, newState)
    );
  }

  onChange(value) {
    this.props.onChange(value);
  }

  onCheckAllChange = e => {
    const checked = e.target.checked;
    let value = [];
    const { data } = this.props;
    if (checked) {
      value = Object.keys(data);
    }
    this.props.onChange(value);
  };

  getDisplayValue = value => {
    const options = this.props.data;
    let displayValue = '';
    value.forEach(item => {
      displayValue = `${displayValue + options[item]} `;
    });
    return displayValue;
  };

  render() {
    const {
      data,
      disabled,
      value = [],
      checkAll,
      itemSpan,
      readonly,
    } = this.props;
    return (
      <div className="fe-checkbox">
        {disabled && value.length === 0 && (
          <span className="fe-blank-holder">-</span>
        )}
        {disabled && value.length > 0 && (
          <span className="fe-readonly">{this.getDisplayValue(value)}</span>
        )}
        {checkAll && !disabled && (
          <Row style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Col span={8}>
              <AntdCheckbox
                indeterminate={
                  value.length > 0 && value.length !== Object.keys(data).length
                }
                onChange={this.onCheckAllChange}
                checked={value.length === Object.keys(data).length}
              >
                全选
              </AntdCheckbox>
            </Col>
          </Row>
        )}
        {!disabled && (
          <AntdCheckbox.Group
            onChange={this.onChange.bind(this)}
            value={value.map(i => `${i}`)} // value item is string ?
            style={{ width: '100%' }}
          >
            <Row>
              {Object.keys(data).map(key => (
                <Col span={itemSpan || 8} key={key}>
                  <AntdCheckbox value={key} disabled={readonly}>
                    {data[key]}
                  </AntdCheckbox>
                </Col>
              ))}
            </Row>
          </AntdCheckbox.Group>
        )}
      </div>
    );
  }
}
