import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Icon,
  Layout,
} from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.scss';
import { getSideMenus } from '../../selectors';
import { common } from '../../store/common';
import respond from '../../decorators/Responsive';

const { SubMenu } = Menu;
const { Sider } = Layout;

const LinkWrapper = (props) => {
  const Com = props.to ? Link : 'a';
  return (
    <Com {...props}>
      {props.children}
    </Com>
  );
};

class SideMenu extends Component {
  static propTypes = {
    menuData: PropTypes.array.isRequired,
    selectedKeys: PropTypes.array,
    openKeys: PropTypes.array,
    menuLoad: PropTypes.func.isRequired,
    clickSubMenu: PropTypes.func.isRequired,
    clickMenuItem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedKeys: [],
    openKeys: [],
    collapsed: false,
  };

  constructor(props) {
    super(props);
    props.menuLoad()
      .then(() => {

      });
  }

  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
    });
    if (!this.state.collapsed) {
      this.props.collapseSubMenu();
    }
  };

  onClick({ key }) {
    this.props.clickMenuItem(key);
  }

  onTitleClick({ key }) {
    this.props.clickSubMenu(key);
  }

  renderMenu(menus) { // recursion to render the sideMenu
    return menus.map((menu) => {
      if (menu.children && menu.children.length > 0) {
        return (
          <SubMenu
            key={menu.id}
            title={
              <span>
                {menu.icon && <Icon type={menu.icon} />}<span><span className="menu-text">{menu.name}</span></span>
              </span>
            }
            onTitleClick={this.onTitleClick.bind(this)}
          >
            {this.renderMenu(menu.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={menu.id}>
          <LinkWrapper to={{
            pathname: menu.href,
            state: { action: 'RESET' },
          }}
          >
            {menu.icon && <Icon type={menu.icon} />}<span className="menu-text">{menu.name}</span>
          </LinkWrapper>
        </Menu.Item>
      );
    });
  }

  render() {
    const {
      menuData,
      selectedKeys,
      openKeys,
      changeOpen,
      expand,
    } = this.props;

    return (
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
            <div className="logo-title">后台管理系统</div>
          </div>
          <Menu
            style={{ overflowY: 'auto' }}
            mode="inline"
            theme="dark"
            selectedKeys={[...selectedKeys]}
            openKeys={openKeys}
            onClick={this.onClick.bind(this)}
            onOpenChange={changeOpen}
          >
            {this.renderMenu.bind(this)(menuData)}
          </Menu>
        </div>
      </Sider>
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
  changeOpen: common.changeOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(respond(SideMenu));
