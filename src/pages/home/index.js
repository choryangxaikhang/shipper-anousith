import React, { useState } from "react";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import {
  getStaffLogin,
  loadingData,
} from "../../helper";
import {
  COMMITION_SHIPER,
  ITEM_DELIVERING,
  SHIPPER_CONFIRM,
  TAB_MENU_COMPLETED,
  TAB_MENU_ITEM_IN
} from "../../routes/app";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import { LIST_SHIPPER_CONFIRMED, LIST_SHIPPER_ITEM } from "./apollo";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
export default function Home() {
  const { history } = useReactRouter();
  const [house, setHouse] = useState("");
  const [userData, setUserData] = useState({});
  const [clickButton, setButton] = useState(false);
  const [reloadData, setReLoadData] = useState(false);
  const userInfo = getStaffLogin();

  const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_CONFIRMED, {
    fetchPolicy: "cache-and-network",
  });
  const [fetchItem, { data: DataItem, }] = useLazyQuery(LIST_SHIPPER_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          shipper: userInfo?._id,
          status: "DEPARTURE"
        },
      },
    });

    fetchItem({
      variables: {
        where: {
          shipper: userInfo?._id,
          itemStatus: "ASSIGNED_SHIPPER"
        },
      },
    });

  }, [result, reloadData, DataItem]);
  const totalPickup = result?.pickupOfItems?.total;
  const totalItem = DataItem?.items?.total;

  return (
    <>
      <div>
        <div className="appHeader  border-0 ">
          <div
            className="text-white pageTitle text-nowrap pr-0"
            style={{ flex: 1 }} >
            ໜ້າຫຼັກ
          </div>
          <div
            className="text-white pageTitle text-center text-nowrap pr-0"
            style={{ flex: 1 }}
          >
            <a
              className="mr-3 float-right"
              onClick={() => history.push(`${SHIPPER_CONFIRM}/1`)}

            >
              <i className="icon-bell" style={{ fontSize: 20 }} />

              {totalPickup !== 0 ? (
                <span className="badge badge-success mr-1 p-2">
                  <small>
                    {totalPickup}
                  </small>
                </span>
              ) : null}
            </a>
          </div>
        </div>
        <div className="body-content body-content-lg "
          style={{
            paddingTop: "0px"
          }}
        >
          <div
            className="wallet-card"
            style={{
              borderBottom: "1px solid red",
            }}
          >
            <div className="wallet-footer">
              <div className="item">
                <a
                  href="javascript:void(0)"
                  onClick={() => history.push(`${TAB_MENU_ITEM_IN}/1`)}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-circle-down fa-2x" />
                  </div>
                  <h5>ອໍເດີຮັບແລ້ວ</h5>
                </a>
              </div>
              <div className="item">
                {totalItem !== 0 ? (
                  <span
                    className="badge badge-success ms-2"
                    style={{
                      position: "fixed",
                      marginTop: -10,
                      marginRight: -50,
                      padding: 0,
                      zIndex: 1000,
                    }}
                  >
                    <small className="p-1">
                      {totalItem || 0}
                    </small>
                  </span>
                ) : null}
                <a
                  href="javascript:void(0)"
                  onClick={() => history.push(`${ITEM_DELIVERING}/1`)}
                >

                  <div className="icon-wrapper">
                    <i className="fa-solid fa-truck fa-2x" />
                  </div>
                  <h5>ກຳລັງຈັດສົ່ງ</h5>
                </a>
              </div>
              <div className="item">
                <a
                  onClick={(e) => history.push(`${TAB_MENU_COMPLETED}/1`)}
                >
                  <div className="icon-wrapper">
                    <i className="fas fa-circle-check fa-2x" />
                  </div>
                  <h5>ສົ່ງສຳເລັດ</h5>
                </a>
              </div>
            </div>

            <div className="wallet-footer">
              <div className="item">
                <a
                  href="javascript:void(0)"
                  onClick={() => history.push(`${COMMITION_SHIPER}/1`)}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-money-bill-wave fa-2x" />
                  </div>
                  <h5>ສ່ວນແບ່ງ</h5>
                </a>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
