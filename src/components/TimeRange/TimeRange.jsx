import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import createFormItem from '../createFormItem';

export default class TimeRange extends Component {
  constructor(props) {
    super(props);
    setTimeout(() => {
      this.props.onChange([props.form.getFieldValue(props.names[0]), props.form.getFieldValue(props.names[1])]);
    }, 0);
    this.hours = [];
    this.minutes = [];
    for (let i = 0; i < 24; i += 1) {
      this.hours.push(i);
    }
    for (let i = 0; i < 60; i += 1) {
      this.minutes.push(i);
    }
  }

  onStartChange(value) {
    setTimeout(() => {
      this.props.onChange([value, this.props.value[1]]);
    }, 0);
  }

  onEndChange(value) {
    setTimeout(() => {
      this.props.onChange([this.props.value[0], value]);
    }, 0);
  }

  getDefaultValue = (value) => {
    const res = [moment(), moment()];
    if (value[0]) {
      res[1] = moment(value[0], 'HH:mm:ss');
    }
    if (value[1]) {
      res[0] = moment(value[1], 'HH:mm:ss');
    }
    return res;
  };

  disable = (value) => {
    let startHour = 0;
    let startMinute = 0;
    let startSecond = 0;
    let endHour = 24;
    let endMinute = 60;
    let endSecond = 60;
    if (value[0]) {
      startHour = +value[0].slice(0, 2);
      startMinute = +value[0].slice(3, 5);
      startSecond = +value[0].slice(6, 8);
    }
    if (value[1]) {
      endHour = +value[1].slice(0, 2);
      endMinute = +value[1].slice(3, 5);
      endSecond = +value[1].slice(6, 8);
    }
    const res = { start: [], end: [] };
    res.end[0] = this.hours.slice(0, startHour);
    res.start[0] = this.hours.slice(endHour + 1);
    if (startHour < endHour) {
      res.start[1] = [];
      res.end[1] = [];
    } else if (startHour === endHour) {
      res.end[1] = this.minutes.slice(0, startMinute);
      res.start[1] = this.minutes.slice(endMinute + 1);
    }
    if (startHour === endHour && startMinute === endMinute) {
      res.end[2] = this.minutes.slice(0, startSecond);
      res.start[2] = this.minutes.slice(endSecond + 1);
    } else {
      res.start[2] = [];
      res.end[2] = [];
    }
    return res;
  };

  render() {
    const {
      disabled, names, form, placeholder, value = [], 
    } = this.props;
    const disableValues = this.disable(value || []);
    const defaultValues = this.getDefaultValue(value || []);
    return (
      disabled ? (
        <div>
          <span>{value[0] ? value[0] : '-'}
          </span> ~ <span>{value[1] ? value[1] : '-'}</span>
        </div>
      ) : (
        <Row span={24} className="time-range-container">
          {
            (
              <div>
                <Col span={11}>
                  {createFormItem({
                    field: {
                      name: names[0],
                      type: 'time',
                      wrapperSpan: 24,
                      requiredMsg: placeholder[0],
                      defaultOpenValue: defaultValues[0],
                      onChange: (v) => { this.onStartChange(v); },
                      disabledHours: () => disableValues.start[0],
                      disabledMinutes: () => disableValues.start[1],
                      disabledSeconds: () => disableValues.start[2],
                      disabled,
                    },
                    form,
                  })}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <span> ~ </span>
                </Col>
                <Col span={11}>
                  {createFormItem({
                    field: {
                      name: names[1],
                      type: 'time',
                      wrapperSpan: 24,
                      requiredMsg: placeholder[1],
                      defaultOpenValue: defaultValues[1],
                      onChange: (v) => { this.onEndChange(v); },
                      disabledHours: () => disableValues.end[0],
                      disabledMinutes: () => disableValues.end[1],
                      disabledSeconds: () => disableValues.end[2],
                      disabled,
                    },
                    form,
                  })}
                </Col>
              </div>
            )
          }

        </Row>
      )

    );
  }
}
