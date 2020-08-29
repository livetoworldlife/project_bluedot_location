import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
//43-
import MainNavigation from './shared/components/Navigation/MainNavigation';
//49-dynamic route segments
import UserPlaces from './places/pages/UserPlaces';

const App = () => {
  return (
    // 38 starting Router  
    <Router>
      {/* 43-navigation  */}
      <MainNavigation />
      <main>
        <Switch>
          {/* route user page  */}
          <Route path="/" exact>  <Users /> </Route>
          {/* //49-dynamic route segments */}
          <Route path='/:userId/places' exact>
            <UserPlaces />
          </Route>
          {/* route new places page */}
          <Route path="/places/new" exact>  <NewPlace />  </Route>
          {/* always redirect this path */}
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
