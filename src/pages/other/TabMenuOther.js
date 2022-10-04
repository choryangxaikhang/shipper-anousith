/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
// import "./utils/index.css";
import * as ROUTES from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import { getLocalHouse, getStaffLogin, loadingData, socketServer } from "../../helper";
import { BOOKINGS } from "./gql";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";

export default function TabMenuOther() {
  const { history } = useReactRouter();
  const [localHouse, setLocalHouse] = useState("");
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
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);

  socketServer.on("booking", (data) => {
    setReloadData(!reloadData);
    // newSound.play();
  });

  socketServer.on("approveBooking", (res) => {
    if (res === localHouse) {
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
    queryBookingFull({
      variables: {
        where: {
          house: parseInt(localHouse),
          status: "CHECK_IN",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse]);

  useEffect(() => {
    queryBooking({
      variables: {
        where: {
          house: parseInt(localHouse),
          status: "BOOKING",
        },
        orderBy: "createdAt_DESC",
      },
    });
    queryBookingRequested({
      variables: {
        where: {
          house: parseInt(localHouse),
          status: "REQUESTED",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse, reloadData]);

  return (
    <>
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
          <b className="text-white">ຈັດການຂໍ້ມູນອື່ນໆ</b>
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
                      <small className="p-1">{setData?.bookings?.total}</small>
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
              </div>
              <div className="wallet-footer">
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
                  <a onClick={(e) => history.push(`${ROUTES.HOTEL_CHECKOUT}`)}>
                    <div className="icon-wrapper">
                      <i className="fa-solid fa-share-from-square fa-2x" />
                    </div>
                    <h5>ແຂກອອກ</h5>
                  </a>
                </div>
                <div className="item">
                  <a>
                    <div className="icon-wrapper">
                      <i className="fa-solid fa-book fa-2x" />
                    </div>
                    <h5>ລາຍງານ</h5>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* ບໍລິການອື່ນ */}
          <div className="transactions mt-2 ">
            <a
              href="javascript:void(0)"
              className="item pr-0"
              // style={{ borderBottom: "1px solid red" }}
            >
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
                      {setDataRequested?.bookings?.total}
                    </small>
                  </span>
                ) : null}
                <a
                  onClick={(e) => {
                    history.push(`${`${ROUTES.REQUEST_BOOKING_SCREEN}/1`}`);
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
        </div>

        <BottomNav />
      </div>
    </>
  );
}
