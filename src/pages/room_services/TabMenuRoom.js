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

export default function TabMenuRoom() {
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
                <div className="wallet-footer">
                  <div className="item">
                    <a
                      href="javascript:void(0)"
                      onClick={() => history.push(`${ROUTES.HOTEL}/1`)}
                    >
                      <div className="icon-wrapper">
                        <i className="fa-sharp fa-solid fa-person-booth fa-2x" />
                      </div>
                      <h5>ເປີດຫ້ອງ</h5>
                    </a>
                  </div>
                  <div className="item">
                    {loading ? (
                      <span
                        className="ms-2"
                        style={{
                          position: "fixed",
                          marginTop: -10,
                          marginRight: -50,
                          padding: 0,
                          zIndex: 1000,
                        }}
                      >
                        {loadingData(10)}
                      </span>
                    ) : setData?.bookings?.total > 0 ? (
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
                          {setData?.bookings?.total}
                        </small>
                      </span>
                    ) : null}
                    <a
                      href="javascript:void(0)"
                      onClick={() => history.push(`${ROUTES.BOOKING}/1`)}
                    >
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-circle-down fa-2x" />
                      </div>
                      <h5>ຫ້ອງກຳລັງຈອງ</h5>
                    </a>
                  </div>
                  <div className="item">
                    {loadingFull ? (
                      <span
                        className="ms-2"
                        style={{
                          position: "fixed",
                          marginTop: -10,
                          marginRight: -50,
                          padding: 0,
                          zIndex: 1000,
                        }}
                      >
                        {loadingData(10)}
                      </span>
                    ) : setDataFull?.bookings?.total > 0 ? (
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
                          {setDataFull?.bookings?.total}
                        </small>
                      </span>
                    ) : null}
                    <a
                      onClick={(e) => history.push(`${ROUTES.HOTEL_CHECKOUT}`)}
                    >
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-share-from-square fa-2x" />
                      </div>
                      <h5>ແຂກອອກ</h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
