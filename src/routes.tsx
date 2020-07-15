import { Switch, Route } from 'react-router-dom';
import React from 'react';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AuthComponent from './components/HoC/Authentication';

const Routes: React.FC = () => {
  return (
    <AuthComponent>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route exact component={Profile} />
      </Switch>
    </AuthComponent>
  );
};

export default Routes;
