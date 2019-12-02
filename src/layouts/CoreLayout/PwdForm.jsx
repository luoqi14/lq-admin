import React, { Component } from 'react';
import { Icon, Modal, Button, Row, Form } from 'antd';
import { connect } from 'react-redux';
import createFormItem from '../../components/createFormItem';
import '../../styles/core.scss';
import './CoreLayout.scss';
import { common } from '../../store/common';

class PwdForm extends Component {
  componentDidMount() {
    this.props.initCommon();
  }

  onCancel() {
    this.props.hideEditPwd();
    this.props.form.resetFields();
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.savePwd(values).then(res => {
          if (res.success) {
            this.props.form.resetFields();
            // const user = JSON.parse(localStorage.getItem('user'));
            // user.firstLogin = false;
            // localStorage.setItem('user', JSON.stringify(user));
          }
        });
      }
    });
  }

  render() {
    const { form, savePwdLoading } = this.props;

    const user = JSON.parse(localStorage.getItem('user'));
    const firstLogin = user && user.firstLogin;

    const fields = [
      {
        type: 'title',
        label: (
          <span>
            <Icon type="exclamation-circle-o" />
            为了你的账号安全，请修改密码
          </span>
        ),
        className: 'warning',
        hidden: !firstLogin,
      },
      {
        label: '原密码',
        name: 'oldPwd',
        type: 'password',
        required: true,
        min: 5,
        max: 20,
      },
      {
        label: '新密码',
        name: 'newPwd',
        type: 'password',
        required: true,
        min: 5,
        max: 20,
        pattern: /^[0-9a-zA-Z]*$/,
        patternMsg: '密码只能是数字或英文大小写',
        validator: (rule, value, callback) => {
          if (value && form.getFieldValue('pwdConfirm')) {
            form.validateFields(['pwdConfirm'], { force: true });
          }
          callback();
        },
      },
      {
        label: '新密码确认',
        name: 'pwdConfirm',
        type: 'password',
        required: true,
        min: 5,
        max: 20,
        validator: (rule, value, cbk) => {
          if (value && value !== form.getFieldValue('newPwd')) {
            cbk('两次密码输入不一致');
          } else {
            cbk();
          }
        },
      },
    ];

    const footer = [
      <Button
        size="large"
        key="submit"
        type="primary"
        onClick={this.save.bind(this)}
        loading={savePwdLoading}
      >
        保存
      </Button>,
    ];

    !firstLogin &&
      footer.push(
        <Button size="large" key="back" onClick={this.onCancel.bind(this)}>
          取消
        </Button>
      );

    return (
      <Modal
        visible={this.props.editPwdVisible}
        okText="保存"
        title="修改密码"
        closable={!firstLogin}
        onCancel={firstLogin ? null : this.onCancel.bind(this)}
        onOk={this.save}
        footer={footer}
        maskClosable={false}
      >
        <Form layout="horizontal">
          <Row>
            {fields.map(item =>
              createFormItem({
                field: item,
                form,
                formItemLayout: {
                  labelCol: {
                    span: 6,
                  },
                  wrapperCol: {
                    span: 16,
                  },
                },
              })
            )}
          </Row>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  editPwdVisible: state.common.editPwdVisible,
  savePwdLoading: state.common.savePwdLoading,
});

const mapDispatchToProps = {
  showEditPwd: common.showEditPwd,
  hideEditPwd: common.hideEditPwd,
  savePwd: common.savePwd,
  initCommon: common.initCommon,
};

export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PwdForm)
);
