/* eslint-disable import/no-dynamic-require,no-unused-vars,comma-spacing,max-len */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../../components/AsyncComponent';
import PrivateRoute from '../../components/PrivateRoute';

const Routes = () => (
  <Switch>
    <PrivateRoute
      key="SearchList"
      exact
      path="/Manage/SearchList"
      component={asyncComponent(() => import('./SearchList'))}
    />
    <PrivateRoute
      key="BasicDetail"
      exact
      path="/Manage/BasicDetail"
      component={asyncComponent(() => import('./BasicDetail'))}
    />
    <Redirect from="/Manage/*" to="/404" />
  </Switch>
);

export default Routes;
