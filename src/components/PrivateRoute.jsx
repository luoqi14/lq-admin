import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      localStorage.getItem('accessToken') ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/SignIn',
          state: { from: props.location },
        }}
        />
      )
    )}
  />
);

export default PrivateRoute;
