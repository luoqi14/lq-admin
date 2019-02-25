import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import PropTypes from 'prop-types';


const page = (Cmp) => {
  class PageDecorator extends Component {
    static propTypes = {
      title: PropTypes.string,
      parentRoute: PropTypes.object,
    };

    static defaultProps = {
      title: '',
    };
    render() {
      const {
        title,
        location,
      } = this.props;

      let parentRoute;
      if (location.state && location.state.path) {
        parentRoute = {};
        parentRoute.path = location.state.path;
        parentRoute.title = location.state.title;
      }

      return (
        <div className="page-container">
          <div className="page-title">
            {!parentRoute && title}
            {parentRoute && (
              <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to={parentRoute.path}>{parentRoute.title}</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{title}</Breadcrumb.Item>
              </Breadcrumb>
            )}
          </div>
          <Cmp
            {...this.props}
          />
        </div>
      );
    }
  }
  return PageDecorator;
};

export default page;
