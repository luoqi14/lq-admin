import React, { Component } from 'react';
import {
  Table as AntdTable,
  Spin,
  Tooltip,
  Icon,
  Popover,
  Checkbox,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import XLSX from 'xlsx';
import maximize from '../decorators/maximize';
import Tag from '../../components/Tag';

import './style.scss';
import { formatMoney } from '../../util';

class Table extends Component {
  static propTypes = {
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    search: PropTypes.func,
    searchParams: PropTypes.object,
    extraParams: PropTypes.object,
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
    empty: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    expandIconAsCell: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    exportName: PropTypes.string,
    onExpand: PropTypes.func,
  };

  static defaultProps = {
    rowKey: 'id',
    loading: false,
    dataSource: [],
    rowSelection: undefined,
    pagination: false,
    search: undefined,
    searchParams: {},
    extraParams: {},
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
    showTotal: (total, range) =>
      `显示第 ${range[0]} 到第 ${range[1]} 条记录，总共 ${total} 条记录`,
    valueName: 'id',
    displayName: 'label',
    showHeader: true,
    empty: '暂无数据',
    expandIconAsCell: true,
    expandedRowKeys: [],
    exportName: '',
    onExpand: () => {},
  };

  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    // const value = props.value || [];
    // JSON.stringify(value) !== '[]' && props.onChange && this.props.onChange(value);
    this.state = {
      exporting: false,
      value: props.value || [],
    };
    this.columnsMap = {};
    this.shapeColumns(props.columns, false, true).forEach(col => {
      this.columnsMap[col.name] = col;
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   // Should be a controlled component.
  //   if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
  //     this.props.onChange && this.props.onChange(nextProps.value);
  //   }
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Should be a controlled component.
    if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.value)) {
      nextProps.onChange && nextProps.onChange(nextProps.value);
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  onChange(page, filters, sorter) {
    this.props.search({
      ...this.props.searchParams,
      ...this.props.extraParams,
      pageNo: +page.current,
      pageSize: page.pageSize,
      columnKey: sorter.columnKey,
      order: sorter.order,
    });
  }

  exportChange = checkedValues => {
    this.exportValues = checkedValues;
    this.setState({});
  };

  rowClassName = (record, index) => {
    const { rowClassName } = this.props;
    let extraClass = '';
    if (rowClassName) {
      extraClass = rowClassName(record, index);
    }
    return `table-row-${index % 2 ? 'even' : 'odd'} ${extraClass}`;
  };

  shapeColumns(columns, exporting, all) {
    const { sorter, pagination, exportName } = this.props;
    const timeMap = {
      datetime: 'YYYY-MM-DD HH:mm:ss',
      datetimeRange: 'YYYY-MM-DD HH:mm:ss',
      date: 'YYYY-MM-DD',
      dateRange: 'YYYY-MM-DD',
    };
    let shapedColumns = columns.map(col => {
      const column = { ...col };
      if ('align' in column) {
        column.className = `${column.className || ''} table-column-${
          column.align
        }`;
      }
      if ('label' in column && !('title' in column)) {
        column.title = column.label;
      }
      if ('columnHelp' in column) {
        column.title = (
          <span>
            {column.title}
            <Tooltip title={column.columnHelp}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        );
      }
      if ('name' in column) {
        column.key = column.name;
        column.dataIndex = column.name;
      }
      if ('sorter' in column && !('sortOrder' in column)) {
        column.sortOrder = sorter.columnKey === column.name && sorter.order;
      }
      if (column.type in timeMap) {
        if (column.render) {
          column.originRender = column.render;
        }
        column.render = (text, record) => {
          let resText = text;
          if (`${text}`.length === 13) {
            resText = +text;
          }
          return column.originRender
            ? column.originRender(text, record)
            : (resText || '') &&
                moment(resText).format(
                  column.timeFormat || timeMap[column.type]
                );
        };
      }
      if (column.columnType === 'sequence') {
        column.render = (text, record, index) => {
          if (pagination) {
            return (
              index +
              1 +
              +(pagination.current - 1 || 0) * (pagination.pageSize || 10)
            );
          }
          return index + 1;
        };
      }
      if (column.type === 'select' && !('render' in column)) {
        if (Object.prototype.toString.call(column.data) === '[object Array]') {
          const dict = {};
          column.data.forEach(item => {
            dict[item[column.valueName || 'id']] =
              item[column.displayName || 'label'];
            column.render = text => dict[text] || dict[`${text}`];
          });
        } else {
          column.render = text => {
            return column.data[text] || column.data[`${text}`];
          };
        }
      }
      if (column.type === 'number' && !('render' in column) && column.reduce) {
        column.render = text => formatMoney(text, column.reduce);
      }
      if (column.type === 'tag' && !('render' in column)) {
        column.render = text => <Tag disabled value={text} />;
      }
      if (column.line) {
        if (column.render) {
          column.originRender = column.render;
        }
        column.render = (text, record) => {
          const renderedText = column.originRender
            ? column.originRender(text, record)
            : text;
          return (
            <Tooltip title={renderedText}>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: column.line,
                  overflow: 'hidden',
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

    const filterCols = shapedColumns.filter(i => i.export);
    this.exportValues = this.exportValues || filterCols.map(i => i.name);

    exportName && this.createMenu(filterCols);

    if (exporting) {
      shapedColumns = this.exportValues.map(i => {
        return this.columnsMap[i];
      });
    } else if (!all) {
      shapedColumns = shapedColumns.filter(i => !i.hidden);
    }

    return shapedColumns;
  }

  createMenu = filterCols => {
    this.menu = [
      <Checkbox.Group
        key="1"
        defaultValue={this.exportValues}
        onChange={this.exportChange}
      >
        {filterCols.map(i => {
          return (
            <div key={i.name}>
              <Checkbox
                value={i.name}
                disabled={
                  this.exportValues.length === 1
                    ? i.name === this.exportValues[0]
                    : false
                }
              >
                {i.label}
              </Checkbox>
            </div>
          );
        })}
      </Checkbox.Group>,
      <div
        key="2"
        className="flex flex-c"
        style={{ borderTop: '1px solid #ddd', marginTop: 8, paddingTop: 8 }}
      >
        <Button size="small" onClick={this.export}>
          导出
        </Button>
      </div>,
    ];
  };

  export = () => {
    this.setState(
      {
        exporting: true,
      },
      () => {
        const wb = XLSX.utils.table_to_book(
          this.tableRef.current.querySelector('table')
        );
        XLSX.writeFile(wb, `${this.props.exportName || '表格'}.xlsx`);
        this.setState({
          exporting: false,
        });
      }
    );
  };

  render() {
    const {
      loading,
      columns,
      dataSource = [],
      pagination,
      searchParams,
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
      exportName,
      components,
      onRow,
      className = '',
      onExpand,
      page,
    } = this.props;

    const { value = [] } = this.state;

    const extraProps = {};

    if (components) {
      extraProps.components = components;
      extraProps.onRow = onRow;
    }

    let expandIconColumnIndex = 1;
    if (!expandIconAsCell) {
      expandIconColumnIndex = -1;
      extraProps.expandedRowKeys = expandedRowKeys;
    }

    if (expandedRowRender) {
      extraProps.expandedRowRender = expandedRowRender;
    }

    const locale = { emptyText: empty };

    let { rowSelection, onRowClick } = this.props;
    const shapedColumns = this.shapeColumns(columns, this.state.exporting);
    if (radio) {
      rowSelection = {
        type: 'radio',
        selectedRowKeys: radio.selectedRowKeys,
        onSelect: record => {
          radio.selectRow && radio.selectRow(record);
        },
        onChange: radio.onChange,
      };
      onRowClick = record => {
        radio.selectRow && radio.selectRow(record);
      };
    }
    if (checkbox) {
      rowSelection = {
        type: 'checkbox',
        selectedRowKeys: checkbox.selectedRowKeys,
        onSelect: (record, selected) => {
          checkbox.selectRows && checkbox.selectRows([record], selected);
        },
        onSelectAll: (selected, selectedRows, changedRows) => {
          checkbox.selectRows && checkbox.selectRows(changedRows, selected);
        },
        onChange: checkbox.onChange,
        getCheckboxProps: checkbox.getCheckboxProps,
      };
    }

    let aPage = false;

    if (page) {
      aPage = {
        ...(pagination || {}),
        current: page.pageNo,
        total: page.total,
        pageSize: page.pageSize || 20,
      };
    }

    return (
      <div className={`fe-table-container ${className}`} ref={this.tableRef}>
        <Spin spinning={loading}>
          {exportName && (
            <Popover content={this.menu}>
              <a className="table-export-icon" key="export" title="导出">
                <Icon type="export" />
              </a>
            </Popover>
          )}
          <AntdTable
            {...extraProps}
            className="fe-table"
            title={title ? () => title : undefined}
            bordered={bordered}
            searchParams={searchParams}
            rowKey={rowKey}
            columns={shapedColumns}
            dataSource={
              (dataSource || []).length > 0 ? dataSource : value || []
            }
            pagination={
              pagination
                ? {
                    pageSize: 20,
                    showTotal,
                    ...pagination,
                  }
                : aPage
            }
            onChange={this.onChange.bind(this)}
            rowSelection={rowSelection}
            scroll={{ x: xScroll, y: yScroll }}
            size={size}
            onRowClick={onRowClick}
            rowClassName={this.rowClassName}
            showHeader={showHeader}
            childrenColumnName={childrenColumnName}
            defaultExpandAllRows={defaultExpandAllRows}
            locale={locale}
            expandIconAsCell={expandIconAsCell}
            expandIconColumnIndex={expandIconColumnIndex}
            onExpand={onExpand}
          />
          {children}
        </Spin>
      </div>
    );
  }
}

export default maximize(Table);
