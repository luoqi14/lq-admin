import React, { Component } from 'react';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { SideMenu } from 'lq-component';
import '../../styles/core.scss';
import './CoreLayout.scss';
import ChangePwdFormWrapper from './PwdForm';
import TopMenuWrapper from './TopMenu';
import { common } from '../../store/common';
import { getSideMenus } from '../../selectors';
import respond from '../../decorators/Responsive';
import Routes from '../../routes/Manage';

const { Content, Sider } = Layout;

class CoreLayout extends Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
    });
    if (collapsed) {
      this.props.collapseSubMenu();
    }
  };
  render() {
    const {
      selectedKeys,
      openKeys,
      menuData,
      menuLoad,
      clickSubMenu,
      clickMenuItem,
      expand,
    } = this.props;
    return (
      <Layout>
        <ChangePwdFormWrapper />
        <Sider
          collapsible
          collapsedWidth={expand ? 80 : 0}
          breakpoint="sm"
          width={200}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="flex flex-v" style={{ height: '100%' }}>
            <div className="logo-wrapper flex flex-js flex-c">
              <div className="logo"><img alt="" src="/logo.png" /></div>
              <div className="logo-title">组件开发</div>
            </div>
            <SideMenu
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              menuData={menuData}
              menuLoad={menuLoad}
              clickSubMenu={clickSubMenu}
              clickMenuItem={clickMenuItem}
              collapsed={this.state.collapsed}
            />
          </div>
        </Sider>
        <Layout>
          <TopMenuWrapper />
          <Scrollbars
            style={{ height: document.body.clientHeight - 64 }}
          >
            <Content style={{ padding: 0, margin: 0 }}>
              <Routes />
            </Content>
          </Scrollbars>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedKeys: state.common.selectedKeys || [],
  openKeys: state.common.openedKeys || [],
  menuData: getSideMenus(state),
});

const mapDispatchToProps = {
  menuLoad: common.loadMenu,
  clickSubMenu: common.clickSubMenu,
  clickMenuItem: common.clickMenuItem,
  collapseSubMenu: common.collapseSubMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(respond(CoreLayout));
