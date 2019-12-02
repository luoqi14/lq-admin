import React, { Component } from 'react';
import Animate from 'rc-animate';
import { Icon } from 'antd';
import './minimize.scss';

const minimize = Cmp => {
  class MinimizeDecorator extends Component {
    constructor(props) {
      super(props);

      this.state = {
        expanded: true,
      };
    }

    render() {
      const { expanded } = this.state;

      return (
        <Animate
          transitionName="slide-up"
          className={expanded ? '' : 'container-collapsed'}
        >
          {expanded ? (
            <Cmp {...this.props} {...this.state}>
              <a
                className="indicator-container"
                role="button"
                tabIndex={-1}
                key="indicator"
                onClick={() => {
                  this.setState({
                    expanded: !this.state.expanded,
                  });
                }}
              >
                <Icon type="up-square-o" className="indicator" />
              </a>
            </Cmp>
          ) : (
            <a
              className="indicator-container indicator-collapsed"
              role="button"
              tabIndex={-1}
              key="indicator"
              onClick={() => {
                this.setState({
                  expanded: !this.state.expanded,
                });
              }}
            >
              <Icon type="down-square-o" className="indicator" />
            </a>
          )}
        </Animate>
      );
    }
  }
  return MinimizeDecorator;
};

export default minimize;
