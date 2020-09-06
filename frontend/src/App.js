import React, { useState, useCallback } from 'react';
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
//62-update place
import UpdatePlace from './places/pages/UpdaterPlace';
//69-Adding Auth page 
import Auth from './user/pages/Auth';
// 71-adding auth context
import { AuthContext } from './shared/context/auth-context';

const App = () => {
  // 71-adding auth context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    // 71-adding auth context
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}>
      {/* // 38 starting Router   */}
      <Router>
        {/* 43-navigation  */}
        <MainNavigation />
        <main>
          {/* //73-Adding Authenticated */}
          {isLoggedIn ?
            (<Switch>
              <Route path="/" exact>{/* route user page  */}
                <Users />
              </Route>
              <Route path="/:userId/places" exact>{/* //49-dynamic route segments */}
                <UserPlaces />
              </Route>
              <Route path="/places/new" exact>{/* route new places page */}
                <NewPlace />
              </Route>
              <Route path="/places/:placeId">{/* 62 update places */}
                <UpdatePlace />
              </Route>
              <Redirect to="/" />{/* always redirect this path */}
            </Switch>) :
            (<Switch>
              <Route path="/" exact>{/* route user page  */}
                <Users />
              </Route>
              <Route path="/:userId/places" exact>{/* //49-dynamic route segments */}
                <UserPlaces />
              </Route>
              <Route path="/auth">{/* // 69-Adding Auth page */}
                <Auth />
              </Route>
              <Redirect to="/auth" />{/* redirect Auth page */}
            </Switch>)}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
