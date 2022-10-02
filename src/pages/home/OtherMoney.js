/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import Imglogo from "../../img/logo-bg.png";
import cover1 from "../../img/cover.jpeg";
import { QUERY_ROOM, QUERY_SUMMARY_BOOKING } from "./apollo";
import {
  aws_url_image,
  createdAt_gte,
  createdAt_lt,
  currency,
  formatDateTime,
  loadingData,
  toDay,
} from "../../helper";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import userEvent from "@testing-library/user-event";
export default function OtherMoney() {
  const [data, setDataPayrollSummary] = useState([]);
  const [listBooking, setBookingList] = useState(0);
  const [listCheckIn, setCheckIn] = useState(0);
  const [listCheckOut, setCheckOut] = useState(0);

  const [startDate, setStartDate] = useState(toDay());
  const [endDate, setEndDate] = useState(toDay());
  const [newLoadData, setNewLoadData] = useState(false);

  const [fetchData, { data: setData, loading }] = useLazyQuery(
    QUERY_SUMMARY_BOOKING,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [fetchDataCheckOut, { data: setDataCheckout, loadingCheckout }] =
    useLazyQuery(QUERY_SUMMARY_BOOKING, {
      fetchPolicy: "cache-and-network",
    });
  const [fetchDataCheckIn, { data: setDataCheckIn, loadingCheckIn }] =
    useLazyQuery(QUERY_SUMMARY_BOOKING, {
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          bookDate_gte: createdAt_gte(startDate),
          bookDate_lte: createdAt_lt(endDate),
          status: "BOOKING",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [startDate, endDate]);
  useEffect(() => {
    fetchDataCheckOut({
      variables: {
        where: {
          checkOutAt_gte: createdAt_gte(startDate),
          checkOutAt_lte: createdAt_lt(endDate),
          status: "CHECK_OUT",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [startDate, endDate]);
  useEffect(() => {
    fetchDataCheckIn({
      variables: {
        where: {
          checkInAt_gte: createdAt_gte(startDate),
          checkInAt_gte: createdAt_lt(endDate),
          status: "CHECK_IN",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [startDate, endDate]);
  useEffect(() => {
    fetchData({
      variables: {},
    });
  }, [startDate, endDate]);

  useEffect(() => {
    setBookingList(setData?.summaryBookingTotal?.feeBookingAmount);
    setCheckIn(setDataCheckIn?.summaryBookingTotal?.feeBookingAmount);
    setCheckOut(setDataCheckout?.summaryBookingTotal?.feeBookingAmount);
  }, [setData, setDataCheckIn, setDataCheckout]);

  const getFinalBooking = listBooking / 100;
  const getFinalCheckIn = listCheckIn / 100;
  const getFinalCheckout = listCheckOut / 100;

  return (
    <>
      <div className="saving-goals-section pb-15">
        <div className="progress-card progress-card-red mb-15">
          <div className="progress-card-info">
            <div style={{ width: 50, height: 50 }}>
              Booking
            </div>
            <div className="progress-primary-text ms-2">
              <h3>ການຈອງມື້ນີ້</h3>
            </div>
          </div>
          <div className="progress-card-amount">
            {loading
              ? loadingData(25)
              : setData?.summaryBookingTotal?.feeBookingAmount > 0
              ? currency(setData?.summaryBookingTotal?.feeBookingAmount)
              : 0}
          </div>
        </div>

        <div className="progress-card progress-card-blue mb-15">
          <div className="progress-card-info">
            <div className="circular-progress" data-note={25}>
              <div style={{ width: 50, height: 50 }}>
                CheckIn
              </div>
            </div>
            <div className="progress-info-text">
              <h3>ແຂກເຂົ້າມື້ນີ້</h3>
            </div>
          </div>
          <div className="progress-card-amount">
            {loadingCheckIn
              ? loadingData(25)
              : setDataCheckIn?.summaryBookingTotal?.feeBookingAmount > 0
              ? currency(setDataCheckIn?.summaryBookingTotal?.feeBookingAmount)
              : 0}
          </div>
        </div>
        <div className="progress-card progress-card-green mb-15">
          <div className="progress-card-info">
            <div className="circular-progress" data-note={75}>
              <div style={{ width: 50, height: 50 }}>
                <i className="fa-solid fa-door-open fs-3 mt-1" />
              </div>
            </div>
            <div className="progress-info-text">
              <h3>ແຂກອອກມື້ນີ້</h3>
            </div>
          </div>
          <div className="progress-card-amount">
            {loadingCheckout
              ? loadingData(25)
              : currency(
                  setDataCheckout?.summaryBookingTotal?.feeBookingAmount
                )}
          </div>
        </div>
      </div>
    </>
  );
}
