import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Icon,
  Breadcrumb,
  Tabs,
  Popconfirm,
  Tag,
  Tooltip,
  Upload,
  message,
} from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Table from '../EditableTable';
import SearchForm from '../SearchForm';
import ModalForm from '../ModalForm';
import './style.scss';
import { getBaseUrl } from '../../util';

const LinkWrapper = props => {
  const Com = props.to ? Link : 'a';
  return <Com {...props}>{props.children}</Com>;
};

export default class ListPage extends Component {
  static propTypes = {
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    title: PropTypes.string,
    name: PropTypes.string,
    loading: PropTypes.bool,
    confirmDisabled: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    fields: PropTypes.array,
    data: PropTypes.array,
    search: PropTypes.func,
    save: PropTypes.func,
    record: PropTypes.object,
    modalVisible: PropTypes.bool,
    cancel: PropTypes.func,
    tableOpts: PropTypes.object,
    changeRecord: PropTypes.func,
    changeSearch: PropTypes.func,
    searchParams: PropTypes.object,
    extraParams: PropTypes.object,
    resetSearch: PropTypes.func,
    aboveSearch: PropTypes.object,
    sorter: PropTypes.object,
    xScroll: PropTypes.number,
    validateDisabled: PropTypes.bool,
    breadcrumb: PropTypes.array,
    breadcrumbSeparator: PropTypes.string,
    page: PropTypes.object,
    radio: PropTypes.object,
    checkbox: PropTypes.object,
    tableTitle: PropTypes.string,
    searchButtonStyle: PropTypes.object,
    buttonPos: PropTypes.string,
    pagination: PropTypes.object,
    tab: PropTypes.object,
    searchButtonSpan: PropTypes.number,
    tabBarExtraContent: PropTypes.element,
    leftPane: PropTypes.element,
    exportName: PropTypes.string,
    help: PropTypes.string,
  };

  static defaultProps = {
    rowKey: 'id',
    title: '',
    name: '',
    loading: false,
    confirmDisabled: false,
    confirmLoading: false,
    fields: undefined,
    data: [],
    search: undefined,
    save: undefined,
    record: {},
    modalVisible: false,
    cancel: undefined,
    tableOpts: {},
    changeRecord: undefined,
    searchParams: undefined,
    extraParams: undefined,
    aboveSearch: undefined,
    sorter: {},
    xScroll: 800,
    validateDisabled: false,
    breadcrumb: [],
    breadcrumbSeparator: '/',
    page: undefined,
    radio: undefined,
    checkbox: undefined,
    tableTitle: undefined,
    searchButtonStyle: undefined,
    buttonPos: 'top',
    pagination: {
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40', '50', '200'],
    },
    tab: undefined,
    searchButtonSpan: 6,
    tabBarExtraContent: undefined,
    leftPane: undefined,
    exportName: '',
    help: '',
  };

  state = {
    loading: false,
  };

  save(values) {
    const isAdd = !values.id;
    this.props.save(values).then(isSuccess => {
      const pageNo = isAdd
        ? '0'
        : (this.props.page && this.props.page.pageNo) || '1';
      const pageSize = (this.props.page && this.props.page.pageSize) || '10';
      isSuccess &&
        this.props.search &&
        this.props.search({
          ...this.props.searchParams,
          pageNo,
          pageSize,
        });
    });
  }

  render() {
    const createButton = btnOpts =>
      btnOpts.map(item => {
        if (!item.hidden) {
          let btnHtml;
          if (item.import) {
            btnHtml = (
              <Upload
                key={`button${item.label}`}
                name="file"
                action={`${getBaseUrl()}${item.action}`}
                withCredentials
                headers={{
                  Authorization: localStorage.getItem('accessToken'),
                  ServiceCityId: localStorage.getItem('cityId') || '', // mgr used
                  channel: 'mgr',
                }}
                onChange={info => {
                  if (info.file.status === 'uploading') {
                    this.setState({
                      loading: true,
                    });
                  }
                  if (info.file.status === 'done') {
                    this.setState({
                      loading: false,
                    });
                    if (info.file.response.success) {
                      message.success('操作成功');
                      item.success && item.success(info.file.response);
                    } else {
                      message.error(info.file.response.msg);
                      item.failure && item.failure(info.file.response);
                    }
                  }
                  if (info.file.status === 'error') {
                    this.setState({
                      loading: false,
                    });
                    message.error(info.file.error.message);
                  }
                }}
                showUploadList={false}
                data={item.data}
              >
                <Button type="primary" loading={this.state.loading}>
                  {item.label}
                </Button>
              </Upload>
            );
          } else {
            btnHtml = (
              <Button
                key={`button${item.label}`}
                type={item.type || 'primary'}
                onClick={item.confirm ? undefined : item.onClick.bind(this)}
                disabled={item.disabled}
                icon={item.icon}
                loading={item.loading}
                size={item.size}
              >
                <div style={{ display: 'inline-block' }}>
                  {item.iconType ? <Icon type={item.iconType} /> : <span />}
                  {item.label}
                  {item.tooltip && (
                    <Tooltip title={item.tooltip}>
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  )}
                </div>
              </Button>
            );
          }
          if (item.confirm && !item.disabled) {
            btnHtml = (
              <Popconfirm
                key={`button${item.label}`}
                title={item.confirm}
                onConfirm={() => {
                  item.onClick(this.props.form);
                }}
                okText="确定"
                cancelText="取消"
              >
                {btnHtml}
              </Popconfirm>
            );
          }
          if (item.tooltip && !item.disabled) {
            btnHtml = (
              <Tooltip
                key={`button${item.label}`}
                title={item.tooltip}
                placement={item.placement || 'top'}
              >
                {btnHtml}
              </Tooltip>
            );
          }
          return btnHtml;
        }
        return undefined;
      });

    const {
      rowKey,
      title,
      name,
      loading = false,
      confirmDisabled,
      confirmLoading,
      columns,
      data,
      search,
      cancel,
      record,
      fields = [],
      modalVisible,
      tableOpts,
      changeSearch,
      searchParams,
      extraParams,
      page,
      buttons = [],
      searchFields,
      style,
      cusTitle,
      formWidth,
      children,
      changeRecord,
      expandedRowRender,
      resetSearch,
      aboveSearch,
      sorter,
      xScroll,
      validateDisabled,
      breadcrumb,
      checkbox,
      searchButtonStyle,
      buttonPos,
      tableTitle,
      hideReset,
      pagination,
      tab,
      searchButtonSpan,
      tabBarExtraContent,
      breadcrumbSeparator,
      topButtons = [],
      leftPane,
      className = '',
      help,
      searchSuccess,
      searchText,
      cuzSearch,
    } = this.props;

    const tabButtons = buttonPos === 'tab' ? createButton(buttons) : null;
    const tabBarContent = tabBarExtraContent || tabButtons;

    return (
      <div className={`${className} fe-listpage`} style={style}>
        {(breadcrumb.length > 0 || title || buttons.length > 0) && (
          <Row
            className="listpage-title-container"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <Col className="flex flex-c">
              {breadcrumb.length > 0 && (
                <Breadcrumb separator={breadcrumbSeparator}>
                  {breadcrumb.map(item => (
                    <Breadcrumb.Item key={item.id}>
                      {!item.href && item.name}
                      {item.href && (
                        <LinkWrapper to={item.href}>{item.name}</LinkWrapper>
                      )}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              )}
              {help && (
                <Tooltip title={help}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              )}
              <div className="ant-page-title">{title}</div>
            </Col>
            <Col className="listpage-button-container">
              {buttonPos === 'top' &&
                checkbox &&
                checkbox.selectedRowKeys.length > 0 && (
                  <Tag color="orange">
                    <span className="listpage-selected-wrapper">
                      已选择
                      <span className="listpage-selected-num">
                        {checkbox.selectedRowKeys.length}
                      </span>
                      项，
                      <a
                        role="button"
                        tabIndex="-1"
                        onClick={checkbox.clearSelectedKeys}
                      >
                        清空
                      </a>
                    </span>
                  </Tag>
                )}
              {buttonPos === 'top' && createButton(buttons)}
              {createButton(topButtons)}
            </Col>
          </Row>
        )}
        {aboveSearch}
        {!this.props.noSearch && (
          <SearchForm
            fields={
              searchFields ||
              columns
                .filter(item => !!item.search)
                .sort((a, b) => {
                  if (a.searchSequence < b.searchSequence) {
                    return -1;
                  }
                  return 1;
                })
            }
            search={search}
            cuzSearch={cuzSearch}
            changeRecord={changeSearch}
            values={searchParams}
            page={page}
            reset={resetSearch}
            sorter={sorter}
            buttonStyle={searchButtonStyle}
            hideReset={hideReset}
            buttonSpan={searchButtonSpan}
            extraParams={extraParams}
            searchSuccess={searchSuccess}
            searchText={searchText}
          />
        )}
        <div className="flex listpage-main-container">
          {leftPane && leftPane}
          <div className="listpage-table-container">
            {(tableTitle || (buttonPos === 'table' && buttons.length > 0)) && (
              <Row
                type="flex"
                style={{ marginBottom: 16 }}
                justify="space-between"
                className="fe-table-title-container"
              >
                <Col className="flex flex-c fe-table-title">{tableTitle}</Col>
                {buttonPos === 'table' && (
                  <Col>
                    {checkbox && checkbox.selectedRowKeys.length > 0 && (
                      <Tag color="orange">
                        <span className="listpage-selected-wrapper">
                          已选择
                          <span className="listpage-selected-num">
                            {checkbox.selectedRowKeys.length}
                          </span>
                          项，
                          <a
                            role="button"
                            tabIndex="-1"
                            onClick={checkbox.clearSelectedKeys}
                          >
                            清空
                          </a>
                        </span>
                      </Tag>
                    )}
                    {createButton(buttons)}
                  </Col>
                )}
              </Row>
            )}
            {tab && (
              <Tabs
                activeKey={tab.activeKey}
                onChange={tab.onChange}
                tabBarExtraContent={tabBarContent}
              >
                {tab.item.map(item => {
                  return (
                    <Tabs.TabPane tab={item.title} key={item.key}>
                      <Table
                        {...this.props}
                        {...tableOpts}
                        title={undefined}
                        rowKey={rowKey}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        search={search}
                        expandedRowRender={expandedRowRender}
                        pagination={
                          page
                            ? {
                                ...pagination,
                                current: page.pageNo,
                                total: page.total,
                                pageSize: page.pageSize || 10,
                              }
                            : null
                        }
                        sorter={sorter}
                        xScroll={xScroll}
                      />
                    </Tabs.TabPane>
                  );
                })}
              </Tabs>
            )}
            {!tab && (
              <Table
                {...this.props}
                {...tableOpts}
                title={undefined}
                rowKey={rowKey}
                columns={columns}
                dataSource={data}
                loading={loading}
                search={search}
                expandedRowRender={expandedRowRender}
                pagination={
                  page
                    ? {
                        ...pagination,
                        current: page.pageNo,
                        total: page.total,
                        pageSize: page.pageSize || 10,
                      }
                    : null
                }
                sorter={sorter}
                xScroll={xScroll}
              />
            )}
          </div>
        </div>
        {modalVisible && (
          <ModalForm
            visible={modalVisible}
            onCancel={() => cancel()}
            confirmDisabled={confirmDisabled}
            confirmLoading={confirmLoading}
            onCreate={this.save.bind(this)}
            title={name}
            cusTitle={cusTitle}
            values={record}
            fields={fields}
            formWidth={formWidth}
            changeRecord={changeRecord}
            validateDisabled={validateDisabled}
          />
        )}
        {children}
      </div>
    );
  }
}
