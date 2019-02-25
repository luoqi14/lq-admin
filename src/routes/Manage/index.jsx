/* eslint-disable import/no-dynamic-require,no-unused-vars,comma-spacing */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../../components/AsyncComponent';
import PrivateRoute from '../../components/PrivateRoute';

const moduleNames = ['BasicDetail','SearchList','Tpl'];

const createRoutes = (pages) => {
  /* TODO don't use expression as import parameter, it's too slow when hot reloaded,
     use directly like import('./Tpl') instead
  */
  const comps = pages.map((page) => asyncComponent(() => import(`./${page.split('/')[0]}`)));
  return () => (
    <Switch>
      { comps.map((com, index) =>
        <PrivateRoute key={moduleNames[index]} exact path={`/Manage/${moduleNames[index]}`} component={com} />) }
      <Redirect exact from="/Manage" to={`/Manage/${moduleNames[0]}`} />
      <Redirect to="/404" />
    </Switch>
  );
};

export default createRoutes(moduleNames);
