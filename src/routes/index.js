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
import PeopleCheckout from "../pages/other/PeopleCheckout";
import Booking from "../pages/other/booking";
import BookingRequestScreen from "../pages/other/bookingRequest";
import BookingCancel from "../pages/other/cancel";
import SettingsScreen from "../pages/settings";
import RateExChange from "../pages/rateExchange";
import TabMenu from "../pages/management_house/TabMenu";
import TabMenuIncome from "../pages/other/reportIncome/TabMenuIncome";

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
                {/* hotel */}
                <Route
                  exact
                  path={`${ROUTES.HOTEL}/:_id`}
                  component={(props) => <Hotel {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.HOTEL_CHECKOUT}`}
                  component={PeopleCheckout}
                />
                {/* booking */}
                <Route
                  exact
                  path={`${ROUTES.BOOKING}/:_id`}
                  component={(props) => <Booking {...props} />}
                />
                <PrivateRoute
                  path={`${ROUTES.REQUEST_BOOKING_SCREEN}/:_id`}
                  exact
                  component={(props) => <BookingRequestScreen {...props} />}
                />
                <PrivateRoute
                  path={`${ROUTES.BOOKING_CANCEL}/:_id`}
                  exact
                  component={(props) => <BookingCancel {...props} />}
                />
                {/* setting */}
                <PrivateRoute
                  path={`${ROUTES.SETTING}/:_id`}
                  exact
                  component={(props) => <SettingsScreen {...props} />}
                />
                {/* rateEx */}
                <PrivateRoute
                  path={`${ROUTES.RATE_EXCHANGE_SCREEN}/:page`}
                  exact
                  component={(props) => <RateExChange {...props} />}
                />
                {/* managementhouse*/}
                <PrivateRoute
                  path={`${ROUTES.TAB_MENU}/:page`}
                  exact
                  component={(props) => <TabMenu {...props} />}
                />
                <PrivateRoute
                  path={`${ROUTES.TAB_MENU_INCOME}/:page`}
                  exact
                  component={(props) => <TabMenuIncome {...props} />}
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
