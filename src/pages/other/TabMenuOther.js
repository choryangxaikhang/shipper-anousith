/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
// import "./utils/index.css";
import * as ROUTES from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import {
  getLocalHouse,
  getStaffLogin,
  loadingData,
  socketServer,
} from "../../helper";
import { BOOKINGS } from "./gql";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";

export default function TabMenuOther() {
  const { history } = useReactRouter();
  const [reloadData, setReloadData] = useState(false);
  const [house, setHouse] = useState("");
  const [userData, setUserData] = useState({});
  const [clickButton, setButton] = useState(false);

  const [queryBooking, { data: setData, loading: loading }] = useLazyQuery(
    BOOKINGS,
    { fetchPolicy: "cache-and-network" }
  );
  const [queryBookingFull, { data: setDataFull, loading: loadingFull }] =
    useLazyQuery(BOOKINGS, { fetchPolicy: "cache-and-network" });
  const [
    queryBookingRequested,
    { data: setDataRequested, loading: loadingRequested },
  ] = useLazyQuery(BOOKINGS, { fetchPolicy: "cache-and-network" });

  socketServer.on("booking", (data) => {
    setReloadData(!reloadData);
    // newSound.play();
  });

  socketServer.on("approveBooking", (res) => {
    if (res === house?._id) {
      // newSound.play();
      setReloadData(!reloadData);
    }
  });
  // data HouseLocal
  useEffect(() => {
    const _local = getStaffLogin();
    setUserData(_local?.data || {});
    setHouse(getLocalHouse());
    //sidebar min
    const localSideBarMini = localStorage.getItem("SIDEBAR_MINI");
    if (localSideBarMini === "true") {
      document.body.classList.add("sidebar-collapse");
    }
  }, []);
  // end

  useEffect(() => {
    let whereData = {};
    whereData = {
      house: parseInt(house?._id),
    };
    if (userData?.role === "SUPER_ADMIN" || userData?.role === "IT") {
      delete whereData.house;
    }
    queryBookingFull({
      variables: {
        where: {
          ...whereData,
          status: "CHECK_IN",
        },
        orderBy: "createdAt_DESC",
      },
    });

    queryBooking({
      variables: {
        where: {
          ...whereData,
          status: "BOOKING",
        },
        orderBy: "createdAt_DESC",
      },
    });
    queryBookingRequested({
      variables: {
        where: {
          ...whereData,
          status: "REQUESTED",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [house?._id, reloadData]);

  return (
    <>
      <div>
        <div className="appHeader  border-0 mr-0">
          <div style={{ flex: 1 }} className="text-left">
            <button
              className="btn text-white"
              onClick={(e) => {
                setButton(!clickButton);
              }}
            >
              <i className="fa-solid fa-magnifying-glass fa-2 ms-2" />
            </button>
          </div>
          {clickButton === true ? (
            <>
              <SelectLocalHouse
                style={{ width: "100%" }}
                value={house?._id}
                onChange={(obj) => {
                  if (obj?._id) {
                    setHouse(obj);
                    localStorage.setItem("HOUSE", JSON.stringify(obj));
                    window.location.reload();
                  }
                }}
                ownerId={userData?._id}
              />
            </>
          ) : (
            <b className="text-white">
              {house?.houseName ? house?.houseName : "ຈັດການບໍລິການອື່ນໆ"}
            </b>
          )}
          <div
            className="text-white pageTitle text-right text-nowrap pr-0"
            style={{ flex: 1 }}
          ></div>
        </div>
        <div id="appCapsule" style={{ marginTop: -10 }}>
          <div className="section wallet-card-section">
            <div className="session-list mt-1" ng-controller="home">
              <div
                className="wallet-card"
                style={{ borderBottom: "1px solid red" }}
              >
                {/* rare */}
                <div className="wallet-footer">
                  <div className="item">
                    <a
                      onClick={(e) =>
                        history.push(`${ROUTES.RATE_EXCHANGE_SCREEN}/1`)
                      }
                    >
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-kip-sign fa-2x" />
                      </div>
                      <h5>ອັດຕາແລກປ່ຽນ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a onClick={(e) => history.push(`${ROUTES.TAB_MENU}/Type`)}>
                      <div className="icon-wrapper">
                        <i className="icon-plus-circle me-1 fa-2x ms-1" />
                      </div>
                      <h5>ເພີ່ມຫ້ອງ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a
                      onClick={(e) => {
                        history.push(`${ROUTES.TAB_MENU_INCOME}/Type`);
                      }}
                    >
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-book fa-2x" />
                      </div>
                      <h5>ລາຍງານ</h5>
                    </a>
                  </div>
                </div>
                <div className="wallet-footer">
                  <div className="item">
                    <a
                      onClick={(e) => {
                        history.push(`${ROUTES.TAB_EQUIMENT}/Type`);
                      }}
                    >
                      <div className="icon-wrapper">
                        <i class="fa-solid fa-chart-line fa-2x" />
                      </div>
                      <h5>ຈັດການຊັບສິນ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a
                      onClick={(e) => {
                        history.push(`${ROUTES.TAB_ACCOUNT}/Type`);
                      }}
                    >
                      <div className="icon-wrapper">
                        <i className="fa-sharp fa-solid fa-file-invoice-dollar fa-2x" />
                      </div>
                      <h5>ຈັດການບັນຊີ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a
                      onClick={(e) => {
                        history.push(`${ROUTES.PROMOTION_SCREEN}/1`);
                      }}
                    >
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-hand-holding-dollar fa-2x" />
                      </div>
                      <h5>ຈັດການໂປຣໂມຊັ່ນ</h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ບໍລິການອື່ນ */}
            {(userData?.role === "SUPER_ADMIN") |
              (userData?.role === "IT") |
              (userData?.role === "ADMIN") && (
              <>
                <div className="transactions mt-2 ">
                  <a href="javascript:void(0)" className="item pr-0">
                    <div className="">
                      {loadingRequested ? (
                        <span
                          className="ms-4"
                          style={{
                            position: "fixed",
                            marginTop: -5,
                            marginRight: -10,
                            padding: 0,
                            zIndex: 1000,
                          }}
                        >
                          {loadingData(10)}
                        </span>
                      ) : setDataRequested?.bookings?.total > 0 ? (
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
                            {setDataRequested?.bookings?.total
                              ? setDataRequested?.bookings?.total
                              : ""}
                          </small>
                        </span>
                      ) : null}
                      <a
                        onClick={(e) => {
                          history.push(
                            `${`${ROUTES.REQUEST_BOOKING_SCREEN}/1`}`
                          );
                        }}
                      >
                        <div className="icon-wrapper mt-1">
                          <i className="fa-solid fa-cart-plus fa-2x text-center ms-2 mb-1" />
                        </div>
                        <h5>ການຮ້ອງຈອງ</h5>
                      </a>
                    </div>
                    <div className="">
                      <a
                        onClick={(e) => {
                          history.push(`${ROUTES.BOOKING_CANCEL}/1`);
                        }}
                      >
                        <div className="icon-wrapper">
                          <i class="fa-solid fa-triangle-exclamation fa-2x mb-1" />
                        </div>
                        <h5>ຍົກເລີກ</h5>
                      </a>
                    </div>
                    <div className="me-3">
                      <a
                        onClick={(e) => {
                          history.push(`${ROUTES.SETTING}/1`);
                        }}
                      >
                        <div className="icon-wrapper">
                          <i className="fa-solid fa-gear fa-2x mb-1" />
                        </div>
                        <h5>ຕັ້ງຄ່າ</h5>
                      </a>
                    </div>
                  </a>
                </div>
              </>
            )}
          </div>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
