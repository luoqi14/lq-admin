/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import get from 'lodash/get';
import createFormItem from '../createFormItem';
import './style.scss';

export default class DynamicAddDel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [this.gendefaultValue()],
    };
  }

  componentDidMount = () => {
    if (this.props.length) {
      this.initValue(this.props.length);
    }
  };

  componentWillReceiveProps = nextProps => {
    // 仅在 length 从0变为非0时初始化 value
    if (this.props.length !== nextProps.length) {
      this.initValue(nextProps.length);
    }
  };

  cur = 0;

  initValue = (len = 1) => {
    const newValue = Array.from({ length: len }, () => this.gendefaultValue());
    this.setState({ value: newValue });
  };

  gendefaultValue = () => {
    const { fields = [] } = this.props;
    const value = {};
    fields.forEach(field => {
      const subName = field.name || field.nameMap;
      value[subName] = field.value;
      if (field.type === 'timeRange') {
        value[field.names[0]] = (field.value || [])[0];
        value[field.names[1]] = (field.value || [])[1];
      }
    });
    value.key = this.cur;
    this.cur = this.cur + 1;
    return value;
  };

  add = () => {
    const { value = [this.gendefaultValue()] } = this.state;
    this.setState({ value: value.concat(this.gendefaultValue()) });
  };

  delete = index => {
    const { value } = this.state;
    const { form, name } = this.props;
    const newValue = [...value];
    const formValue = form.getFieldsValue()[name];

    newValue.forEach((vo, i) => {
      Object.keys(vo).forEach(key => {
        if (key !== 'key' && formValue && formValue[i]) {
          newValue[i][key] = get(formValue[i], key);
        }
      });
    });

    const delItem = newValue.splice(index, 1);
    this.setState({ value: newValue });
    const allValues = {};
    newValue.forEach((v, i) => {
      const keys = Object.keys(v);
      keys.forEach(k => {
        if (k !== 'key') {
          allValues[`${name}[${i}].${k}`] = v[k];
        }
      });
    });
    form.setFieldsValue(allValues);
    this.props.onDelete && this.props.onDelete(delItem, index);
  };

  handleChange = (v, name, nameMap, index, field) => {
    const { value } = this.state;
    const newValue = [...value];
    newValue[index][nameMap] = v;
    this.setState({ value: newValue }, () => {
      if (field._onChange) {
        field._onChange(v, name, nameMap, index);
      }
    });
  };

  renderFields = () => {
    const {
      fields = [],
      form,
      name,
      closeType = 'button',
      disabled = false,
      hidden = false,
    } = this.props;

    const { value } = this.state;

    return value.map((item, i) => (
      <div className="clearfix dynamic-item" key={item.key}>
        {fields.map(field => {
          const newField = { ...field };
          if (field.first && i !== 0) {
            delete newField.extra;
            newField.label = ' ';
          }
          const subName = field.name || field.nameMap;
          if (typeof newField.label === 'function') {
            newField.label = newField.label(name, i, subName);
          } else {
            newField.label = newField.label.replace(/\{index\}/g, i + 1);
          }
          const funcProps = ['hidden', 'extra'];
          funcProps.forEach(prop => {
            if (newField[prop] && typeof newField[prop] === 'function') {
              newField[prop] = newField[prop](name, i, subName);
            }
          });

          if (newField.onBlur) {
            newField.onBlur = newField.onBlur.bind(this, name, i, subName);
          }
          if (!newField.wrapperSpan) {
            newField.wrapperSpan = 24;
          }
          if (!('disabled' in newField)) {
            newField.disabled = disabled;
          }
          newField.name = `${name}[${i}].${subName}`;
          if (newField.component) {
            newField.itemName = newField.name;
            newField.key = newField.name;
            newField.name = '';
            newField.index = i;
          }
          if (newField.type === 'timeRange') {
            newField.names = [
              `${name}[${i}].${newField.names[0]}`,
              `${name}[${i}].${newField.names[1]}`,
            ];
          }
          if (typeof newField.data === 'function') {
            newField.data = newField.data.bind(this, i);
          }
          newField._onChange = newField[field.changeName || 'onChange'];
          newField[field.changeName || 'onChange'] = v => {
            this.handleChange(v, newField.name, subName, i, newField);
          };

          if (newField.validator) {
            const _validator = newField.validator;
            newField.validator = (r, v, cbc) => {
              _validator(r, v, cbc, i);
            };
          }
          newField.required = hidden ? false : newField.required;
          return createFormItem({
            field: newField,
            form,
          });
        })}
        {!disabled && value.length > 1 && closeType === 'button' && (
          <Button
            className="dynamic-del-btn"
            type="danger"
            onClick={() => {
              this.delete(i);
            }}
          >
            删除
          </Button>
        )}
        {!disabled && value.length > 1 && closeType === 'icon' && (
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
        )}
      </div>
    ));
  };

  render() {
    const {
      disabled,
      addButtonIcon,
      addButtonText = '新增',
      addButton,
      addButtonDisabled = false,
      limit,
      style = {},
    } = this.props;

    const { value } = this.state;

    return (
      <div
        className={`dynamicadddel${disabled ? ' dynamicadddel-disabled' : ''}`}
        style={style}
      >
        {this.renderFields()}
        {(!limit || value.length < limit) && (
          <Row>
            <Col md={{ push: 4, span: 20 }}>
              {!disabled &&
                addButton &&
                React.cloneElement(addButton, {
                  onClick: () => {
                    this.add();
                  },
                  className: 'dynamic-add-btn',
                })}
              {!disabled && !addButton && (
                <Button
                  className="dynamic-add-btn"
                  onClick={() => {
                    this.add();
                  }}
                  type="dashed"
                  icon={addButtonIcon}
                  disabled={addButtonDisabled}
                >
                  {addButtonText}
                </Button>
              )}
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
