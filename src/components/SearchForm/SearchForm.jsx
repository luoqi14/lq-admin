/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import createFormItem from '../createFormItem';
import mapPropsToFields from '../mapPropsToFields';
import onFieldsChange from '../onFieldsChange';
import './style.scss';
import respond from '../decorators/Responsive';
import minimize from '../decorators/minimize';

const FormItem = Form.Item;

class AdvancedSearchForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    reset: PropTypes.func,
    changeRecord: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    validateDisabled: PropTypes.bool,
    sorter: PropTypes.object,
    buttonStyle: PropTypes.object,
    hideReset: PropTypes.bool,
    buttonSpan: PropTypes.number,
    searchText: PropTypes.string,
  };

  static defaultProps = {
    validateDisabled: false,
    sorter: {},
    buttonStyle: { clear: 'both' },
    hideReset: false,
    buttonSpan: 6,
    searchText: '搜索',
  };

  componentDidMount() {
    this.props.validateDisabled && this.props.form.validateFieldsAndScroll();
  }

  getValues(callback) {
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        callback();
      }
    });
  }

  setDisabled(fieldsError) {
    return this.props.validateDisabled && Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  handleSearch = () => {
    this.getValues(() => {
      const limit = (this.props.page && this.props.page.limit) || 20;
      const searchParams = this.props.values;
      this.props.search({
        ...searchParams,
        offset: 0,
        limit,
        columnKey: this.props.sorter.columnKey,
        order: this.props.sorter.order,
      });
    });
  };

  handleReset = () => {
    (this.props.reset && this.props.reset()) || this.props.changeRecord({});
  };

  render() {
    const {
      fields,
      style,
      expand,
      validateDisabled,
      form,
      values,
      children,
      buttonStyle,
      hideReset,
      buttonSpan,
      searchText,
    } = this.props;

    const { getFieldsError } = form;

    // To generate mock Form.Item
    const formItems = [];
    const len = fields.length;
    const labelCol = expand ? 6 : 4;
    const wrapperCol = expand ? 18 : 20;
    for (let i = 0; i < len; i += 1) {
      formItems.push(createFormItem({
        field: fields[i],
        form,
        validateDisabled,
        formItemLayout: {
          labelCol: { span: fields[i].large ? 2 : fields[i].labelCol || labelCol },
          wrapperCol: { span: fields[i].large ? 22 : fields[i].wrapperCol || wrapperCol },
        },
        colSpan: !expand || fields[i].large ? 24 : (fields[i].col || 8),
        values,
      }));
    }

    return (
      <Form
        className="ant-advanced-search-form"
        style={style}
        key="search-from"
      >
        <Row gutter={20}>
          {formItems}
          {
            expand && (
              <Col
                span={buttonSpan} 
                className="search-button-col" 
                style={{ ...buttonStyle, textAlign: 'left', whiteSpace: 'nowrap' }}
              >
                <FormItem
                  className="btn-container"
                  wrapperCol={{ span: 24, offset: buttonStyle.clear === 'both' ? 8 : 0 }}
                >
                  <Button
                    type="primary"
                    onClick={this.handleSearch}
                    className="search-button"
                    disabled={this.setDisabled(getFieldsError())}
                  >
                    { searchText }
                  </Button>
                  {
                    !hideReset &&
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.handleReset}
                    >
                      重置
                    </Button>
                  }
                </FormItem>
              </Col>
            )
          }
          {
            !expand && (
              <div>
                <Col span={24}>
                  <FormItem className="btn-container">
                    <Button
                      type="primary"
                      onClick={this.handleSearch}
                      style={{ width: '100%' }}
                      disabled={this.setDisabled(getFieldsError())}
                    >
                      搜索
                    </Button>
                  </FormItem>
                </Col>
                {
                  !hideReset && (
                    <Col span={24}>
                      <FormItem>
                        <Button style={{ width: '100%' }} onClick={this.handleReset}>
                          重置
                        </Button>
                      </FormItem>
                    </Col>
                  )
                }
              </div>
            )
          }
        </Row>
        { children }
      </Form>
    );
  }
}

const SearchForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})(AdvancedSearchForm);

export default minimize(respond(SearchForm));
