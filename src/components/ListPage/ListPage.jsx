import React, { Component } from 'react';
import { Row, Col, Button, Icon, Breadcrumb, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Table from '../Table';
import SearchForm from '../SearchForm';
import ModalForm from '../ModalForm';
import './style.scss';

const LinkWrapper = (props) => {
  const Com = props.to ? Link : 'a';
  return (
    <Com {...props}>
      {props.children}
    </Com>
  );
};

export default class ListPage extends Component {
  static propTypes = {
    rowKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
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
    pagination: {},
    tab: undefined,
    searchButtonSpan: 6,
    tabBarExtraContent: undefined,
    leftPane: undefined,
  };

  save(values) {
    const isAdd = !values.id;
    this.props.save(values).then((isSuccess) => {
      const offset = isAdd ? '0' : (this.props.page && this.props.page.offset) || '0';
      const limit = (this.props.page && this.props.page.limit) || '20';
      isSuccess && this.props.search && this.props.search({
        ...this.props.searchParams,
        offset,
        limit,
      });
    });
  }

  render() {
    const createButton = (btnOpts) => (
      btnOpts.map((item) => {
        if (!item.hidden) {
          return (
            <Button
              key={`button${item.label}`}
              type={item.type || 'primary'}
              onClick={item.onClick.bind(this)}
              disabled={item.disabled}
              icon={item.icon}
              loading={item.loading}
              size={item.size}
            >
              {
                item.iconType ?
                  <Icon type={item.iconType} />
                  : <span />
              }
              {item.label}
            </Button>
          );
        }
        return undefined;
      })
    );

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
    } = this.props;

    const tabButtons = buttonPos === 'tab' ? createButton(buttons) : null;
    const tabBarContent = tabBarExtraContent || tabButtons;

    return (
      <div className={`${className} fe-listpage`} style={style} >
        {
          (breadcrumb.length > 0 || title || buttons.length > 0) &&
          <Row
            className="listpage-title-container"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <Col style={{ display: 'flex' }}>
              {
                breadcrumb.length > 0 && (
                  <Breadcrumb separator={breadcrumbSeparator}>
                    {
                      breadcrumb.map((item) => ((
                        <Breadcrumb.Item key={item.id}>
                          {!item.href && item.name}
                          {item.href && (<LinkWrapper to={item.href}>{item.name}</LinkWrapper>)}
                        </Breadcrumb.Item>
                      )))
                    }
                  </Breadcrumb>
                )
              }
              <div className="ant-page-title">
                {title}
              </div>
            </Col>
            <Col className="listpage-button-container">
              {buttonPos === 'top' && checkbox && checkbox.selectedRowKeys.length > 0
              && (
                <span className="listpage-selected-wrapper">已选择
                  <span className="listpage-selected-num">{checkbox.selectedRowKeys.length}</span>项，
                  <a role="button" tabIndex="-1" onClick={checkbox.clearSelectedKeys}>清空</a>
                </span>
              )}
              {buttonPos === 'top' && createButton(buttons)}
              {createButton(topButtons)}
            </Col>
          </Row>
        }
        {aboveSearch}
        {
          !this.props.noSearch &&
          <SearchForm
            fields={searchFields || columns.filter((item) => !!item.search)}
            search={search}
            changeRecord={changeSearch}
            values={searchParams}
            page={page}
            reset={resetSearch}
            sorter={sorter}
            buttonStyle={searchButtonStyle}
            hideReset={hideReset}
            buttonSpan={searchButtonSpan}
          />
        }
        <div className="flex listpage-main-container">
          { leftPane && (
            leftPane
          ) }
          <div className="listpage-table-container">
            {
              (tableTitle || (buttonPos === 'table' && buttons.length > 0)) && (
                <Row
                  type="flex"
                  style={{ marginBottom: 16 }}
                  justify="space-between"
                  className="fe-table-title-container"
                >
                  <Col className="flex flex-c fe-table-title">{tableTitle}</Col>
                  {
                    buttonPos === 'table' && (
                      <Col>
                        {checkbox && checkbox.selectedRowKeys.length > 0
                        && (
                          <span className="listpage-selected-wrapper">已选择
                            <span className="listpage-selected-num">{checkbox.selectedRowKeys.length}</span>项，
                            <a role="button" tabIndex="-1" onClick={checkbox.clearSelectedKeys}>清空</a>
                          </span>
                        )}
                        {createButton(buttons)}
                      </Col>
                    )
                  }
                </Row>
              )
            }
            {
              tab && (
                <Tabs
                  activeKey={tab.activeKey}
                  onChange={tab.onChange}
                  tabBarExtraContent={tabBarContent}
                >
                  {tab.item.map((item) => {
                    return (
                      <Tabs.TabPane tab={item.title} key={item.key}>
                        <Table
                          {...this.props}
                          {...tableOpts}
                          title={undefined}
                          rowKey={rowKey}
                          columns={columns.filter((col) => !col.hidden)}
                          dataSource={data}
                          loading={loading}
                          search={search}
                          expandedRowRender={expandedRowRender}
                          pagination={
                            page ? {
                              ...pagination,
                              current: Math.floor(+page.offset / (page.limit || 20)) + 1,
                              total: page.total,
                              pageSize: page.limit || 20,
                            } : null
                          }
                          sorter={sorter}
                          xScroll={xScroll}
                        />
                      </Tabs.TabPane>
                    );
                  })}
                </Tabs>
              )
            }
            {
              !tab && (
                <Table
                  {...this.props}
                  {...tableOpts}
                  title={undefined}
                  rowKey={rowKey}
                  columns={columns.filter((item) => !item.hidden)}
                  dataSource={data}
                  loading={loading}
                  search={search}
                  expandedRowRender={expandedRowRender}
                  pagination={
                    page ? {
                      ...pagination,
                      current: Math.floor(+page.offset / (page.limit || 20)) + 1,
                      total: page.total,
                      pageSize: page.limit || 20,
                    } : null
                  }
                  sorter={sorter}
                  xScroll={xScroll}
                />
              )
            }
          </div>
        </div>
        {
          modalVisible && (
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
          )
        }
        {children}
      </div>
    );
  }
}
