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
                  <Redirect to="/login" />
                </Route>
                <Route
                  exact
                  path="/login"
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
