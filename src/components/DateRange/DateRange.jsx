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
    placeholder: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    shortcuts: PropTypes.array,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
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
    let radioValue = -1;
    if ('value' in props) {
      value = props.value || [];
      if (value && typeof value[0] !== 'object' && value[0]) {
        value[0] = moment(value[0]);
      }
      if (value && typeof value[1] !== 'object' && value[1]) {
        value[1] = moment(value[1]);
      }
      radioValue = this.findShortcutsIndex(value);
    }
    this.hours = [];
    this.minutes = [];
    for (let i = 0; i < 24; i += 1) {
      this.hours.push(i);
    }
    for (let i = 0; i < 60; i += 1) {
      this.minutes.push(i);
    }
    this.state = {
      value,
      endOpen: false,
      radioValue,
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
        radioValue: this.findShortcutsIndex(value),
      });
    }
  }

  onStartChange = value => {
    let values = [];
    if (value || this.state.value[1]) {
      values = [value, this.state.value[1]];
    }
    this.props.onChange(values);
    setTimeout(() => {
      // render again
      this.setState({
        radioValue: this.findShortcutsIndex(values),
      });
    }, 1);
  };

  onRadioChange = value => {
    const val = this.shortcutMap[this.props.shortcuts[value]].value;
    this.setState({
      radioValue: value,
      value: val,
    });
    setTimeout(() => {
      this.props.onChange(val); // invoke onFieldsChange
    }, 1);
  };

  onEndChange = value => {
    let values = [];
    if (value || this.state.value[0]) {
      values = [this.state.value[0], value];
    }
    this.props.onChange(values);
    setTimeout(() => {
      this.setState({
        radioValue: this.findShortcutsIndex(values),
      });
    }, 1);
  };

  findShortcutsIndex = values => {
    if (this.props.shortcuts.length > 0) {
      const keys = Object.keys(this.shortcutMap);
      const shortcut = keys.find(k => {
        const v = this.shortcutMap[k].value;
        if (v[0].diff(values[0]) === 0 && v[1].diff(values[1]) === 0) {
          return true;
        }
        return false;
      });
      return this.props.shortcuts.indexOf(shortcut);
    }
    return -1;
  };

  handleStartOpenChange = open => {
    if (!open) {
      setTimeout(() => {
        this.setState({ endOpen: true });
      });
    }
  };

  handleEndOpenChange = open => {
    setTimeout(() => {
      this.setState({ endOpen: open });
    }, 1);
  };

  disableTime = value => {
    let startHour = 0;
    let startMinute = 0;
    let startSecond = 0;
    let endHour = 24;
    let endMinute = 60;
    let endSecond = 60;
    let startDate;
    let endDate;
    if (value[0]) {
      startDate = value[0].format('YYYY-MM-DD');
      const startTime = value[0].format('HH:mm:ss');
      startHour = +startTime.slice(0, 2);
      startMinute = +startTime.slice(3, 5);
      startSecond = +startTime.slice(6, 8);
    }
    if (value[1]) {
      endDate = value[1].format('YYYY-MM-DD');
      const endTime = value[1].format('HH:mm:ss');
      endHour = +endTime.slice(0, 2);
      endMinute = +endTime.slice(3, 5);
      endSecond = +endTime.slice(6, 8);
    }
    const res = { start: [], end: [] };
    if (startDate === endDate) {
      res.end[0] = this.hours.slice(0, startHour);
      res.start[0] = this.hours.slice(endHour + 1);
      if (startHour < endHour && value[0] && value[1]) {
        res.start[1] = [];
        res.end[1] = [];
      } else if (startHour === endHour && value[0] && value[1]) {
        res.end[1] = this.minutes.slice(0, startMinute);
        res.start[1] = this.minutes.slice(endMinute + 1);
      }
      if (
        startHour === endHour &&
        startMinute === endMinute &&
        value[0] &&
        value[1]
      ) {
        res.end[2] = this.minutes.slice(0, startSecond);
        res.start[2] = this.minutes.slice(endSecond + 1);
      } else {
        res.start[2] = [];
        res.end[2] = [];
      }
    } else {
      res.end[0] = [];
      res.start[0] = [];
      res.end[1] = [];
      res.start[1] = [];
      res.end[2] = [];
      res.start[2] = [];
    }

    return res;
  };

  disabledStartDate = startValue => {
    const minDate = this.props.minDate;
    const maxDate = this.props.maxDate;
    const endValue = this.state.value[1];
    if (!startValue || !endValue) {
      let res = false;
      if (minDate) {
        res = res || startValue < minDate;
      }
      if (maxDate) {
        res = res || startValue > maxDate;
      }
      return res;
    }
    let res = startValue.valueOf() > endValue.valueOf();
    if (minDate) {
      res = res || startValue < minDate;
    }
    if (maxDate) {
      res = res || startValue > maxDate;
    }
    if (this.props.maxInterval && !res) {
      res = startValue.valueOf() < endValue.valueOf() - this.props.maxInterval;
    }
    return res;
  };

  disabledEndDate = endValue => {
    const minDate = this.props.minDate;
    const maxDate = this.props.maxDate;
    const startValue = this.state.value[0];
    if (!endValue || !startValue) {
      let res = false;
      if (minDate) {
        res = res || endValue < minDate;
      }
      if (maxDate) {
        res = res || endValue > maxDate;
      }
      return res;
    }
    let res = endValue.valueOf() <= startValue.valueOf();
    if (minDate) {
      res = res || endValue < minDate;
    }
    if (maxDate) {
      res = res || endValue > maxDate;
    }
    if (this.props.maxInterval && !res) {
      res =
        endValue.valueOf() >=
        Math.max(startValue.valueOf(), (minDate || 0).valueOf()) +
          this.props.maxInterval;
    }
    return res;
  };

  disabledStartTime = startValue => {
    const value = [startValue, this.state.value[1]];
    const disableTimes = this.disableTime(value);
    return {
      disabledHours: () => disableTimes.start[0],
      disabledMinutes: () => disableTimes.start[1],
      disabledSeconds: () => disableTimes.start[2],
    };
  };

  disabledEndTime = endValue => {
    const value = [this.state.value[0], endValue];
    const disableTimes = this.disableTime(value);
    return {
      disabledHours: () => disableTimes.end[0],
      disabledMinutes: () => disableTimes.end[1],
      disabledSeconds: () => disableTimes.end[2],
    };
  };

  shortcutMap = {
    today: {
      label: '今日',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }),
        moment({ hour: 23, minute: 59, seconds: 59 }),
      ],
    },
    yesterday: {
      label: '昨日',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }).subtract(1, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }).subtract(1, 'days'),
      ],
    },
    tomorrow: {
      label: '明日',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }).add(1, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }).add(1, 'days'),
      ],
    },
    thisWeek: {
      label: '本周',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }).subtract(
          moment().format('E') - 1,
          'days'
        ),
        moment({ hour: 23, minute: 59, seconds: 59 }).subtract(
          moment().format('E') - 7,
          'days'
        ),
      ],
    },
    thisMonth: {
      label: '本月',
      value: [
        moment({
          date: 1,
          hour: 0,
          minute: 0,
          seconds: 0,
        }),
        moment({ hour: 23, minute: 59, seconds: 59 }).endOf('month'),
      ],
    },
    latest7: {
      label: '最近7天',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }).subtract(7, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }),
      ],
    },
    future7: {
      label: '往后7天',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }),
        moment({ hour: 23, minute: 59, seconds: 59 }).add(7 - 1, 'days'),
      ],
    },
    latest30: {
      label: '最近30天',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }).subtract(30, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }),
      ],
    },
    latest90: {
      label: '最近90天',
      value: [
        moment({ hour: 0, minute: 0, seconds: 0 }).subtract(90, 'days'),
        moment({ hour: 23, minute: 59, seconds: 59 }),
      ],
    },
  };

  render() {
    const { value = [], endOpen, radioValue } = this.state;
    const {
      disabled,
      format,
      showTime,
      defaultShowTime = [],
      placeholder,
      shortcuts,
    } = this.props;
    const radioData = {};
    shortcuts.forEach((keyword, index) => {
      radioData[index] = this.shortcutMap[keyword].label;
    });
    return (
      <Row span={24} className="date-range-container">
        {disabled && (
          <div className="fe-blank-holder">
            <span>{value[0] ? value[0].format(format) : '-'}</span> ~{' '}
            <span>{value[1] ? value[1].format(format) : '-'}</span>
          </div>
        )}
        {!disabled && (
          <div className="flex fe-daterange-inner">
            <div className="daterange-datepicker">
              <Col span={11}>
                <DatePicker
                  disabledDate={this.disabledStartDate.bind(this)}
                  disabledTime={this.disabledStartTime}
                  format={format}
                  showTime={
                    showTime
                      ? {
                          defaultValue:
                            defaultShowTime[0] ||
                            moment('00:00:00', 'HH:mm:ss'),
                        }
                      : false
                  }
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
                  disabledTime={this.disabledEndTime}
                  format={format}
                  showTime={
                    showTime
                      ? {
                          defaultValue:
                            defaultShowTime[1] ||
                            moment('23:59:59', 'HH:mm:ss'),
                        }
                      : false
                  }
                  value={value[1]}
                  placeholder={placeholder[1]}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
              </Col>
            </div>
            {shortcuts.length > 0 && (
              <Radio
                className="daterange-shortcut"
                style={{ marginLeft: 8 }}
                data={radioData}
                styleType="button"
                onChange={v => {
                  this.onRadioChange(v);
                }}
                value={radioValue}
              />
            )}
          </div>
        )}
      </Row>
    );
  }
}
