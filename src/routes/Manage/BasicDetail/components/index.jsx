import React, { Component } from 'react';
import { message, Button, Icon } from 'antd';
import DetailPage from '../../../../components/DetailPage';
import ImagePreview from '../../../../components/ImagePreview';
import { formatMoney } from '../../../../util';
import Input from '../../../../components/Input';
import UserSelect from '../../../../bizComponents/UserSelect';

class View extends Component {
  render() {
    const {
      record,
      changeRecord,
      confirm,
      toggle,
      disabled,
      menuRouter,
      visible,
      index,
      className,
    } = this.props;
    return (
      <div style={{ width: '100%' }} className={className}>
        <ImagePreview
          visible={visible}
          images={this.props.imgs}
          hide={() => {
            this.props.show(false, index);
          }}
          index={index}
        />
        <DetailPage
          topTitle="表单标题"
          values={record}
          changeRecord={changeRecord}
          breadcrumb={menuRouter}
          fields={[
            {
              type: 'title',
              label:
                '表单组件集合，功能包括：布局，可编辑及查看，校验，传入值（可做默认值），输出值。',
              className: 'warning',
            },
            {
              type: 'title',
              label: '常见表单组件',
            },
            {
              label: '输入框',
              name: 'input1',
              href: '/Manage/SearchList',
              antdAddonAfter: '元',
              icon: 'user',
              unit: '元',
            },
            {
              label: '密码框',
              name: 'password1',
              type: 'password',
              help: '说明文字',
            },
            {
              label: '下拉选择框',
              name: 'select1',
              type: 'select',
              valueName: 'id',
              displayName: 'name',
              showSearch: true,
              multiple: false,
              data: [
                {
                  id: '1',
                  name: 'jack',
                },
                {
                  id: '2',
                  name: 'rose',
                },
              ],
            },
            {
              label: '文本框',
              name: 'textarea1',
              type: 'textarea',
              placeholder: '自定义占位符',
              max: 200,
              colSpan: 24,
              labelSpan: 4,
              wrapperSpan: 20,
            },
            {
              label: '单选框',
              name: 'radio1',
              type: 'radio',
              styleType: 'button',
              data: { 1: '男', 2: '女', 3: '不明' },
            },
            {
              label: '复选框',
              name: 'checkbox1',
              type: 'checkbox',
              data: { 1: '男', 2: '女', 3: '不明' },
            },
            {
              label: '数字框',
              name: 'number1',
              type: 'number',
              min: 1,
              max: 1000000000,
              double: 'left',
              size: 'large',
              reduce: 0.01,
              precision: 6,
              money: false,
              antdAddonAfter: '万元',
              render: value => formatMoney(value, 0.01, 6, true, 2, true),
            },
            {
              label: '数字范围框',
              name: 'numberRange1',
              type: 'numberRange',
              startMin: -100,
              endMax: 100,
              double: 'right',
              placeholderPrefix: ['最低', '最高'],
            },
            {
              label: '日期选择框',
              name: 'date2',
              type: 'datetime',
            },
            {
              label: '日期范围框',
              name: 'dateRange1',
              type: 'dateRange',
            },
            {
              label: '时间选择框',
              name: 'time1',
              type: 'time',
            },
            {
              label: '时间范围框',
              name: 'timeRange1',
              type: 'timeRange',
              names: ['timeStart', 'timeEnd'],
            },
            {
              label: '日期时间选择框',
              double: 'left',
              name: 'datetime1',
              type: 'datetime',
            },
            {
              label: '日期时间范围框',
              double: 'right',
              name: 'datetimeRange1',
              type: 'datetimeRange',
              maxInterval: 1296000000, // 15days
            },
            {
              label: '月份选择框',
              name: 'month1',
              double: 'left',
              type: 'month',
            },
            {
              label: '月份范围框',
              name: 'monthRange1',
              double: 'right',
              type: 'monthRange',
            },
            {
              label: '三级地址',
              name: 'address1',
              type: 'address',
              displayValue: true,
              changeOnSelect: true,
            },
            {
              label: '标签',
              name: 'tag1',
              type: 'tag',
            },
            {
              label: 'html',
              name: 'html1',
              type: 'html',
              required: false,
              html: (
                <a href="/1.pdf" target="_blank">
                  pdf
                </a>
              ),
            },
            {
              label: '开关',
              name: 'switch1',
              type: 'switch',
            },
            {
              label: '手机验证',
              name: 'captcha1',
              type: 'captcha',
              phone: true,
              onClick: () => undefined,
            },
            {
              label: '穿梭框',
              name: 'transfer1',
              type: 'transfer',
              data: [{ key: 1, title: '苹果' }, { key: 2, title: '香蕉' }],
              selectedKeys: [1],
              long: true,
            },
            {
              label: '图片与文件',
              type: 'title',
            },
            {
              label: '图片',
              name: 'image1',
              type: 'image',
              long: true,
              mostPic: 5,
              adjust: true,
              getToken: () => 'xxxxx',
              data: {
                token:
                  'yL6CIGboqnDMqHcDM12eHdnqXVA7eYQbXpJ7uPbL:ysqnxpQCGZxc9GnQKpLFNpvOjV' +
                  '8=:eyJzY29wZSI6Inhpbmd1YW5nLWx1b3FpIiwiZGVhZGxpbmUiOjE1MTAzNDQzMTV9',
                type: 'test',
              },
              unit: (
                <a download="111" href="/1.pdf">
                  <Icon type="download" />
                  下载
                </a>
              ),
              onPreview: (value, i) => {
                this.props.show(true, i);
              },
              text: '上传文件',
              getUrl: res => res.resultData,
              action: '//gateway.qafc.ops.com/cb-business/file/upload',
              headers: {
                Authorization: '8a4cf7e7-f2b2-4e3d-b19e-3cd9495a26f8',
              },
              afterChange: value => {
                this.props.changeImgs(value);
              },
              showName: true,
              extras: ['说明文字', '标签'],
            },
            {
              label: '文件',
              name: 'file1',
              type: 'file',
              width: 140,
              height: 140,
              single: false,
              disabled: false,
              tokenSeparators: ',',
              long: true,
              mostPic: 3,
              beforeUpload: this.beforeUpload,
              action:
                'http://gateway.dev.ops.com/tubobo-bdtools/common/photo/upload',
              getUrl: res => res.resultData,
              getToken: () => 'xxxx',
              data: {
                bucketType: 'private',
                projectName: 'bdtools',
                token: '2e6570903c1b4c9f8f04163128fc7ebe',
              },
            },
            {
              label: '树',
              type: 'title',
            },
            {
              label: '树',
              name: 'tree1',
              type: 'tree',
              data: [
                {
                  title: '0-0',
                  key: '0-0',
                  children: [
                    {
                      title: '0-0-0',
                      key: '0-0-0',
                      children: [
                        { title: '0-0-0-0', key: '0-0-0-0' },
                        { title: '0-0-0-1', key: '0-0-0-1' },
                        { title: '0-0-0-2', key: '0-0-0-2' },
                      ],
                    },
                    {
                      title: '0-0-1',
                      key: '0-0-1',
                      children: [
                        { title: '0-0-1-0', key: '0-0-1-0' },
                        { title: '0-0-1-1', key: '0-0-1-1' },
                        { title: '0-0-1-2', key: '0-0-1-2' },
                      ],
                    },
                    {
                      title: '0-0-2',
                      key: '0-0-2',
                    },
                  ],
                },
                {
                  title: '0-1',
                  key: '0-1',
                  children: [
                    { title: '0-1-0-0', key: '0-1-0-0' },
                    { title: '0-1-0-1', key: '0-1-0-1' },
                    { title: '0-1-0-2', key: '0-1-0-2' },
                  ],
                },
                {
                  title: '0-2',
                  key: '0-2',
                },
              ],
            },
            {
              label: '表格',
              type: 'title',
            },
            {
              label: '表格',
              name: 'table1',
              type: 'table',
              title: <Button type="primary">新增</Button>,
              long: true,
              rowKey: 'id',
              pagination: true,
              columns: [
                {
                  label: '列1',
                  name: 'col1',
                  editable: true,
                  width: '100px',
                },
                {
                  label: '列2',
                  name: 'col2',
                },
              ],
            },
            {
              type: 'title',
              label: '区块',
            },
            {
              key: '3',
              label: '关联货柜',
              long: true,
              items: [
                {
                  type: 'select',
                  label: '',
                  float: true,
                  inputWidth: 200,
                  name: 'typeId',
                },
                {
                  name: 'deleButton',
                  type: 'html',
                  float: true,
                  html: (
                    <Button style={{ marginLeft: 16 }} type="danger">
                      删除
                    </Button>
                  ),
                },
              ],
            },
            {
              key: '1',
              colSpan: 12,
              wrapperSpan: 24,
              items: [
                {
                  label: '标题',
                  name: 'title',
                  labelSpan: 8,
                  wrapperSpan: 14,
                  placeholder: '自定义占位符',
                  required: true,
                },
                {
                  label: '门店标题',
                  name: 'storeTitle',
                  labelSpan: 8,
                  wrapperSpan: 14,
                  required: true,
                },
                {
                  label: '票尾1',
                  name: 'footer1',
                  labelSpan: 8,
                  wrapperSpan: 14,
                },
                {
                  label: '票尾2',
                  name: 'footer2',
                  labelSpan: 8,
                  wrapperSpan: 14,
                },
                {
                  label: '票尾3',
                  name: 'footer3',
                  labelSpan: 8,
                  wrapperSpan: 14,
                },
              ],
            },
            {
              key: '2',
              colSpan: 12,
              wrapperSpan: 24,
              items: [
                {
                  label: '预览',
                  name: 'preview',
                  type: 'html',
                  html: <div>预览文字</div>,
                },
              ],
            },
            {
              type: 'title',
              label: 'Nested data',
            },
            {
              label: '嵌套1',
              name: 'footers[0]',
              extra: 'obj[]',
            },
            {
              label: '嵌套2',
              name: 'footers[1]',
            },
            {
              label: '嵌套3',
              name: 'teacher.name',
              extra: 'obj.',
            },
            {
              label: '嵌套4',
              name: 'teachers[0].name',
              extra: 'obj[].',
            },
            {
              type: 'title',
              label: '动态增减',
            },
            {
              name: 'dynamic1',
              type: 'dynamicAddDel',
              closeType: 'icon',
              addButtonIcon: 'plus',
              addButtonText: '新增Text',
              length: 2,
              fields: [
                {
                  placeholder: 'xxx',
                  name: 'name',
                  colSpan: 24,
                  required: true,
                  label: 'c1',
                  labelSpan: 4,
                  wrapperSpan: 7,
                },
                {
                  label: 'yyy',
                  name: 'startTime',
                  type: 'datetime',
                  colSpan: 24,
                  required: true,
                  labelSpan: 4,
                  wrapperSpan: 7,
                },
              ],
            },
            {
              type: 'title',
              label: '富文本',
            },
            {
              label: '富文本',
              name: 'editor1',
              type: 'editor',
              long: true,
            },
            {
              type: 'title',
              label: '自定义',
            },
            {
              label: '自1',
              name: 'cuz1',
              component: Input,
            },
            {
              label: '自2',
              key: '4',
              itemName: 'stores',
              wrapperSpan: 20,
              component: UserSelect,
            },
            {
              type: 'title',
              label: '地图',
            },
            {
              label: '地图',
              name: 'map1',
              type: 'map',
              long: true,
            },
          ].map(field => ({
            required: true,
            disabled,
            ...field,
          }))}
          buttons={[
            {
              label: '提交',
              confirm: '确认提交？',
              onClick: form => {
                // force is important, as default the value not change won't validate the rules
                form.validateFieldsAndScroll({ force: true }, (err, values) => {
                  if (!err) {
                    message.info(JSON.stringify(values));
                    confirm();
                  }
                });
              },
            },
            {
              label: disabled ? '修改' : '查看',
              onClick: () => {
                toggle();
              },
              type: 'secondary',
            },
          ]}
          buttonAlign="center"
          topButtons={[
            {
              label: '刷新',
              onClick: () => {
                this.props.refresh();
              },
              icon: 'sync',
              type: 'default',
            },
            {
              label: '返回',
              onClick: () => {},
              icon: 'rollback',
              type: 'default',
            },
          ]}
          // layout="inline"
        />
      </div>
    );
  }
}

export default View;
