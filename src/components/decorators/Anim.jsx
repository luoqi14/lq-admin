/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

const fadeIn = (Cmp) => {
  class AnimDecorator extends Component {
    constructor(props) {
      super(props);
      this.container = React.createRef();
    }

    componentDidMount() {
      const dom = findDOMNode(this.container.current);
      dom.classList.add('page-fade-in');
    }

    render() {
      return (<Cmp
        {...this.props}
        ref={this.container}
      />);
    }
  }
  return AnimDecorator;
};

export default fadeIn;
