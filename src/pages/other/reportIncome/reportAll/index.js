import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  currency,
  messageSuccess,
  formatDateTime,
  startOfMonth,
  getLocalHouse,
  createdAt_gte,
  createdAt_lt,
} from "../../../helper";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";

import { QUERY_REPORT_BOOKING } from "./apollo";

import {
  REPORT_ALL_BOOKING_SCREEN,
  REPORT_BOOKING_SCREEN,
} from "../../../Routes/app";
import _ from "lodash";
import DataListHouse from "../../../helper/components/DataList/DataListHouse";
import DataListRoom from "../../../helper/components/DataList/DataListRoom";
import moment from "moment";
export default function ReportAllBooking() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const userState = getStaffLogin();
  const userInfo = userState?.data;
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [getRoomValue,setGetRoomValue] = useState("");
  const [bookingDate_gte, setBookingDate_gte] = useState(startOfMonth());
  const toDay = new Date();
  const forMatDate = moment(toDay).format("YYYY-MM-DD");
  const [bookingDate_lt, setBookingDate_lt] = useState(forMatDate);
  const [houseID, setHouseID] = useState(getLocalHouse());
  const [getReportBooking, { data: resReportBooking, loading }] = useLazyQuery(
    QUERY_REPORT_BOOKING,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    getReportBooking({
      variables: {
        where: {
          room: getRoomValue ? getRoomValue : undefined,
          house: houseID?._id,
          // status: "CHECK_OUT",
          checkInAt_gte: createdAt_gte(bookingDate_gte),
          checkInAt_lte: createdAt_lt(bookingDate_lt),
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberRows,
    searchValue,
    numberPage,
    newLoadData,
    getRoomValue,
    houseID,
  ]);

  //

  const _sumAll = resReportBooking?.bookings?.data;

  const _sumFeeBooking = _.sumBy(_sumAll, "feeBooking");
  const _sumHalfPriceTotal = _.sumBy(_sumAll, "halfPriceTotal");
  const _sumFullPriceTotal = _.sumBy(_sumAll, "fullPriceTotal");
  //pageination
  const countData = resReportBooking?.bookings?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRows); i++) {
    countPage.push(i);
  }
  const NO = (index) => {
    const no = numberRows * numberPage - numberRows;
    if (numberRows > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
  };
  const _onChangeRows = (e) => {
    let _value = e?.target?.value;
    history.push(`?rows=${_value}`);
    setNumberRows(parseInt(_value));
  };

  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ລາຍງານຍອດທັງໝົດ</h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-3">
                      <DataListRoom
                        returnValue={(data) => setGetRoomValue(data)}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <div className="input-group">
                        <input
                          type="date"
                          className="form-control"
                          value={bookingDate_gte}
                          onChange={(e) => setBookingDate_gte(e.target.value)}
                        />
                        <input
                          type="date"
                          className="form-control"
                          value={bookingDate_lt}
                          onChange={(e) => setBookingDate_lt(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setNewLoadData(!newLoadData)}
                        >
                          <i className="fa fa-search" /> ຄົ້ນຫາ
                        </button>
                      </div>
                    </div>
                      <div className="row mt-4">
                          <span>{loading ? loadingData(30) : ""}</span>
                        </div>
                        <LimitData
                          numberRows={numberRows}
                          onChangeRows={_onChangeRows}
                          onSearch={(_onSearch) => {
                            setSearchValue(_onSearch);
                          }}
                          numberPage={numberPage}
                          total={countData}
                          hiddenSearch={"HideSearch"}
                          col={6}
                        />
                    </div>
                  </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ກິດຈະການ</th>
                          <th className="text-nowrap">ເບີຫ້ອງ</th>
                          <th className="text-nowrap text-center">ຄ່າຈອງ</th>
                          <th className="text-nowrap text-center">
                            ລາຄາຊົ່ວຄາວ
                          </th>
                          <th className="text-nowrap text-center">
                            ລາຄາຄ້າງຄືນ
                          </th>
                          <th className="text-nowrap text-center">ວັນທີຈອງ</th>
                          <th className="text-nowrap text-center">ວັນທີພັກ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resReportBooking &&
                          resReportBooking?.bookings?.data?.map(
                            (item, index) => (
                              <>
                                <tr key={index}>
                                  <td className="text-nowrap">{NO(index)}</td>
                                  <td className="text-nowrap">
                                    {item?.house?.houseName
                                      ? item?.house?.houseName
                                      : "-"}
                                  </td>
                                  <td className="text-nowrap">
                                    {item?.room?.title_lao
                                      ? item?.room?.title_lao
                                      : "-"}
                                  </td>
                                  <td className="text-nowrap text-end">
                                    {item?.feeBooking
                                      ? currency(item?.feeBooking)
                                      : "0"}{" "}
                                    ກີບ
                                  </td>
                                  <td className="text-nowrap text-end">
                                    {item?.halfPriceTotal
                                      ? currency(item?.halfPriceTotal)
                                      : "0"}{" "}
                                    ກີບ
                                  </td>
                                  <td className="text-nowrap text-end">
                                    {item?.fullPriceTotal
                                      ? currency(item?.fullPriceTotal)
                                      : "0"}{" "}
                                    ກີບ
                                  </td>
                                  <td className="text-nowrap text-center">
                                    {item?.bookDate
                                      ? formatDateTime(item?.bookDate)
                                      : "-"}
                                  </td>
                                  <td className="text-nowrap text-center">
                                    {item?.fullPriceTotal
                                      ? formatDateTime(item?.checkInAt)
                                      : "-"}
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        <tr>
                          <td
                            className="text-nowrap text-right"
                            colSpan="3"
                            style={{ textAlign: "center" }}
                          >
                            <h5>ຍອດລວມ</h5>
                          </td>
                          <td className="text-nowrap text-end">
                            <h5>{currency(_sumFeeBooking)} ກີບ</h5>
                          </td>
                          <td className="text-nowrap text-end">
                            <h5>{currency(_sumHalfPriceTotal)} ກີບ</h5>
                          </td>
                          <td className="text-nowrap text-end">
                            <h5>{currency(_sumFullPriceTotal)} ກີບ</h5>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <PaginationController
                    routes={REPORT_ALL_BOOKING_SCREEN}
                    numberRows={numberRows}
                    numberPage={numberPage}
                    countPage={countPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
