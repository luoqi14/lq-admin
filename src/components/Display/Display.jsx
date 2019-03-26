import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import { isEmpty } from '../utils';
import unit from '../decorators/unit';

class Display extends Component {
  renderValue = () => {
    const { href, value, render } = this.props;
    let html = '';
    if (render) {
      html = render(value);
      html = isEmpty(html) ? <span className="fe-blank-holder">-</span> : html;
    } else {
      html = <span>{isEmpty(value) ? <span className="fe-blank-holder">-</span> : value}</span>;
    }
    if (href && !isEmpty(value)) {
      html = <Link to={href}>{html}</Link>;
    }
    return html;
  };

  render() {
    const {
      className = '',
    } = this.props;

    return (
      <div className={`${className} display-container`}>
        {
          this.renderValue()
        }
        {this.renderUnit()}
      </div>
    );
  }
}

export default unit(Display);
