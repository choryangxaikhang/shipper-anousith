import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_SUMMARY_BOOKING } from "./apollo";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  formatDateTime,
  getLocalHouse,
  getStaffLogin,
  loadingData,
  socketServer,
  toDayDash,
} from "../../helper";
export default function SummaryMoney() {
  const [startDate, setStartDate] = useState(toDayDash());
  const [endDate, setEndDate] = useState(toDayDash());
  const [reloadData, setReloadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const userState = getStaffLogin();
  const userData = userState?.data;
  const [fetchData, { data: bookingToday, loading }] = useLazyQuery(
    QUERY_SUMMARY_BOOKING,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [outHouseData, { data: outHouse, loadingCheckout }] = useLazyQuery(
    QUERY_SUMMARY_BOOKING,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [fetchDataCheckIn, { data: CheckInHouse, loadingCheckIn }] =
    useLazyQuery(QUERY_SUMMARY_BOOKING, {
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);

  socketServer.on("approveBooking", (res) => {
    if (res === localHouse) {
      setReloadData(!reloadData);
    }
  });

  useEffect(() => {
    let whereData = {};
    whereData = {
      house: parseInt(localHouse),
    };
    if (userData?.role === "SUPER_ADMIN") {
      delete whereData.house;
    }
    fetchData({
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
    outHouseData({
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
  }, [startDate, endDate]);
  // useEffect(() => {
  //   outHouseData({
  //     variables: {
  //       where: {
  //         house: parseInt(localHouse),
  //         checkOutAt_gte: createdAt_gte(startDate),
  //         checkOutAt_lte: createdAt_lt(endDate),
  //         status: "CHECK_OUT",
  //       },
  //       orderBy: "createdAt_DESC",
  //     },
  //   });
  // }, [startDate, endDate]);

  // useEffect(() => {
  //   fetchDataCheckIn({
  //     variables: {
  //       where: {
  //         house: parseInt(localHouse),
  //         checkInAt_gte: createdAt_gte(startDate),
  //         checkInAt_lte: createdAt_lt(endDate),
  //         status: "CHECK_IN",
  //       },
  //       orderBy: "createdAt_DESC",
  //     },
  //   });
  // }, [startDate, endDate]);

  return (
    <>
      <div className="saving-goals-section pb-15 card">
        <div className="progress-card progress-card-red mb-15">
          <div className="progress-card-info">
            <div style={{ width: 50, height: 50 }}>
              <i className="fa-solid fa-circle-down fa-2x" />
            </div>
            <div className="progress-primary-text ms-2">
              <h4>ຍອດລວມການຈອງມື້ນີ້</h4>
            </div>
          </div>
          <div className="progress-card-amount fs-4">
            {loading
              ? loadingData(25)
              : bookingToday?.summaryBookingTotal?.feeBookingAmount
              ? currency(bookingToday?.summaryBookingTotal?.feeBookingAmount)
              : 0}{" "}
            ກີບ
          </div>
        </div>

        <div className="progress-card progress-card-blue mb-15">
          <div className="progress-card-info">
            <div className="circular-progress" data-note={25}>
              <div style={{ width: 50, height: 50 }}>
                <i class="fa-solid fa-circle-left fa-2x"></i>
              </div>
            </div>
            <div className="progress-info-text">
              <h4>ຍອດລວມການເປີດຫ້ອງມື້ນີ້</h4>
            </div>
          </div>
          <div className="progress-card-amount fs-4 text-primary">
            {loadingCheckIn
              ? loadingData(25)
              : CheckInHouse?.summaryBookingTotal?.incomeKIP > 0
              ? currency(CheckInHouse?.summaryBookingTotal?.incomeKIP)
              : 0}{" "}
            ກີບ
          </div>
        </div>
        <div className="progress-card progress-card-green mb-15">
          <div className="progress-card-info">
            <div className="circular-progress" data-note={75}>
              <div style={{ width: 50, height: 50 }}>
                <i className="fa-solid fa-circle-right fa-2x" />
              </div>
            </div>
            <div className="progress-info-text ">
              <h4>ຍອດລວມແຂກອອກມື້ນີ້</h4>
            </div>
          </div>
          <div className="progress-card-amount fs-4 text-primary">
            {loadingCheckout
              ? loadingData(25)
              : currency(outHouse?.summaryBookingTotal?.feeBookingAmount)}{" "}
            ກີບ
          </div>
        </div>
      </div>
    </>
  );
}
