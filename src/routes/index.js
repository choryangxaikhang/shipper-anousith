import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../pages/home/index";
import Login from "../pages/login/Login";
import { AppContext } from "../App";
import { TOKEN } from "../helper";
import * as ROUTES from "./app";
import Profile from "../pages/profile/Profile";
import Other from "../pages/other/TabMenuOther";
import TabMenuOther from "../pages/other/TabMenuOther";
import Hotel from "../pages/other/hotel";

export default function Routes() {
  const { userDispatch } = useContext(AppContext);
  const _local = localStorage.getItem(TOKEN);

  useEffect(() => {
    if (_local) {
      const data = JSON.parse(_local);
      userDispatch({ type: "landing", payload: data });
    }
  }, [_local]);

  return (
    <>
      <Router>
        <>
          <Switch>
            {!_local ? (
              <>
                <Route exact path="/">
                  <Redirect to={ROUTES.LOGIN} />
                </Route>
                <Route
                  exact
                  path={ROUTES.LOGIN}
                  component={(props) => <Login {...props} />}
                />
                <Route
                  exact
                  path="/"
                  component={(props) => <Login {...props} />}
                />
              </>
            ) : (
              <>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
                <Route
                  exact
                  path={`${ROUTES.OTHER}`}
                  component={(props) => <TabMenuOther {...props} />}
                />
                
                <Route
                  exact
                  path={`${ROUTES.PROFILES}`}
                  component={(props) => <Profile {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.HOTEL}`}
                  component={(props) => <Hotel {...props} />}
                />
                 <Route
                  exact
                  path={`${ROUTES.GUESTHOUSE}`}
                  component={(props) => <Hotel {...props} />}
                />
                <Route
                  render={({ location, history }) => (
                    <>
                      <PrivateRoute
                        path={"/home"}
                        exact
                        component={(props) => <HomePage />}
                      />
                    </>
                  )}
                />
              </>
            )}
          </Switch>
        </>
      </Router>
    </>
  );
}
