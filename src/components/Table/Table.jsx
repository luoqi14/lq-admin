import React, { Component } from 'react';
import { Table as AntdTable, Spin, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.scss';

class Table extends Component {
  static propTypes = {
    rowKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    search: PropTypes.func,
    searchParams: PropTypes.object,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    expandedRowRender: PropTypes.func,
    sorter: PropTypes.object,
    xScroll: PropTypes.number,
    yScroll: PropTypes.number,
    size: PropTypes.string,
    onRowClick: PropTypes.func,
    radio: PropTypes.object,
    checkbox: PropTypes.object,
    showTotal: PropTypes.func,
    valueName: PropTypes.string,
    displayName: PropTypes.string,
    showHeader: PropTypes.bool,
    empty: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    expandIconAsCell: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
  };

  static defaultProps = {
    rowKey: 'id',
    loading: false,
    dataSource: [],
    rowSelection: undefined,
    pagination: false,
    search: undefined,
    searchParams: {},
    onChange: undefined,
    bordered: false,
    expandedRowRender: undefined,
    sorter: {},
    xScroll: undefined,
    yScroll: undefined,
    size: 'default',
    onRowClick: undefined,
    radio: undefined,
    checkbox: undefined,
    showTotal: (total, range) => `显示第 ${range[0]} 到第 ${range[1]} 条记录，总共 ${total} 条记录`,
    valueName: 'id',
    displayName: 'label',
    showHeader: true,
    empty: '暂无数据',
    expandIconAsCell: true,
    expandedRowKeys: [],
  };

  constructor(props) {
    super(props);
    const value = props.value || [];
    JSON.stringify(props.value) !== '[]' && props.onChange && this.props.onChange(value);
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.props.onChange && this.props.onChange(nextProps.value);
    }
  }

  onChange(page, filters, sorter) {
    this.props.search({
      ...this.props.searchParams,
      offset: (+page.current - 1) * page.pageSize,
      limit: page.pageSize,
      columnKey: sorter.columnKey,
      order: sorter.order,
    });
  }
  shapeColumns(columns) {
    const {
      sorter,
      valueName,
      displayName,
      pagination,
    } = this.props;
    const timeMap = {
      datetime: 'YYYY-MM-DD HH:mm:ss',
      datetimeRange: 'YYYY-MM-DD HH:mm:ss',
      date: 'YYYY-MM-DD',
      dateRange: 'YYYY-MM-DD',
    };
    return columns.map((col) => {
      const column = { ...col };
      if ('align' in column) {
        column.className = `${column.className || ''} table-column-${column.align}`;
      }
      if ('label' in column && !('title' in column)) {
        column.title = column.label;
      }
      if ('name' in column) {
        column.key = column.name;
        column.dataIndex = column.name;
      }
      if ('sorter' in column && !('sortOrder' in column)) {
        column.sortOrder = sorter.columnKey === column.name && sorter.order;
      }
      if (column.type in timeMap) {
        column.render = (text) => {
          let resText = text;
          if ((`${text}`).length === 13) {
            resText = +text;
          }
          return (resText || '') && moment(resText).format(column.timeFormat || timeMap[column.type]);
        };
      }
      if (column.columnType === 'sequence') {
        column.render = (text, record, index) => {
          if (pagination) {
            return index + 1 + ((+(pagination.current || 1) - 1) * +(pagination.pageSize || 10));
          }
          return index + 1;
        };
      }
      if (column.type === 'select' && !('render' in column)) {
        if (Object.prototype.toString.call(column.data) === '[object Array]') {
          const dict = {};
          column.data.forEach((item) => {
            dict[item[valueName]] = item[displayName];
            column.render = (text) => dict[text];
          });
        } else {
          column.render = (text) => column.data[text];
        }
      }
      if (column.line) {
        column.width = column.line;
        if (column.render) {
          column.originRender = column.render;
        }
        column.render = (text) => {
          const renderedText = column.originRender ? column.originRender(text) : text;
          return (
            <Tooltip title={renderedText}>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: column.line,
                }}
              >
                {renderedText}
              </div>
            </Tooltip>
          );
        };
      }
      return column;
    });
  }

  render() {
    const {
      loading,
      columns,
      dataSource,
      pagination,
      searchParams,
      onChange,
      bordered,
      rowKey,
      expandedRowRender,
      xScroll,
      size,
      radio,
      checkbox,
      yScroll,
      showTotal,
      title,
      children,
      showHeader,
      childrenColumnName = 'children',
      defaultExpandAllRows = false,
      empty,
      expandIconAsCell,
      expandedRowKeys,
      value = [],
    } = this.props;

    const extraProps = {};

    let expandIconColumnIndex = 1;
    if (!expandIconAsCell) {
      expandIconColumnIndex = -1;
      extraProps.expandedRowKeys = expandedRowKeys;
    }

    if (expandedRowRender) {
      extraProps.expandedRowRender = expandedRowKeys;
    }

    const locale = { emptyText: empty };

    let {
      rowSelection,
      onRowClick,
    } = this.props;
    const shapedColumns = this.shapeColumns(columns);
    if (radio) {
      rowSelection = {
        type: 'radio',
        selectedRowKeys: radio.selectedRowKeys,
        onSelect: (record) => {
          radio.selectRow(record);
        },
      };
      onRowClick = (record) => {
        radio.selectRow(record);
      };
    }
    if (checkbox) {
      rowSelection = {
        type: 'checkbox',
        selectedRowKeys: checkbox.selectedRowKeys,
        onSelect: (record, selected) => {
          checkbox.selectRows([record], selected);
        },
        onSelectAll: (selected, selectedRows, changedRows) => {
          checkbox.selectRows(changedRows, selected);
        },
        getCheckboxProps: checkbox.getCheckboxProps,
      };
    }

    return (
      <Spin spinning={loading}>
        <AntdTable
          {...extraProps}
          className="fe-table"
          title={title ? () => title : undefined}
          bordered={bordered}
          searchParams={searchParams}
          rowKey={rowKey}
          columns={shapedColumns}
          dataSource={dataSource.length > 0 ? dataSource : value}
          pagination={
            pagination ? {
              pageSize: 20,
              showTotal,
              ...pagination,
            } : false}
          onChange={onChange || this.onChange.bind(this)}
          rowSelection={rowSelection}
          scroll={{ x: xScroll, y: yScroll }}
          size={size}
          onRowClick={onRowClick}
          rowClassName={(record, index) => `table-row-${(index % 2) ? 'even' : 'odd'}`}
          showHeader={showHeader}
          childrenColumnName={childrenColumnName}
          defaultExpandAllRows={defaultExpandAllRows}
          locale={locale}
          expandIconAsCell={expandIconAsCell}
          expandIconColumnIndex={expandIconColumnIndex}
        />
        { children }
      </Spin>
    );
  }
}

export default Table;
