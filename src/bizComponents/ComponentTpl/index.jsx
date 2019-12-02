import React, { PureComponent } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import './style.scss';

export default class ComponentTpl extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    download: PropTypes.func,
  };
  static defaultProps = {
    text: 'hello world',
    download: () => undefined,
  };
  download = () => {
    this.props.download();
  };

  render() {
    const { text } = this.props;
    return (
      <div className="component-tpl">
        <Button onClick={this.download}>{text}</Button>
      </div>
    );
  }
}
