import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import { BOOKINGS, QUERY_SUMMARY_BOOKING } from "./apollo";
import male from "../../img/male.png";
import { Image } from "react-bootstrap";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  getLocalHouse,
  getStaffLogin,
  loadingData,
  toDayDash,
} from "../../helper";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import OtherMoney from "./OtherMoney";
import { BOOKING, OTHER } from "../../routes/app";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
export default function Home() {
  const { history } = useReactRouter();
  const [startDate, setStartDate] = useState(toDayDash());
  const [endDate, setEndDate] = useState(toDayDash());
  const [house, setHouse] = useState("");
  const [userData, setUserData] = useState({});
  const [clickButton, setButton] = useState(false);

  const [fetchBooking, { data: setBooking, loading: loadingBooking }] =
    useLazyQuery(QUERY_SUMMARY_BOOKING, {
      fetchPolicy: "cache-and-network",
    });
  const [checkOut, { data: outHouse, loading: loading }] = useLazyQuery(
    QUERY_SUMMARY_BOOKING,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [fetchDataCheckIn, { data: CheckInHouse, loadingCheckIn }] =
    useLazyQuery(QUERY_SUMMARY_BOOKING, {
      fetchPolicy: "cache-and-network",
    });
  // data HouseLoca
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
    if (userData?.role === "SUPER_ADMIN") {
      delete whereData.house;
    }
    fetchBooking({
      variables: {
        where: {
          ...whereData,
          bookDate_gte: createdAt_gte(startDate),
          bookDate_lte: createdAt_lt(endDate),
          status: "BOOKING",
        },
        orderBy: "createdAt_DESC",
      },
    });
    // check_in

    fetchDataCheckIn({
      variables: {
        where: {
          ...whereData,
          checkInAt_gte: createdAt_gte(startDate),
          checkInAt_lte: createdAt_lt(endDate),
          status: "CHECK_IN",
        },
        orderBy: "createdAt_DESC",
      },
    });

    // Booking
    checkOut({
      variables: {
        where: {
          ...whereData,
          checkOutAt_gte: createdAt_gte(startDate),
          checkOutAt_lte: createdAt_lt(endDate),
          status: "CHECK_OUT",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [userData]);
  return (
    <>
      <div
        id="appCapsule"
        style={{
          backgroundColor: "#f54f02",
          marginBottom: 0,
          paddingBottom: 0,
          whidth: "100vh",
        }}
      >
        <div className="appHeader  border-0 ">
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
              {house?.houseName ? house?.houseName : "ໜ້າຫຼັກ"}
            </b>
          )}
          <div
            className="text-white pageTitle text-center text-nowrap pr-0"
            style={{ flex: 1 }}
          >
            <a
              className="mr-3 float-right"
              onClick={() => history.push(`${BOOKING}/1`)}
            >
              <i className="icon-bell" style={{ fontSize: 20 }} />
              {loadingBooking ? (
                <span style={{ position: "absolute", right: 10, top: 10 }}>
                  {loadingData(10)}
                </span>
              ) : setBooking?.summaryBookingTotal?.bookingTotal > 0 ? (
                <span className="badge badge-success mr-1 p-2">
                  <small>
                    {setBooking?.summaryBookingTotal?.bookingTotal
                      ? setBooking?.summaryBookingTotal?.bookingTotal
                      : 0}
                  </small>
                </span>
              ) : null}
            </a>
          </div>
        </div>
        <div className="body-content body-content-lg ">
          <div className="container">
            <div
              className="add-card section-to-header mb-30"
              style={{ marginTop: -140 }}
            >
              <div className="add-card-inner">
                <div className="add-card-item add-card-info">
                  <p>ຫ້ອງກຳລັງຈອງ</p>
                  {loadingBooking ? (
                    loadingData(25)
                  ) : (
                    <>
                      <b className="text-danger fs-4">
                        {setBooking?.summaryBookingTotal?.bookingTotal > 0
                          ? currency(
                              setBooking?.summaryBookingTotal?.bookingTotal
                            )
                          : 0}{" "}
                      </b>
                      ຫ້ອງ
                    </>
                  )}
                </div>
                <div className="add-card-item add-balance">
                  <a href="javascript:void(0)" className="p-1">
                    <b className="fs-4">ໄອດີ: {userData?._id}</b>
                  </a>
                </div>
              </div>
            </div>
            <div className="option-section mb-15">
              <div className="row gx-2">
                <div className="col-6 pb-15">
                  <div
                    className="option-card card"
                    style={{ borderTop: "1px solid #f54f02" }}
                  >
                    <a
                      href="javascript:void(0)"
                      data-bs-toggle="modal"
                      data-bs-target="#withdraw"
                    >
                      <p>ຫ້ອງກຳລັງເປີດ</p>
                      <div className="option-card-icon text-black">
                        {loadingCheckIn ? (
                          loadingData(25)
                        ) : (
                          <>
                            <b className="text-danger fs-4">
                              {CheckInHouse?.summaryBookingTotal?.bookingTotal >
                              0
                                ? currency(
                                    CheckInHouse?.summaryBookingTotal
                                      ?.bookingTotal
                                  )
                                : 0}{" "}
                            </b>
                            ຫ້ອງ
                          </>
                        )}
                      </div>
                    </a>
                  </div>
                </div>

                <div className="col-6 pb-15">
                  <div
                    className="option-card  card "
                    style={{ borderTop: "1px solid #f54f02" }}
                  >
                    <a href="javascript:void(0)">
                      <p>ຫ້ອງແຂກອອກມື້ນີ້</p>
                      <div className="option-card-icon text-black">
                        {loading ? (
                          loadingData(25)
                        ) : (
                          <>
                            <b className="text-danger fs-4">
                              {outHouse?.summaryBookingTotal?.bookingTotal > 0
                                ? currency(
                                    outHouse?.summaryBookingTotal?.bookingTotal
                                  )
                                : 0}{" "}
                            </b>
                            ຫ້ອງ
                          </>
                        )}
                      </div>
                    </a>
                  </div>
                </div>
                <OtherMoney />
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
