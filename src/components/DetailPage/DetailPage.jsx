import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, Spin, Breadcrumb, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import createFormItem from '../createFormItem';
import mapPropsToFields from '../mapPropsToFields';
import onFieldsChange from '../onFieldsChange';
import './style.scss';

const LinkWrapper = (props) => {
  const Com = props.to ? Link : 'a';
  return (
    <Com {...props}>
      {props.children}
    </Com>
  );
};

const FormItem = Form.Item;

class DetailPage extends Component {
  static propTypes = {
    validateDisabled: PropTypes.bool,
    rowKey: PropTypes.string,
    breadcrumb: PropTypes.array,
  }

  static defaultProps = {
    validateDisabled: false,
    rowKey: 'id',
    breadcrumb: [],
  };

  constructor(props) {
    super(props);
    this.props.persistForm && this.props.persistForm(this.props.form);
  }

  createButtons = (buttons) => buttons.map((item) => {
    let btnHtml = (
      <Button
        style={item.style}
        key={`button${item.label}`}
        type={item.type || 'primary'}
        onClick={item.confirm ? undefined : (item.handleForm || item.onClick).bind(this, this.props.form)}
        disabled={item.disabled}
        loading={item.loading}
        icon={item.icon}
        size={item.size}
      >
        {
          item.iconType ? 
            <Icon type={item.iconType} />
            : <span />
        }
        { item.label }
      </Button>
    );

    if (item.confirm) {
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

    return (!item.hidden) && btnHtml;
  });

  render() {
    const {
      title,
      fields = [],
      form,
      loading = false,
      buttons = [],
      preChildren = [],
      children = [],
      validateDisabled,
      rowKey,
      breadcrumb,
      breadcrumbSeparator = '/',
      layout = 'horizontal',
      formItemLayout = (layout === 'inline') ? null : {
        labelCol: { span: 4 },
        wrapperCol: { span: 7 },
      },
      topTitle,
      topButtons = [],
      buttonAlign = 'center',
      style = {},
      noId = true,
      className = '',
    } = this.props;

    const butt = this.createButtons(buttons);

    const { getFieldDecorator } = form;

    const geneForm = (flds) => (
      <Spin spinning={loading}>
        {
          (topTitle || topButtons.length > 0) && (
            <Row
              type="flex"
              justify="space-between"
              align="top"
              className="detailpage-header-container"
            >
              <Col className="detailpage-header-title">{topTitle}</Col>
              <Col className="detailpage-header-buttons-container">
                {this.createButtons(topButtons)}
              </Col>
            </Row>
          )
        }
        <Form layout={layout}>
          {
            !noId && (
              <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
                {getFieldDecorator(rowKey, {
                })((
                  <Input type="hidden" />
                ))}
              </FormItem>
            )
          }
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
          <Row>
            <Col offset={buttonAlign === 'left' && layout !== 'inline' ? formItemLayout.labelCol.span : 0}>
              <FormItem
                className="detailpage-footer-button-container"
                style={{ textAlign: buttonAlign }}
              >
                { butt }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
    return (
      <div className={`${className} fe-detailpage`} style={style}>
        <div className="layout-detail-wrapper">
          {
            breadcrumb.length > 0 && (
              <Row type="flex" justify="space-between" align="middle" className="detailpage-breadcrumb-container">
                <Col>
                  <Breadcrumb separator={breadcrumbSeparator}>
                    {
                      breadcrumb.map((item) => (
                        <Breadcrumb.Item key={item.id}>
                          {!item.href && item.name}
                          {item.href && (<LinkWrapper to={item.href}>{item.name}</LinkWrapper>)}
                        </Breadcrumb.Item>
                      ))
                    }
                  </Breadcrumb>
                </Col>
              </Row>
            )
          }
          <div className="layout-content-detail">
            {
              title &&
              <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                  <h2 className="ant-page-title">
                    {title}
                  </h2>
                </Col>
              </Row>
            }
            {
              preChildren
            }
            {geneForm(fields)}
            {
              children
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields,
  onFieldsChange,
})(DetailPage);
