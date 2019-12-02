/* eslint-disable semi,no-undef */
import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';

const FormItem = Form.Item;

const createFormItem = opts => {
  const rules = [];
  if (opts.require) {
    rules.push({ required: true, message: `请输入${opts.label}` });
  }
  if (opts.max) {
    rules.push({
      max: opts.max,
      message: `${opts.label}必须小于${opts.max}个字符`,
    });
  }
  if (opts.min) {
    rules.push({
      min: opts.min,
      message: `${opts.label}必须大于${opts.min}个字符`,
    });
  }
  if (opts.pattern) {
    rules.push({ pattern: opts.pattern, message: opts.patternMsg });
  }
  return opts.getFieldDecorator(opts.name, {
    rules,
    initialValue: opts.value,
    validateFirst: opts.validateFirst,
  })(
    <Input
      prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />}
      type={opts.type}
      placeholder={opts.label}
      autoFocus={opts.autoFocus}
    />
  );
};

class LoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="login-logo-wrapper flex flex-c">
          <div className="login-logo">
            <img alt="" src="/logo.png" style={{ width: 120 }} />
          </div>
          <div className="login-logo-text">后台管理系统</div>
        </div>
        <FormItem>
          {createFormItem({
            getFieldDecorator,
            require: true,
            icon: 'user',
            type: 'text',
            label: '账号',
            name: 'phone',
            phone: true,
            autoFocus: true,
          })}
        </FormItem>
        <FormItem>
          {createFormItem({
            getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'password',
            label: '密码',
            name: 'password',
            max: 20,
            min: 5,
            pattern: /^[0-9a-zA-Z]*$/,
            patternMsg: '密码只能是数字或英文大小写',
            validateFirst: true,
          })}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={this.props.loading}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);
