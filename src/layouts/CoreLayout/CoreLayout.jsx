import React, { Component } from 'react';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import SideMenu from '../../components/SideMenu';
import '../../styles/core.scss';
import './CoreLayout.scss';
import ChangePwdFormWrapper from './PwdForm';
import TopMenuWrapper from './TopMenu';
import Routes from '../../routes/Manage';

const { Content } = Layout;

// container's props refresh will cause child elements re-build?
class CoreLayout extends Component {
  state = {
    sticky: true,
  };
  render() {
    return (
      <Layout style={{ flexDirection: 'row' }}>
        <ChangePwdFormWrapper />
        <SideMenu />
        <Layout>
          <TopMenuWrapper history={this.props.history} />
          <Scrollbars
            style={{ height: 'calc(100vh - 66px)' }}
            onScroll={() => {
              // table header sticky
              const tableHeaders = document.querySelectorAll(
                '.listpage-table-container .ant-table-thead'
              );
              if (this.state.sticky && tableHeaders.length > 0) {
                tableHeaders.forEach &&
                  tableHeaders.forEach(ts => {
                    const pos = ts.getBoundingClientRect();
                    const ths = ts.querySelectorAll('th') || [];
                    if (pos.top < 64) {
                      ths.forEach &&
                        ths.forEach(t => {
                          const item = t;
                          item.style.top = `${64 - pos.top}px`;
                        });
                    } else {
                      ths.forEach &&
                        ths.forEach(t => {
                          const item = t;
                          item.style.top = 0;
                        });
                    }
                  });
              }
            }}
          >
            <Content style={{ padding: 0, margin: 0, minHeight: '100%' }}>
              <Routes />
            </Content>
          </Scrollbars>
        </Layout>
      </Layout>
    );
  }
}

export default CoreLayout;
