import React, { Component } from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';

export default class EditableTagGroup extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  handleClose = (removedTag) => {
    let value = this.props.value || [];
    value = value.filter((tag) => tag !== removedTag);
    this.props.onChange(value);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let {
      value,
    } = this.props;
    value = value || [];
    if (inputValue && value.indexOf(inputValue) === -1) {
      value = [...value, inputValue];
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
    this.props.onChange(value);
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const {
      placeholder = 'New Tag',
      disabled,
    } = this.props;
    let {
      value,
    } = this.props;
    value = value || [];
    return (
      <div>
        {value.map((tag) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={!disabled} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {!disabled && inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!disabled && !inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> {placeholder}
          </Tag>
        )}
      </div>
    );
  }
}
