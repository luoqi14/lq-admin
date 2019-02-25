import React, { Component } from 'react';

class View extends Component {
  componentDidMount() {
    this.props.hello();
  }

  render() {
    const {
      total,
    } = this.props;
    return (
      <div>Template view, total is: {total}</div>
    );
  }
}

export default View;
