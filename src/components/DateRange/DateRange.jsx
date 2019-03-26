import React, { Component } from 'react';
import { DatePicker, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import Radio from '../Radio';
import './style.scss';

export default class DateRange extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    format: PropTypes.string,
    showTime: PropTypes.object,
    maxInterval: PropTypes.number,
    placeholder: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]),
    shortcuts: PropTypes.array,
  };

  static defaultProps = {
    disabled: false,
    format: 'YYYY-MM-DD',
    showTime: undefined,
    placeholder: [],
    shortcuts: [],
  };

  constructor(props) {
    super(props);
    let value = [];
    if ('value' in props) {
      value = props.value || [];
      if (value && typeof value[0] !== 'object' && value[0]) {
        value[0] = moment(value[0]);
      }
      if (value && typeof value[1] !== 'object' && value[1]) {
        value[1] = moment(value[1]);
      }
    }
    this.state = {
      value,
      endOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || [];
      if (typeof value[0] !== 'object' && value[0]) {
        value[0] = moment(value[0]);
      }
      if (typeof value[1] !== 'object' && value[1]) {
        value[1] = moment(value[1]);
      }
      this.setState({
        ...this.state,
        value,
      });
    }
  }

  onStartChange = (value) => {
    let values = [];
    if (value || this.state.value[1]) {
      values = [value, this.state.value[1]];
    }
    this.props.onChange(values);
    setTimeout(() => { // render again
      this.setState({
        radioValue: undefined,
      });
    }, 1);
  };

  onRadioChange = (value) => {
    const val = this.shortcutMap[this.props.shortcuts[value]].value;
    this.setState({
      radioValue: value,
      value: val,
    });
    setTimeout(() => {
      this.props.onChange(val); // invoke onFieldsChange
    }, 1);
  };

  onEndChange = (value) => {
    let values = [];
    if (value || this.state.value[0]) {
      values = [this.state.value[0], value];
    }
    this.props.onChange(values);
    setTimeout(() => {
      this.setState({
        radioValue: undefined,
      });
    }, 1);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      setTimeout(() => {
        this.setState({ endOpen: true });
      });
    }
  };

  handleEndOpenChange = (open) => {
    setTimeout(() => {
      this.setState({ endOpen: open });
    }, 1);
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.value[1];
    if (!startValue || !endValue) {
      return false;
    }
    let res = startValue.valueOf() > endValue.valueOf();
    if (this.props.maxInterval && !res) {
      res = startValue.valueOf() < (endValue.valueOf() - this.props.maxInterval);
    }
    return res;
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.value[0];
    if (!endValue || !startValue) {
      return false;
    }
    let res = endValue.valueOf() <= startValue.valueOf();
    if (this.props.maxInterval && !res) {
      res = endValue.valueOf() >= (startValue.valueOf() + this.props.maxInterval);
    }
    return res;
  };

  shortcutMap = {
    today: {
      label: '今日',
      value: [moment({ hour: 0, minute: 0, seconds: 0 }), moment({ hour: 23, minute: 59, seconds: 59 })],
    },
    yesterday: {
      label: '昨日',
      value: [moment({ hour: 0, minute: 0, seconds: 0 }).subtract(1, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }).subtract(1, 'days')],
    },
    thisWeek: {
      label: '本周',
      value: [moment({ hour: 0, minute: 0, seconds: 0 }).subtract(moment().format('E') - 1, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }).subtract(moment().format('E') - 7, 'days')],
    },
    thisMonth: {
      label: '本月',
      value: [moment({
        date:1, hour: 0, minute: 0, seconds: 0, 
      }),
      moment({ hour: 23, minute: 59, seconds: 59 }).endOf('month')],
    },
  };

  render() {
    const { value = [], endOpen, radioValue } = this.state;
    const {
      disabled, format, showTime, placeholder, shortcuts, 
    } = this.props;
    const radioData = {};
    shortcuts.forEach((keyword, index) => {
      radioData[index] = this.shortcutMap[keyword].label;
    });
    return (
      <Row span={24} className="date-range-container">
        {
          disabled &&
          <div className="fe-blank-holder">
            <span>{value[0] ? value[0].format(format) : '-'}
            </span> ~ <span>{value[1] ? value[1].format(format) : '-'}</span>
          </div>
        }
        {
          !disabled &&
          (
            <div className="flex fe-daterange-inner">
              <div className="daterange-datepicker">
                <Col span={11}>
                  <DatePicker
                    disabledDate={this.disabledStartDate.bind(this)}
                    format={format}
                    showTime={showTime}
                    value={value[0]}
                    placeholder={placeholder[0]}
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <span> ~ </span>
                </Col>
                <Col span={11}>
                  <DatePicker
                    disabledDate={this.disabledEndDate.bind(this)}
                    format={format}
                    showTime={showTime}
                    value={value[1]}
                    placeholder={placeholder[1]}
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                </Col>
              </div>
              {
                shortcuts.length > 0 && (
                  <Radio
                    className="daterange-shortcut"
                    style={{ marginLeft: 8 }}
                    data={radioData}
                    styleType="button"
                    onChange={(v) => {
                      this.onRadioChange(v);
                    }}
                    value={radioValue}
                  />
                )
              }
            </div>
          )
        }

      </Row>
    );
  }
}
