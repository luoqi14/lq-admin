/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Button } from 'antd';
import createFormItem from '../createFormItem';
import './style.scss';

export default class DeletableFormItem extends Component {
  renderFields = () => {
    const {
      fields = [],
      form,
      disabled = false,
      onDelete,
      closeType = 'button',
      canDelete = false,
      itemTitle,
    } = this.props;

    return (
      <div className="clearfix dynamic-item">
        <div className="ant-form-title" style={{ lineHeight: 1.5 }}>
          {itemTitle}
        </div>
        {fields.map(field => {
          const newField = { ...field };
          //   newField.name = name;
          //   const subName = field.name || field.nameMap;
          // if (!newField.wrapperSpan) {
          //   newField.wrapperSpan = 24;
          // }
          //   if (!('disabled' in newField)) {
          //     newField.disabled = disabled;
          //   }
          //   newField.name = `${name}Temp*[${i}].${subName}`;
          //   newField.onChange = (v) => {
          //     this.handleChange(v, newField.name, subName, i);
          //   };
          return createFormItem({
            field: newField,
            form,
          });
        })}
        {!disabled && canDelete && closeType === 'button' && (
          <Button className="dynamic-del-btn" type="danger" onClick={onDelete}>
            删除
          </Button>
        )}
        {!disabled && canDelete && closeType === 'icon' && (
          <div
            tabIndex={0}
            role="button"
            className="dynamicadddel-close"
            onClick={onDelete}
          >
            <div className="dynamicadddel-crossline" />
            <div className="dynamicadddel-crossline" />
          </div>
        )}
      </div>
    );
  };
  render() {
    const { disabled } = this.props;
    return (
      <div
        className={`dynamicadddel${disabled ? ' dynamicadddel-disabled' : ''}`}
      >
        {this.renderFields()}
      </div>
    );
  }
}
