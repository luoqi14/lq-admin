import React, { PureComponent } from 'react';
import { Modal, message } from 'antd';
import createFormItem from '../../components/createFormItem';
import ListPage from '../../components/ListPage';
import './style.scss';
import fetch from '../../util/fetch';

export default class UserSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  state = {
    visible: false,
    data: [],
    searchParams: {},
    loading: false,
    page: {
      pageNo: 1,
      pageSize: 10,
    },
    selectedKeys: [],
    dataMap: {},
    departmentData: [],
    areaData: [],
  };

  componentDidMount() {
    fetch('/dept/list', {
      pageNo: 1,
      pageSize: 1000000,
    }).then(res => {
      if (res.code == '0') {
        this.setState({
          departmentData: res.data,
        });
      }
    });
    fetch('/area/list', {
      pageNo: 1,
      pageSize: 1000000,
    }).then(res => {
      if (res.code == '0') {
        this.setState({
          areaData: res.data,
        });
      }
    });
  }

  onSelectChange = selectedKeys => {
    this.setState({
      selectedKeys,
    });
  };

  onChange = v => {
    this.props.onChange && this.props.onChange(v);
    setTimeout(() => {
      this.setState({
        selectedKeys: (v || []).map(i => i.id),
      });
    }, 1);
  };

  deleteRow = record => {
    const { value = [], onChange } = this.ref.current.props;
    const index = value.findIndex(i => record.id === i.id);
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  popWin = () => {
    const { value = [] } = this.ref.current.props;
    const dataMap = { ...this.state.dataMap };
    (value || []).forEach(i => {
      dataMap[i.id] = i;
    });
    this.setState(
      {
        visible: true,
        selectedKeys: (value || []).map(i => i.id),
        dataMap,
      },
      () => {
        if (this.state.data.length === 0 || this.props.reload) {
          this.load();
        }
      }
    );
  };

  closeWin = () => {
    this.setState({
      visible: false,
    });
  };

  changeSearch = fields => {
    const keys = Object.keys(fields);
    const searchParams = {};
    keys.forEach(i => {
      searchParams[i] = fields[i].value;
    });
    this.setState({
      searchParams,
    });
  };

  confirm = () => {
    const { onChange } = this.ref.current.props;
    const { selectedKeys, dataMap } = this.state;
    this.setState({
      visible: false,
    });
    const values = selectedKeys.map(i => dataMap[i]);
    onChange(values);
  };

  load = (params = {}) => {
    const { page, dataMap } = this.state;
    const { reload } = this.props;
    const newParams = {
      ...this.state.searchParams,
      pageNo: reload ? 1 : page.pageNo,
      pageSize: page.pageSize,
      ...params,
      deptId: params.deptId
        ? params.deptId[params.deptId.length - 1]
        : undefined,
      areaId: params.areaId
        ? params.areaId[params.areaId.length - 1]
        : undefined,
    };
    const headers = {};
    this.setState({
      loading: true,
    });
    fetch('/user/list', newParams, {
      headers,
    }).then(res => {
      if (res.code == '0') {
        res.data.rows.forEach(i => {
          dataMap[i.id] = { ...i, ...(dataMap[i.id] || {}) }; // cover field
        });
        this.setState({
          data: res.data.rows,
          page: {
            pageNo: newParams.pageNo,
            pageSize: newParams.pageSize,
            total: res.data.total,
          },
          loading: false,
          dataMap,
        });
      } else {
        this.setState({
          loading: false,
        });
        message.error(res.msg);
      }
    });
  };

  render() {
    const {
      form,
      itemName = 'userNoticeList',
      hidden,
      validator,
      wrapperSpan,
      label,
      required = true,
      disabled = false,
    } = this.props;
    const {
      visible,
      data,
      searchParams,
      loading,
      page,
      selectedKeys,
      departmentData,
      areaData,
    } = this.state;
    return form ? (
      <div className="user-select clearfix">
        <Modal
          className="user-select-modal"
          visible={visible}
          onCancel={this.closeWin}
          onOk={this.confirm}
          bodyStyle={{
            maxHeight: '80vh',
            overflow: 'auto',
          }}
          centered
          width={900}
          title="选择用户"
          okText={`确定${
            selectedKeys.length > 0 ? ` ${selectedKeys.length}` : ''
          }`}
        >
          <ListPage
            loading={loading}
            rowKey="id"
            hideReset
            searchButtonStyle={{ clear: 'none' }}
            searchButtonSpan={4}
            xScroll={600}
            tableOpts={{
              size: 'small',
            }}
            data={data}
            searchParams={searchParams}
            changeSearch={this.changeSearch}
            search={this.load}
            page={page}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: [
                '5',
                '10',
                '20',
                '30',
                '40',
                '50',
                '100',
                '200',
                '500',
              ],
            }}
            checkbox={{
              selectedRowKeys: selectedKeys,
              onChange: this.onSelectChange,
            }}
            columns={[
              {
                label: '用户名称',
                name: 'name',
                search: true,
              },
              {
                label: '所属组织',
                name: 'deptId',
                type: 'address',
                data: departmentData,
                fieldNames: { label: 'name', value: 'id' },
                search: true,
                hidden: true,
                placeholder: '请选择组织',
                changeOnSelect: true,
              },
              {
                label: '所属组织',
                name: 'deptName',
              },
              {
                label: '所属片区',
                name: 'areaId',
                type: 'address',
                data: areaData,
                fieldNames: { label: 'name', value: 'id' },
                search: true,
                hidden: true,
                placeholder: '请选择片区',
                changeOnSelect: true,
              },
              {
                label: '所属片区',
                name: 'areaName',
              },
              {
                label: '用户身份',
                name: 'identify',
                type: 'select',
                data: {
                  1: '辅警',
                  2: '民警',
                },
              },
              {
                label: '登录账号',
                name: 'phone',
                search: true,
              },
            ]}
          />
        </Modal>
        {createFormItem({
          field: {
            ref: this.ref,
            label,
            name: itemName,
            type: 'table',
            required,
            colon: false,
            wrapperSpan: wrapperSpan || 24,
            validator,
            onChange: this.onChange.bind(this),
            hidden,
            title: disabled ? null : (
              <div style={{ display: 'flex' }}>
                <a role="button" tabIndex={-1} onClick={this.popWin}>
                  选择用户
                </a>
              </div>
            ),
            rowKey: 'id',
            requiredMsg: '请选择用户',
            columns: [
              {
                label: '用户名称',
                name: 'name',
              },
              {
                label: '操作',
                name: 'action',
                render: (text, record) => {
                  return (
                    <a
                      role="button"
                      tabIndex={-1}
                      onClick={() => {
                        this.deleteRow(record);
                      }}
                      disabled={disabled}
                    >
                      删除
                    </a>
                  );
                },
              },
            ],
          },
          form,
        })}
      </div>
    ) : null;
  }
}
