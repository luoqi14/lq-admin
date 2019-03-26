import React, { Component } from 'react';

const unit = (Cmp) => {
  class UnitDecorator extends Component {
    constructor(props) {
      super(props);
      const NewCmp = Cmp;
      NewCmp.prototype.renderUnit = function renderUnit(style = {}) {
        return this.props.unit ?
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            ...style,
          }}
          >
            <span className="fe-field-unit">
              {this.props.unit}
            </span>
          </div> : null;
      };
    }

    render() {
      return (<Cmp
        {...this.props}
      />);
    }
  }
  return UnitDecorator;
};

export default unit;
