import React, { Component } from 'react';
import { Icon, Radio as AntdRadio, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { shallowEqual } from '../../util';

export default class Radio extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    styleType: PropTypes.string,
    disabledKeys: PropTypes.array,
    valueName: PropTypes.string,
    displayName: PropTypes.string,
  };

  static defaultProps = {
    data: {},
    styleType: undefined,
    disabledKeys: [],
    valueName: 'id',
    displayName: 'label',
  };

  shouldComponentUpdate(nextProps, newState) {
    return (
      !shallowEqual(this.props, nextProps, ['data-__field', 'data-__meta']) ||
      !shallowEqual(this.state, newState)
    );
  }

  onChange(e) {
    this.props.onChange(this.changeBool(e.target.value));
  }

  changeBool = v => {
    if (v === 'true') {
      return true;
    } else if (v === 'false') {
      return false;
    }
    return v;
  };

  shapeRadioData = data => {
    const { valueName, displayName } = this.props;
    let res = {};
    if (Object.prototype.toString.call(data) === '[object Array]') {
      data.forEach(item => {
        res[item[valueName]] = item[displayName];
      });
    } else {
      res = data;
    }
    return res;
  };

  render() {
    const {
      data,
      disabled,
      value,
      styleType,
      className,
      style = {},
      disabledKeys,
      valueName,
      displayName,
    } = this.props;
    const Type = styleType === 'button' ? AntdRadio.Button : AntdRadio;
    const dict = this.shapeRadioData(data);
    return (
      <div style={style} className={className}>
        {disabled && !value && <span className="fe-blank-holder">-</span>}
        {disabled && value && (
          <span className="fe-readonly">{dict[value]}</span>
        )}
        {!disabled && (
          <AntdRadio.Group
            onChange={this.onChange.bind(this)}
            value={`${value}`}
          >
            {Object.prototype.toString.call(data) === '[object Array]' &&
              data.map(item => {
                return (
                  <Type
                    value={`${item[valueName]}`}
                    key={item[valueName]}
                    disabled={
                      disabledKeys.indexOf(item[valueName]) > -1 ||
                      item.disabled
                    }
                  >
                    {item[displayName]}
                    {item.help && (
                      <Tooltip title={item.help}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    )}
                  </Type>
                );
              })}
            {Object.prototype.toString.call(data) !== '[object Array]' &&
              Object.keys(data).map(key => (
                <Type
                  value={key}
                  key={key}
                  disabled={disabledKeys.indexOf(key) > -1}
                >
                  {data[key]}
                </Type>
              ))}
          </AntdRadio.Group>
        )}
      </div>
    );
  }
}
