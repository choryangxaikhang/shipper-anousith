import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import { BOOKINGS, QUERY_ROOM } from "./apollo";
import male from "../../img/male.png";
import { Image } from "react-bootstrap";
import {
  aws_url_employee_Image,
  currency,
  getLocalHouse,
  getStaffLogin,
  loadingData,
} from "../../helper";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import OtherMoney from "./OtherMoney";
import { BOOKING, OTHER } from "../../routes/app";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
export default function Home() {
  const { history } = useReactRouter();
  const [total, setTotal] = useState(0);
  const [getPayrollSummary, setDataRoom] = useState([]);
  const [localHouse, setLocalHouse] = useState("");
  const [house, setHouse] = useState("");
  const [userData, setUserData] = useState({});
  const [clickButton, setButton] = useState(false);

  const [fetchItem, { data: setNoticeConfirm, loading: loadingTotal }] =
    useLazyQuery(QUERY_ROOM, {
      fetchPolicy: "cache-and-network",
    });
  const [fetchAnsItem, { data: DataRoom, loading: loading }] = useLazyQuery(
    QUERY_ROOM,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  // Bookigng
  const [queryBooking, { data: setaBooking, loading: loadingBooking }] =
    useLazyQuery(BOOKINGS, {
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
    fetchAnsItem({
      variables: {
        where: {},
        limit: 1,
        orderBy: "createdAt_DESC",
      },
    });
    // Booking
    queryBooking({
      variables: {
        where: {
          // house: parseInt(localHouse),
          status: "BOOKING",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, []);

  useEffect(() => {
    fetchItem({
      variables: {
        where: {},
        orderBy: "createdAt_DESC",
      },
    });
  }, [userData]);

  useEffect(() => {
    setDataRoom(DataRoom?.rooms?.data[0]);
  }, [DataRoom]);

  useEffect(() => {
    if (setNoticeConfirm) {
      setTotal(setNoticeConfirm?.rooms?.data?.length);
    }
  }, [setNoticeConfirm]);

  return (
    <>
      <div
        id="appCapsule"
        style={{
          backgroundColor: "#f54f02",
          marginBottom: 0,
          paddingBottom: 0,
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
            <b className="text-white">ໜ້າຫຼັກ</b>
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
              ) : setaBooking?.bookings?.total > 0 ? (
                <span className="badge badge-success mr-1 p-2">
                  <small>
                    {setaBooking?.bookings?.total
                      ? setaBooking?.bookings?.total
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
                  <p>ຍອດລວມທັງຫມົດ</p>
                  {loading ? (
                    loadingData(25)
                  ) : (
                    <>
                      <h3>.0</h3>
                    </>
                  )}
                </div>
                <div className="add-card-item add-balance">
                  <a href="javascript:void(0)" className="p-1">
                    <i className="fa-solid fa-kip-sign fs-3" />
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
                      <p>ລາຍຮັບແຂກເຂົ້າທັງຫມົດ</p>
                      <div className="option-card-icon">
                        {loading ? (
                          loadingData(25)
                        ) : (
                          <>
                            <h3>0 ກີບ</h3>
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
                      <p>ລາຍຮັບການຈອງທັງຫມົດ</p>
                      <div className="option-card-icon">
                        {loading ? (
                          loadingData(25)
                        ) : (
                          <>
                            <h3>0 ກີບ</h3>
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
