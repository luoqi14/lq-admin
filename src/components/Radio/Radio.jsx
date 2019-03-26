import React, { Component } from 'react';
import { Radio as AntdRadio } from 'antd';
import PropTypes from 'prop-types';

export default class Radio extends Component {
  static propTypes = {
    data: PropTypes.object,
    styleType: PropTypes.string,
  };

  static defaultProps = {
    data: {},
    styleType: undefined,
  };

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const {
      data, disabled, value, styleType, className, style = {}, 
    } = this.props;
    const Type = styleType === 'button' ? AntdRadio.Button : AntdRadio;
    return (
      <div style={style} className={className}>
        {
          disabled && !value && <span className="fe-blank-holder">-</span>
        }
        {
          disabled && value && <span className="fe-readonly">{data[value]}</span>
        }
        {
          !disabled &&
          <AntdRadio.Group
            onChange={this.onChange.bind(this)}
            value={`${value}`}
          >
            {
              Object.keys(data).map((key) => <Type value={key} key={key}>{data[key]}</Type>)
            }

          </AntdRadio.Group>
        }
      </div>
    );
  }
}
