/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Button } from 'antd';
import createFormItem from '../createFormItem';
import './style.scss';

export default class DynamicAddDel extends Component {
  gendefaultValue = () => {
    const {
      fields = [],
    } = this.props;
    const value = {};
    fields.forEach((field) => {
      const subName = field.name || field.nameMap;
      value[subName] = undefined;
    });
    return value;
  };

  add = () => {
    const {
      value = [this.gendefaultValue()],
    } = this.props;
    this.props.onChange(value.concat(this.gendefaultValue()));
  };

  delete = (index) => {
    const {
      value,
    } = this.props;
    const newValue = [...value];
    const delItem = newValue.splice(index, 1);
    this.props.onChange(newValue);
    this.props.afterDelete && this.props.afterDelete(delItem);
  };

  handleChange = (v, name, nameMap, index) => {
    const {
      value = [this.gendefaultValue()],
    } = this.props;
    const newValue = [...value];
    newValue[index][nameMap] = v;
    this.props.onChange(newValue);
  };

  renderFields = () => {
    const {
      fields = [],
      form,
      value = [this.gendefaultValue()],
      name,
      closeType = 'button',
      disabled = false,
    } = this.props;

    return value.map((key, i) => (
      <div className="clearfix dynamic-item" key={i}>
        { fields.map((field) => {
          const newField = { ...field };
          const subName = field.name || field.nameMap;
          if (!newField.wrapperSpan) {
            newField.wrapperSpan = 24;
          }
          if (!('disabled' in newField)) {
            newField.disabled = disabled;
          }
          newField.name = `${name}Temp*[${i}].${subName}`;
          newField.onChange = (v) => {
            this.handleChange(v, newField.name, subName, i);
          };
          return createFormItem({
            field: newField,
            form,
          });
        }) }
        { !disabled && value.length > 1 && closeType === 'button' && (
          <Button
            className="dynamic-del-btn"
            type="danger"
            onClick={() => {
              this.delete(i);
            }}
          >
            删除
          </Button>
        ) }
        {
          !disabled && value.length > 1 && closeType === 'icon' && (
            <div
              tabIndex={0}
              role="button"
              className="dynamicadddel-close"
              onClick={() => {
                this.delete(i);
              }}
            >
              <div className="dynamicadddel-crossline" />
              <div className="dynamicadddel-crossline" />
            </div>
          )
        }
      </div>
    ));
  };

  render() {
    const {
      disabled,
      addButtonIcon,
      addButtonText = '新增',
      addButton,
    } = this.props;
    return (
      <div className={`dynamicadddel${disabled ? ' dynamicadddel-disabled' : ''}`}>
        { this.renderFields() }
        {!disabled && addButton && (
          React.cloneElement(addButton, {
            onClick: () => {
              this.add();
            },
            className: 'dynamic-add-btn',
          })
        )}
        {!disabled && !addButton && (
          <Button
            className="dynamic-add-btn"
            onClick={() => {
              this.add();
            }}
            icon={addButtonIcon}
          >{addButtonText}
          </Button>
        )}
      </div>
    );
  }
}
