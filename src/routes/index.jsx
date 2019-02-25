// We only need to import the modules necessary for initial render
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PageNotFound from './404/components';
import ErrorPage from './Error/components';
import CoreLayout from '../layouts/CoreLayout';
import asyncComponent from '../components/AsyncComponent';

const SignIn = asyncComponent(() => import('./SignIn')); /* webpackChunkName: "SignIn" */

const Routes = () => (
  <Switch>
    <Route path="/Manage" component={CoreLayout} />
    <Route path="/SignIn" component={SignIn} />
    <Route path="/Error" component={ErrorPage} />
    <Route path="/404" component={PageNotFound} />
    <Redirect exact from="/" to="/Manage" />
    <Redirect to="/404" />
  </Switch>
);

export default Routes;
