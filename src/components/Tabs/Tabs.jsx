import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntdTabs } from 'antd';
import createFormItem from '../createFormItem';

export default class DynamicAddDel extends Component {
  static propTypes = {
    // tab 的 title 前缀
    prefix: PropTypes.string,
    // render title for tab
    renderTabTile: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      // props.value 的key,title必须要有，分别作为tab的key和title
      value: props.value || [],
      activeKey: '0',
    };
    this.cur = this.initCurKey(this.state.value);
  }

  componentWillReceiveProps = nextProps => {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      this.setState({ value: nextProps.value });
      this.cur = this.initCurKey(nextProps.value);
    }
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onPropsChange = (value, addOrDel, type) => {
    const { onChange } = this.props;
    onChange && onChange(value, addOrDel, type);
  };

  setForm = value => {
    const { form, name } = this.props;
    const allValues = {};
    value.forEach((v, i) => {
      const keys = Object.keys(v);
      keys.forEach(k => {
        if (k !== 'key' && k !== 'title') {
          allValues[`${name}[${i}].${k}`] = v[k];
        }
      });
    });
    setTimeout(() => {
      form.setFieldsValue(allValues);
    }, 0);
  };

  initCurKey = (list = []) => {
    if (!list.length) {
      return 0;
    }
    const keys = list.map(vo => Number(vo.key));
    const max = Math.max.apply(null, keys);
    return max + 1;
  };

  gendefaultValue = () => {
    const { fields = [] } = this.props;
    const value = {};
    fields.forEach(field => {
      const subName = field.name || field.nameMap;
      value[subName] = field.value;
    });
    value.key = this.cur.toString();
    this.cur = this.cur + 1;
    return value;
  };

  add = () => {
    const { renderTabTile, prefix } = this.props;
    const { value = [] } = this.state;
    const addItem = this.gendefaultValue();
    let newValue = [...value];
    const index = value.length > 0 ? value.length - 1 : 0;

    newValue.splice(index, 0, addItem);

    addItem.title = renderTabTile
      ? renderTabTile(addItem.key, newValue, index)
      : `${prefix}${index + 1}`;

    const len = newValue.length;
    newValue = newValue.map((vo, i) => ({
      ...vo,
      closable: len > 2 && i !== len - 1,
    }));

    this.setState({ value: newValue, activeKey: addItem.key }, () => {
      this.onPropsChange(newValue, addItem, 'add');
    });
  };

  remove = targetKey => {
    const { value, activeKey } = this.state;
    const { form, name, onDelete } = this.props;
    const formValue = form.getFieldsValue()[name];
    let newValue = [...value];
    let newActiveKey = activeKey;
    let lastIndex;

    newValue.forEach((vo, i) => {
      Object.keys(vo).forEach(key => {
        if (formValue && formValue[i]) {
          if (key in formValue[i]) {
            newValue[i][key] = formValue[i][key];
          }
        }
      });

      if (vo.key.toString() === targetKey) {
        lastIndex = i - 1;
      }
    });

    const delIndex = newValue.findIndex(vo => vo.key.toString() === targetKey);
    const delItem = newValue.splice(delIndex, 1);

    // 删除后更新closable
    const len = newValue.length;
    newValue = newValue.map((vo, i) => ({
      ...vo,
      closable: len > 2 && i !== len - 1,
    }));

    if (newValue.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newValue[lastIndex].key.toString();
      } else {
        newActiveKey = newValue[0].key.toString();
      }
    }

    this.setState(
      {
        value: newValue,
        activeKey: newActiveKey,
      },
      () => {
        this.onPropsChange(newValue, delItem[0], 'delete');
        onDelete && onDelete(delItem[0], delIndex);
        // this.setForm(newValue);
      }
    );
  };

  handleChange = (v, name, nameMap, index, field) => {
    const { value } = this.state;
    const newValue = [...value];
    newValue[index][nameMap] = v;
    this.setState({ value: newValue });

    if (field._onChange) {
      field._onChange(v, name, nameMap, index);
    }
  };

  renderFields = () => {
    const {
      fields = [],
      form,
      name,
      disabled = false,
      hidden = false,
      tabExtra,
    } = this.props;
    const { value, activeKey } = this.state;
    return (
      <div>
        <AntdTabs
          onChange={this.onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {value.map((vo, i) => {
            return (
              <AntdTabs.TabPane
                tab={vo.title}
                key={vo.key}
                closable={vo.closable}
              >
                {tabExtra}
                {fields.map(field => {
                  const newField = { ...field };
                  const subName = field.name || field.nameMap;

                  const funcProps = ['label', 'hidden', 'disabled', 'extra'];

                  if (newField.type === 'table' && newField.footer) {
                    newField.footer = newField.footer.bind(this, vo.key, i);
                  }

                  funcProps.forEach(key => {
                    if (typeof newField[key] === 'function') {
                      newField[key] = newField[key](vo.key, i, vo);
                    }
                  });

                  if (!('disabled' in newField)) {
                    newField.disabled = disabled;
                  }

                  newField.name = `${name}[${i}].${subName}`;
                  if (newField.component) {
                    newField.name = '';
                    newField.itemName = `${name}[${i}].${subName}`;
                    newField.key = `${name}[${i}].${subName}`;
                    newField.index = i;
                  }

                  newField._onChange = newField[field.changeName || 'onChange'];
                  newField[field.changeName || 'onChange'] = v => {
                    this.handleChange(v, newField.name, subName, i, newField);
                  };

                  newField.required = hidden ? false : newField.required;
                  return createFormItem({
                    field: newField,
                    form,
                  });
                })}
              </AntdTabs.TabPane>
            );
          })}
        </AntdTabs>
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
