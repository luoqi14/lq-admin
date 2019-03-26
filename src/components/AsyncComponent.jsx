/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import { Skeleton } from 'antd';

export default function AsyncComponent(importComponent) {
  class AC extends React.Component {
    state = { component: null };

    componentDidMount() {
      this.mounted = true;
      importComponent().then((res) => {
        if (this.mounted) {
          this.setState({
            component: res.default,
          });
        }
      });
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const C = this.state.component;

      return C
        ? <C {...this.props} className="page-fade-in" />
        : <div style={{ padding: 8 }}><Skeleton active /></div>;
    }
  }

  return AC;
}
