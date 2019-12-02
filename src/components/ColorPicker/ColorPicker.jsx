import React, { Component } from 'react';
import { Icon } from 'antd';
import { SketchPicker, CirclePicker } from 'react-color';
import './style.scss';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      right: false,
    };
    this.containerRef = React.createRef();
    // if (!props.value) {
    //   this.props.onChange('#2cad35');
    // }
  }

  onChange = color => {
    this.props.onChange(color.hex);
  };

  displayPicker = () => {
    const box = this.containerRef.current.getBoundingClientRect();
    if (document.documentElement.clientWidth - box.x < 220) {
      this.setState({ right: true });
    } else {
      this.setState({ right: false });
    }
    this.setState({ display: !this.state.display });
  };

  closePicker = () => {
    this.setState({
      display: false,
    });
  };

  render() {
    // isCircle 区分组件类型
    // colors 仅在isCircle 为true 时传，为默认颜色选择数组。选填
    const { value, isCircle, colors, placeholder } = this.props;
    return (
      <div
        ref={this.containerRef}
        title={placeholder}
        className="color-picker-container"
        style={isCircle && { minHeight: '190px' }}
      >
        <div
          role="button"
          tabIndex={-1}
          className="color-picker-swatch"
          onClick={this.displayPicker}
        >
          <div
            className="color-picker-swatch-inner flex flex-c"
            style={{ background: value }}
          >
            {!value && <Icon type="bg-colors" />}
          </div>
        </div>
        {this.state.display ? (
          <div
            className="color-picker-popover"
            style={{
              right: this.state.right ? '-30px' : '',
            }}
          >
            <div
              role="button"
              tabIndex={-1}
              className="color-picker-cover"
              onClick={this.closePicker}
            />
            {isCircle ? (
              <CirclePicker colors={colors} onChange={this.onChange} />
            ) : (
              <SketchPicker
                presetColors={colors}
                color={value || ''}
                onChange={this.onChange}
              />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorPicker;
