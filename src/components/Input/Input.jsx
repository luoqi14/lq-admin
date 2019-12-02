import React, { Component } from 'react';
import { Input as AntdInput, Icon, AutoComplete } from 'antd';
import { Link } from 'react-router-dom';
import './style.scss';
import { isEmpty } from '../utils';
import { shallowEqual } from '../../util';
import unit from '../decorators/unit';

class Input extends Component {
  constructor(props) {
    super(props);
    let value = props.value;
    if (typeof value === 'number') {
      value = `${value}`;
    }
    this.state = { value: value || undefined };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value;
      if (typeof value === 'number') {
        value = `${value}`;
      }
      this.setState({ value: value || undefined });
    }
  }

  shouldComponentUpdate(nextProps, newState) {
    return (
      !shallowEqual(this.props, nextProps, ['data-__field', 'data-__meta']) ||
      !shallowEqual(this.state, newState)
    );
  }

  // handleChange(value) {
  //   this.props.onChange(value || undefined);
  // }
  //
  // emitEmpty = () => {
  //   this.handleChange(undefined);
  // };

  handleChange(value) {
    this.props.onChange(value);
  }

  emitEmpty = () => {
    this.handleChange('');
  };

  renderDisabled = () => {
    const { href, value, render } = this.props;
    let html = '';
    if (render) {
      html = render(value);
      html = isEmpty(html) ? <span className="fe-blank-holder">-</span> : html;
    } else {
      html = (
        <span>
          {isEmpty(value) ? <span className="fe-blank-holder">-</span> : value}
        </span>
      );
    }
    if (href && !isEmpty(value)) {
      html = <Link to={href}>{html}</Link>;
    }
    return html;
  };

  render() {
    const {
      addonBefore = '',
      addonAfter = '',
      inputWidth,
      allowClear,
      placeholder,
      disabled,
      readonly,
      id,
      antdAddonAfter,
      antdAddonBefore,
      icon,
      size,
      autoFocus,
      compRef,
      onBlur,
      onPressEnter,
      data,
    } = this.props;

    // const suffix =
    //   allowClear && value != '' ? (
    //     <Icon type="close-circle" onClick={this.emitEmpty} />
    //   ) : null;
    const style = {};
    let wrapperClass = '';

    if (inputWidth) {
      style.width = inputWidth;
    }

    if (addonBefore) {
      style.marginLeft = 4;
    }

    if (addonAfter) {
      style.marginRight = 4;
    }

    if (addonAfter || addonBefore) {
      wrapperClass = ' flex flex-c flex-fs';
    }

    const Inner = data ? AutoComplete : AntdInput;
    const extraProps = {};
    if (data) {
      extraProps.dataSource = data.map(d => d.label); // TODO
    }

    return (
      <div className={`input-container${wrapperClass}`}>
        <span>{addonBefore}</span>
        {disabled ? (
          this.renderDisabled()
        ) : (
          <Inner
            {...extraProps}
            allowClear={allowClear}
            ref={compRef}
            id={id}
            size={size}
            autoFocus={autoFocus}
            autoComplete="off"
            disabled={readonly}
            placeholder={placeholder}
            style={style}
            prefix={
              icon ? (
                <Icon type={icon} style={{ color: 'rgba(0,0,0,.25)' }} />
              ) : null
            }
            // suffix={readonly ? null : suffix}
            title={this.state.value}
            value={this.state.value}
            onChange={e => {
              this.handleChange(data ? e : e.target.value);
            }}
            addonAfter={antdAddonAfter}
            addonBefore={antdAddonBefore}
            onBlur={onBlur}
            onPressEnter={onPressEnter}
          />
        )}
        <span>{addonAfter}</span>
        {this.renderUnit()}
      </div>
    );
  }
}

export default unit(Input);
