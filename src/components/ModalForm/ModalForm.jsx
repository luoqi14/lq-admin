import React from 'react';
import {
  Form,
  Input,
  Modal,
  Row,
  Button,
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import createFormItem from '../createFormItem';
import mapPropsToFields from '../mapPropsToFields';
import onFieldsChange from '../onFieldsChange';

const FormItem = Form.Item;

const ModalForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})((props) => {
  const {
    visible,
    onCancel,
    onCreate,
    title,
    fields,
    form,
    formWidth = 750,
    cusTitle,
    children,
    validateDisabled,
    buttons = [],
    okText = '保存',
    formClassName = 'modal-form',
    confirmLoading, 
  } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const save = () => {
    validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        onCreate(values);
      }
    });
  };

  const isEdit = () => !!(props.values && props.values.id);

  const geneForm = (flds) => (
    <Scrollbars
      autoHeight
      autoHeightMax={550}
    >
      <Form layout="horizontal" className={formClassName}>
        <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            })(<Input type="hidden" />)}
        </FormItem>
        <Row>
          {
              flds.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  formItemLayout,
                  validateDisabled,
                  inputOpts: {
                  },
                })
              ))
            }
        </Row>
        {
            children && children
          }
      </Form>
    </Scrollbars>
  );

  const butt = buttons.map((item) => (!item.hidden) &&
  <Button
    style={item.style}
    key={`button${item.label}`}
    type={item.type || 'primary'}
    onClick={(item.handleForm || item.onClick).bind(this, form)}
    disabled={item.disabled}
    loading={item.loading}
  >
    { item.label }
  </Button>);

  return (
    <Modal
      centered
      width={formWidth}
      visible={visible}
      title={cusTitle || ((isEdit() ? '修改' : '新增') + title)}
      okText={okText}
      onCancel={onCancel}
      onOk={save}
      maskClosable={false}
      footer={butt.length > 0 ? butt : [
        <Button key="submit" size="large" type="primary" onClick={save} loading={confirmLoading}>
          {okText}
        </Button>,
        <Button size="large" key="back" onClick={onCancel}>取消</Button>,
        ]}
    >
      {geneForm(fields)}
    </Modal>
  );
});
export default ModalForm;
