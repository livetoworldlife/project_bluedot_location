import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

//import Users from './user/pages/Users';
//import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';   //43-
//import UserPlaces from './places/pages/UserPlaces';         //49-dynamic route segments
//import UpdatePlace from './places/pages/UpdaterPlace';      //62-update place
//import Auth from './user/pages/Auth';                       //69-Adding Auth page 
import { AuthContext } from './shared/context/auth-context';  // 71-adding auth context
import { useAuth } from './shared/hooks/auth-hook';           // 187- Creating a Custom Authentication Hook
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

//197-Adding Code splitting to React
const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
//const MainNavigation = React.lazy(() => import('./shared/components/Navigation/MainNavigation'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdaterPlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));
//const Users = React.lazy(() => import('./user/pages/Users'));

const App = () => {
  const { token, login, logout, userId } = useAuth();                       // 187- Creating a Custom Authentication Hook

  return (
    // 71-adding auth context
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      <Router>                                          {/* // 38 starting Router   */}
        <MainNavigation />                              {/* 43-navigation  */}
        <main>
          <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>                          {/*//197-Adding Code splitting to React */}
            {/* //73-Adding Authenticated */}
            {token ?
              (<Switch>
                <Route path="/" exact>                    {/* route user page  */}
                  <Users />
                </Route>
                <Route path="/:userId/places" exact>      {/* //49-dynamic route segments */}
                  <UserPlaces />
                </Route>
                <Route path="/places/new" exact>          {/* route new places page */}
                  <NewPlace />
                </Route>
                <Route path="/places/:placeId">           {/* 62 update places */}
                  <UpdatePlace />
                </Route>
                <Redirect to="/" />                       {/* always redirect this path */}
              </Switch>) :
              (<Switch>
                <Route path="/" exact>                    {/* route user page  */}
                  <Users />
                </Route>
                <Route path="/:userId/places" exact>       {/* //49-dynamic route segments */}
                  <UserPlaces />
                </Route>
                <Route path="/auth">                       {/* // 69-Adding Auth page */}
                  <Auth />
                </Route>
                <Redirect to="/auth" />                     {/* redirect Auth page */}
              </Switch>)}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
