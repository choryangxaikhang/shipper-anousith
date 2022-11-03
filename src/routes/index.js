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
import SettingsScreen from "../pages/settings";
import UserList from "../pages/user_staff";
import DetailProfile from "../pages/user_staff/DetailProfile";
import ItemIn from "../pages/items/itemIn";
import ItemDelivering from "../pages/items/itemDelivering";
import DataListItem from "../pages/items/listItem";
import ItemCompleted from "../pages/items/itemComplete";
import DetailItems from "../pages/items/itemIn/DetailItem";
import DetailListDelivering from "../pages/items/itemDelivering/DetailItem";
import DetailICompleted from "../pages/items/itemComplete/DetailItem";
import DetailDataList from "../pages/items/listItem/DetailItem";
import Commition_ShiPer from "../pages/commition";
import TabMenuItems from "../pages/items/itemIn/TabMenu";
import TabMenuDelivering from "../pages/items/itemDelivering/TabMenuDeli";
import TabMenuCompleted from "../pages/items/itemComplete/TabMenuCom";
import TabMenuList from "../pages/items/listItem/TabMenuList";
import ShipperConFirm from "../pages/home/confirm";
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

                {/* ຈັດການອໍເດີ */}

                <Route
                  exact
                  path={`${ROUTES.SHIPPER_CONFIRM}/:_id`}
                  component={(props) => <ShipperConFirm {...props} />}
                />

                <Route
                  exact
                  path={`${ROUTES.ITEM_IN}/:_id`}
                  component={(props) => <ItemIn {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.ITEM_DELIVERING}/:_id`}
                  component={(props) => <ItemDelivering {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.ITEM_COMPLETED}/:_id`}
                  component={(props) => <ItemCompleted {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.ITEM_LIST_DATA}/:_id`}
                  component={(props) => <DataListItem {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.DETAIL_ITEMS}/:_id`}
                  component={(props) => <DetailItems {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.DETAIL_ITEMS_DELIVERING}/:_id`}
                  component={(props) => <DetailListDelivering {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.DETAIL_ITEMS_COMPLETED}/:_id`}
                  component={(props) => <DetailICompleted {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.DETAIL_DATA_LIST}/:_id`}
                  component={(props) => <DetailDataList {...props} />}
                />             
                <Route
                  exact
                  path={`${ROUTES.COMMITION_SHIPER}/:_id`}
                  component={(props) => <Commition_ShiPer {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.TAB_MENU_ITEM_IN}/:_id`}
                  component={(props) => <TabMenuItems {...props} />}
                />
                  <Route
                  exact
                  path={`${ROUTES.TAB_MENU_DELIVERING}/:_id`}
                  component={(props) => <TabMenuDelivering {...props} />}
                />
                 <Route
                  exact
                  path={`${ROUTES.TAB_MENU_COMPLETED}/:_id`}
                  component={(props) => <TabMenuCompleted {...props} />}
                />
                 <Route
                  exact
                  path={`${ROUTES.TAB_MENU_LIST}/:_id`}
                  component={(props) => <TabMenuList {...props} />}
                />

                <Route
                  exact
                  path={`${ROUTES.PROFILES}`}
                  component={(props) => <Profile {...props} />}
                />


                {/* setting */}
                <PrivateRoute
                  path={`${ROUTES.SETTING}/:_id`}
                  exact
                  component={(props) => <SettingsScreen {...props} />}
                />
                {/* user */}
                <PrivateRoute
                  path={`${ROUTES.USERS}/:page`}
                  exact
                  component={(props) => <UserList {...props} />}
                />
                <PrivateRoute
                  path={`${ROUTES.DETAIL_USER}/:_id`}
                  exact
                  component={(props) => <DetailProfile {...props} />}
                />
                {/* equiment */}


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
