import React, { Component } from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import ImagePicker from './ImagePicker';
import './style.scss';
import unit from '../decorators/unit';

class ImagePickerGroup extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    tokenSeparators: PropTypes.string,
    disabled: PropTypes.bool,
    action: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    getToken: PropTypes.func,
    getUrl: PropTypes.func,
    single: PropTypes.bool,
    data: PropTypes.object,
    mostPic: PropTypes.number,
    type: PropTypes.string,
    onPreview: PropTypes.func,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    headers: PropTypes.object,
    fullValue: PropTypes.bool,
    fieldNames: PropTypes.object,
    showName: PropTypes.bool,
  }

  static defaultProps = {
    tokenSeparators: undefined,
    disabled: false,
    width: 100,
    height: 100,
    getToken: undefined,
    getUrl: undefined,
    single: false,
    data: {},
    mostPic: 10000,
    type: '',
    onPreview: undefined,
    text: '',
    headers: undefined,
    fullValue: false,
    fieldNames: {
      url: 'url',
      name: 'name',
    },
    showName: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      items: props.value || [],
    };
    this.fullValue = this.formatValues(this.state.items);
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({
        items: value || [],
        disabled: nextProps.disabled,
      });
    }
  }

  onChange(value, fullValue) {
    const {
      tokenSeparators,
    } = this.props;
    let items = this.state.items;
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators);
    }
    items = [
      ...items,
    ];
    items[value.key] = value.value;
    this.fullValue[value.key] = fullValue;
    this.props.onChange(this.parseValues(items));
    this.props.afterChange && this.props.afterChange(this.fullValue);
  }

  onClose(seq) {
    const {
      tokenSeparators,
    } = this.props;
    let items = this.state.items;
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators);
    }
    items = [
      ...items,
    ];

    items.splice(seq, 1);

    this.setState({
      ...this.state,
      items,
    });

    this.fullValue.splice(seq, 1);
    this.props.onChange(this.parseValues(items));
    this.props.afterChange && this.props.afterChange(this.fullValue);
  }

  formatValues(items) {
    let newItems = items;
    const {
      tokenSeparators,
    } = this.props;
    if (tokenSeparators && newItems.length !== 0) {
      newItems = newItems.toString().split(tokenSeparators);
    } else if (typeof items === 'string') {
      newItems = [items];
    }
    return newItems;
  }

  parseValues(items) {
    let newItems = items;
    const {
      tokenSeparators,
      fullValue,
    } = this.props;
    if (fullValue) {
      return this.fullValue;
    }
    if (tokenSeparators) {
      newItems = newItems.join(tokenSeparators);
    }
    return newItems;
  }

  add() {
    const defaultValue = {
      value: '',
    };
    const items = [
      ...this.state.items,
      defaultValue,
    ];
    this.setState({
      ...this.state,
      items,
    });
    this.props.onChange(this.parseValues(items));
  }

  render() {
    const {
      tokenSeparators,
      action,
      width,
      height,
      disabled,
      getToken,
      getUrl,
      single,
      data,
      type,
      onPreview,
      text,
      headers,
      fullValue,
      fieldNames,
      showName,
      extras = [],
    } = this.props;

    let {
      mostPic,
    } = this.props;

    const createItems = () => {
      let items = this.state.items;
      items = this.formatValues(items);
      const res = items.map((item, index) => (
        <Col className="imagepicker-item-wrapper" key={`upload${(index || '').toString()}`}>
          <ImagePicker
            value={item}
            sequence={index}
            disabled={disabled}
            onChange={this.onChange.bind(this)}
            onClose={this.onClose.bind(this)}
            closeable
            action={action}
            width={width}
            mostPic={mostPic}
            height={height}
            getToken={getToken}
            getUrl={getUrl}
            data={data}
            type={type}
            onPreview={onPreview ? (value, name = '') => {
              onPreview(value, index, name);
            } : undefined}
            text={text}
            headers={headers}
            fullValue={fullValue}
            fieldNames={fieldNames}
            showName={showName}
            extra={extras[index]}
          />
        </Col>
      ));
      // blank placeholder
      if (single) {
        mostPic = 1;
      }
      if (items.length === 0 || (!(items.length > mostPic - 1) && !disabled)) {
        res.push((
          <Col
            className="imagepicker-item-wrapper"
            key={`upload${(items.length || '').toString()}`}
          >
            <ImagePicker
              value={undefined}
              sequence={items.length}
              disabled={disabled}
              onChange={this.onChange.bind(this)}
              onClose={this.onClose.bind(this)}
              closeable={false}
              tokenSeparators={tokenSeparators}
              action={action}
              width={width}
              height={height}
              getToken={getToken}
              getUrl={getUrl}
              data={data}
              type={type}
              text={text}
              headers={headers}
              fullValue={fullValue}
              fieldNames={fieldNames}
              showName={showName}
            />
          </Col>
        ));
      }
      return res;
    };

    return (
      <div value={this.state.item} className="imagepicker-container">
        {createItems()}
        {this.renderUnit({ position: 'inherit', display: 'flex', alignItems: 'center' })}
      </div>
    );
  }
}

export default unit(ImagePickerGroup);
