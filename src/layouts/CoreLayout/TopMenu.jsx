/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { common } from '../../store/common';
import DropdownPanelWrapper from './DropdownPanel';
import respond from '../../decorators/Responsive';

const { Header } = Layout;

class TopMenu extends Component {
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onClick({ key }) {
    this.props.clickTopMenu(key);
  }

  render() {
    return (
      <Header className="header flex flex-c flex-js">
        <div />
        <DropdownPanelWrapper />
      </Header>
    );
  }
}

const TopMenuWrapper = connect(
  state => ({
    selectedKeys: state.common.selectedTopKeys,
    firstLeaf: state.common.firstLeaf,
    cityData: state.common.cityData,
    cityLoading: state.common.cityLoading,
    cityId: state.common.cityId,
  }),
  {
    clickTopMenu: common.clickTopMenu,
    initMenu: common.initMenu,
    changeCity: common.changeCity,
    changeCityClient: common.changeCityClient,
  }
)(TopMenu);

export default respond(TopMenuWrapper);
