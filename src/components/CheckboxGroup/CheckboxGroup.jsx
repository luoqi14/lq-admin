import React, { Component } from 'react';
import { Checkbox } from 'antd';
import './style.scss';

export default class CheckboxGroup extends Component {
  constructor(props) {
    super(props);
    let { value = [] } = this.props;
    const { options } = this.props;
    value = Array.from(new Set(value));
    this.state = {
      checkedList: value,
      indeterminate: !!value.length && value.length < options.length,
      checkAll: value.length === options.length,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || [];
      value = value.filter(v => !!nextProps.options.find(o => o.value === v));
      value = Array.from(new Set(value));
      this.setState({
        checkedList: value,
        indeterminate:
          !!value.length && value.length < this.props.options.length,
        checkAll: value.length === this.props.options.length,
      });
    }
  }

  onCheckAllChange(e) {
    this.props.onChange(
      e.target.checked ? this.props.options.map(item => item.value || item) : []
    );
  }

  onChange(cl) {
    let checkedList = cl;
    const firstCheck = this.props.options[0].value;
    if (
      checkedList.length > this.state.checkedList.length &&
      this.state.checkedList.indexOf(firstCheck) === -1
    ) {
      checkedList.unshift(firstCheck);
    } else if (
      this.state.checkedList.indexOf(firstCheck) > -1 &&
      checkedList.indexOf(firstCheck) === -1
    ) {
      checkedList = [];
    }
    this.props.onChange(checkedList);
  }

  renderDisabled() {
    const { label, options } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <span
          style={{
            marginLeft: '16px',
            width: '120px',
            display: 'inline-block',
          }}
        >
          <span>{label}:</span>
        </span>
        {this.state.checkedList.length > 0 ? (
          options.map(item => {
            if (this.state.checkedList.indexOf(item.value) > -1) {
              return (
                <span
                  key={item.value}
                  style={{
                    marginLeft: '16px',
                    width: '100px',
                    display: 'inline-block',
                  }}
                >
                  {item.label}
                </span>
              );
            }
            return '';
          })
        ) : (
          <span style={{ marginLeft: '16px' }}>-</span>
        )}
      </div>
    );
  }

  render() {
    const { label, options, disabled } = this.props;
    return (
      <span className="checkboxgroup-container">
        {disabled ? (
          this.renderDisabled()
        ) : (
          <div>
            <Checkbox
              className="checkboxgroup-label"
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange.bind(this)}
              checked={this.state.checkAll}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '80px',
                }}
              >
                {label}:
              </span>
            </Checkbox>
            <Checkbox.Group
              options={options}
              value={this.state.checkedList}
              onChange={this.onChange.bind(this)}
            />
          </div>
        )}
      </span>
    );
  }
}
