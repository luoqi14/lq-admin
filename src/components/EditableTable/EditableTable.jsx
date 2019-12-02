/* eslint-disable react/no-multi-comp, no-param-reassign, max-len */
import React, { Component } from 'react';
import { Form } from 'antd';
import Table from '../Table';
import createFormItem from '../createFormItem';

import './style.scss';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  state = {
    editing: false,
  };

  toggleEdit = form => {
    form.validateFields(error => {
      if (error) {
        return;
      }
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.inputRef.current.focus();
        }
      });
    });
  };

  save = (form, name, e) => {
    if (
      !e ||
      (e.relatedTarget && e.relatedTarget.tagName.toLowerCase() === 'i')
    ) {
      return;
    }
    const { record, handleSave, save } = this.props;
    form.validateFields((error, values) => {
      if (error && error[name]) {
        return;
      }
      this.toggleEdit(form);
      handleSave({ ...record, [name]: values[name] });
      if (record[name] !== values[name]) {
        save && save(record, values[name]);
      }
    });
  };

  renderCell = form => {
    const {
      name,
      label,
      record,
      type,
      children,
      editable,
      handleSave,
      search,
      save,
      columnHelp,
      required,
      size,
      validator,
      max,
      min,
      precision,
      width,
      reduce,
      data,
      ...restProps
    } = this.props;
    const { editing } = this.state;
    return (
      <td {...restProps}>
        {editing ? (
          createFormItem({
            field: {
              ref: this.inputRef,
              name,
              type,
              value: record[name],
              required,
              requiredMsg: `${label}不能为空`,
              cname: label,
              wrapperSpan: 24,
              onBlur: this.save.bind(this, form, name),
              onPressEnter: this.save.bind(this, form, name),
              size,
              local: true,
              max,
              min,
              precision,
              reduce,
              width,
              data,
              validator: validator
                ? (r, v, cbc) => validator(r, v, cbc, record)
                : undefined,
            },
            form,
          })
        ) : (
          <div
            role="button"
            tabIndex={-1}
            className={editable ? 'editable-cell-value-wrap' : ''}
            onClick={editable ? this.toggleEdit.bind(this, form) : undefined}
          >
            {children}
          </div>
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends Component {
  components = {
    body: {
      cell: EditableCell,
    },
  };

  save(record) {
    const { dataSource, value, rowKey, onChange } = this.props;
    const data = dataSource || value;
    const newData = [...data];
    const index = newData.findIndex(
      item => record[rowKey || 'id'] === item[rowKey || 'id']
    );
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...record,
    });
    onChange && onChange(newData);
  }

  render() {
    const {
      components = {
        body: {},
      },
      columns,
      rowKey,
      size,
      className = '',
    } = this.props;
    let { dataSource, value } = this.props;
    dataSource = dataSource || [];
    value = value || [];
    const cols = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          ...col,
          editable:
            typeof col.editable === 'function'
              ? col.editable(record)
              : col.editable,
          record,
          type: col.type || 'text',
          name: col.name,
          label: col.label,
          handleSave: this.save.bind(this),
          size,
          data: col.data,
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          {...this.props}
          className={`${className} editable-table`}
          rowKey={rowKey}
          components={{
            ...this.components,
            body: {
              ...components.body,
              ...this.components.body,
            },
          }}
          value={value}
          dataSource={dataSource.length > 0 ? dataSource : value}
          columns={cols}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
