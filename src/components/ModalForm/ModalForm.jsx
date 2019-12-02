import React, { useEffect } from 'react';
import { Form, Input, Modal, Row, Button, Popconfirm } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import createFormItem from '../createFormItem';
import mapPropsToFields from '../mapPropsToFields';
import onFieldsChange from '../onFieldsChange';

const FormItem = Form.Item;

const ModalForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})(props => {
  const {
    visible,
    onCancel,
    onCreate,
    title,
    fields = [],
    form,
    formWidth = 750,
    cusTitle,
    children,
    validateDisabled,
    buttons = [],
    okText = '保存',
    formClassName = 'modal-form',
    confirmLoading,
    className = '',
    recordKey = 'id',
    persistForm,
    doubleCheck = 0,
    footer,
  } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  useEffect(() => {
    persistForm && persistForm(form);
  }, form);

  const save = () => {
    validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        onCreate(values);
      }
    });
  };

  const isEdit = () => {
    let id = props.values && props.values[recordKey];
    if (typeof id === 'object') {
      id = id.value;
    }
    return !!id;
  };

  const geneForm = flds => (
    <Scrollbars autoHeight autoHeightMax={550}>
      <Form layout="horizontal" className={formClassName}>
        <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
          {getFieldDecorator(recordKey, {})(<Input type="hidden" />)}
        </FormItem>
        <Row>
          {flds.map(item =>
            createFormItem({
              field: item,
              form,
              formItemLayout,
              validateDisabled,
              inputOpts: {},
            })
          )}
        </Row>
        {children && children}
      </Form>
    </Scrollbars>
  );

  const butt = buttons.map(item => {
    let btnHtml = (
      <Button
        style={item.style}
        key={`button${item.label}`}
        type={item.type || 'primary'}
        onClick={item.confirm ? undefined : item.onClick.bind(this, form)}
        disabled={item.disabled}
        loading={item.loading}
      >
        {item.label}
      </Button>
    );
    if (item.confirm && !item.disabled) {
      btnHtml = (
        <Popconfirm
          key={`button${item.label}`}
          title={item.confirm}
          onConfirm={() => {
            item.onClick(form);
          }}
          okText="确定"
          cancelText="取消"
        >
          {btnHtml}
        </Popconfirm>
      );
    }
    return !item.hidden ? btnHtml : null;
  });
  function renderConfirmButt() {
    let tunedButt;
    if (butt.length > 0) {
      tunedButt = butt;
    } else if (doubleCheck === 1) {
      tunedButt = [
        <Popconfirm key={1} title="确认提交此自动回复" onConfirm={save}>
          <Button
            key="submit"
            size="large"
            type="primary"
            loading={confirmLoading}
          >
            {okText}
          </Button>
        </Popconfirm>,
        <Button size="large" key="back" onClick={onCancel}>
          取消
        </Button>,
      ];
    } else {
      tunedButt = [
        <Button
          key="submit"
          size="large"
          type="primary"
          onClick={save}
          loading={confirmLoading}
        >
          {okText}
        </Button>,
        <Button size="large" key="back" onClick={onCancel}>
          取消
        </Button>,
      ];
    }
    return tunedButt;
  }
  return (
    <Modal
      className={className}
      centered
      width={formWidth}
      visible={visible}
      title={cusTitle || (isEdit() ? '修改' : '新增') + title}
      okText={okText}
      onCancel={onCancel}
      onOk={save}
      maskClosable={false}
      footer={footer === null ? null : renderConfirmButt()}
    >
      {geneForm(fields)}
    </Modal>
  );
});
export default ModalForm;
