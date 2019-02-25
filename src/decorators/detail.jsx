import React, { Component } from 'react';

const detail = (Cmp) => {
  class DetailDecorator extends Component {
    componentDidMount() {
      const {
        params,
        load,
      } = this.props;
      if (params.id !== '0') {
        load(params.id);
      }
    }
    componentWillUnmount() {
      const {
        reset,
      } = this.props;
      reset && reset();
    }

    render() {
      return (
        <Cmp
          {...this.props}
        />
      );
    }
  }
  return DetailDecorator;
};

export default detail;
