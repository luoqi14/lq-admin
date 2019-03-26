/* eslint-disable import/no-dynamic-require,no-unused-vars,comma-spacing,max-len */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../../components/AsyncComponent';
import PrivateRoute from '../../components/PrivateRoute';

const Routes = () => (
  <Switch>
    <PrivateRoute key="Tpl" exact path="/Manage/Tpl" component={asyncComponent(() => import('./Tpl'))} />
    <PrivateRoute key="BasicDetail" exact path="/Manage/BasicDetail" component={asyncComponent(() => import('./BasicDetail'))} />
    <PrivateRoute key="SearchList" exact path="/Manage/SearchList" component={asyncComponent(() => import('./SearchList'))} />
    <PrivateRoute key="TplDetail" exact path="/Manage/TplDetail/:id" component={asyncComponent(() => import('./TplDetail'))} />
    <Redirect exact from="/" to="/Manage" />
    <Redirect exact from="/Manage" to="/Manage/BasicDetail" />
    <Redirect to="/404" />
  </Switch>
);

export default Routes;
