import React, { Component } from 'react';
import { Icon } from 'antd';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import './maximize.scss';

const maximize = Cmp => {
  class MaximizeDecorator extends Component {
    constructor(props) {
      super(props);

      this.state = {
        maximized: false,
      };

      this.root = document.getElementById('root');
    }

    render() {
      const { maximized } = this.state;

      return !maximized ? (
        <Cmp {...this.props} {...this.state}>
          <a
            className="indicator-maximize-container"
            role="button"
            tabIndex={-1}
            key="indicator"
            onClick={() => {
              this.setState({
                maximized: !this.state.maximized,
              });
            }}
          >
            <Icon type="arrows-alt" className="indicator-maximize" />
          </a>
        </Cmp>
      ) : (
        ReactDOM.createPortal(
          <div className="maximize-container">
            <Scrollbars
              onScroll={() => {
                // table header sticky
                const tableHeaders = document.querySelectorAll(
                  '.maximize-container .ant-table-thead'
                );
                if (tableHeaders.length > 0) {
                  tableHeaders.forEach &&
                    tableHeaders.forEach(ts => {
                      const pos = ts.getBoundingClientRect();
                      const ths = ts.querySelectorAll('th') || [];
                      ths.forEach &&
                        ths.forEach(t => {
                          const item = t;
                          item.style.top = `${0 - pos.top}px`;
                        });
                    });
                }
              }}
            >
              <Cmp {...this.props} {...this.state}>
                <a
                  className="indicator-maximize-container indicator-maximize-collapsed"
                  role="button"
                  tabIndex={-1}
                  key="indicator"
                  onClick={() => {
                    this.setState({
                      maximized: !this.state.maximized,
                    });
                  }}
                >
                  <Icon type="shrink" className="indicator-maximize" />
                </a>
              </Cmp>
            </Scrollbars>
          </div>,
          this.root
        )
      );
    }
  }
  return MaximizeDecorator;
};

export default maximize;
