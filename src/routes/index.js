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
import ItemIn from "../pages/items/itemIn";
import ItemDelivering from "../pages/items/itemDelivering";
import DataListItem from "../pages/items/listItem";
import ItemCompleted from "../pages/items/itemComplete";
import DetailItems from "../pages/items/itemIn/DetailItem";
import DetailListDelivering from "../pages/items/itemDelivering/DetailItem";
import DetailICompleted from "../pages/items/itemComplete/DetailItem";
import DetailDataList from "../pages/items/listItem/DetailItem";
import TabMenuItems from "../pages/items/itemIn/TabMenu";
import TabMenuCompleted from "../pages/items/itemComplete/TabMenuCom";
import TabMenuList from "../pages/items/listItem/TabMenuList";
import ShipperConFirm from "../pages/home/shipperconfirm/confirm";
import DetailConfirm from "../pages/home/shipperconfirm/DetailConfirm";
import { gql, useMutation } from "@apollo/client";
import CommissionHistory from "../pages/commition/commissionHistory";
import Commission_ShiPer from "../pages/commition";
import DetailHistory from "../pages/commition/DetailHistory";
export default function Routes() {
  const _local = localStorage.getItem(TOKEN);

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
              <TokenValidate />
              
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
                  path={`${ROUTES.DETAIL_CONFIRM}/:_id`}
                  component={(props) => <DetailConfirm {...props} />}
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
                  path={`${ROUTES.COMMISSION_SHIPER}/:_id`}
                  component={(props) => <Commission_ShiPer {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.HISTORY_COMMISSION}/:_id`}
                  component={(props) => <CommissionHistory {...props} />}
                />
                <Route
                  exact
                  path={`${ROUTES.DETAIL_HISTORY}/:_id`}
                  component={(props) => <DetailHistory {...props} />}
                />

                <Route
                  exact
                  path={`${ROUTES.TAB_MENU_ITEM_IN}/:_id`}
                  component={(props) => <TabMenuItems {...props} />}
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

                <PrivateRoute
                  path={`${ROUTES.SETTING}/:_id`}
                  exact
                  component={(props) => <SettingsScreen {...props} />}
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

const TokenValidate = ()=>{
  const [tokenValidate] = useMutation(gql`
  mutation TokenValidation {
    tokenValidation {
      status
    }
  }`)
  useEffect(() => {
    (async () => {
      try {
        await tokenValidate()
      } catch (error) {
        localStorage.clear();
        window.location.href = `/login`;
      }
    })();
  }, [tokenValidate])

  return null
}
