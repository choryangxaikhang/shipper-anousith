import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  ITEM_PER_PAGE,
  currency,
  startOfMonth,
  getLocalHouse,
  createdAt_gte,
  createdAt_lt,
} from "../../../helper";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";

import { QUERY_SUM_TOTAL } from "./apollo";

import _ from "lodash";
import DataListRoom from "../../../helper/components/DataList/DataListRoom";
import moment from "moment";
import { SUM_TOTAL_BOOKING_SCREEN } from "../../../Routes/app";
import Export from "./Export";
export default function SumTotalBooking() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const userState = getStaffLogin();
  const userInfo = userState?.data;
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [getRoomValue, setGetRoomValue] = useState("");
  const [getHouseValue, setGetHouseValue] = useState("");
  const [bookingDate_gte, setBookingDate_gte] = useState(startOfMonth());
  const toDay = new Date();
  const forMatDate = moment(toDay).format("YYYY-MM-DD");
  const [bookingDate_lt, setBookingDate_lt] = useState(forMatDate);
  const [localHouse, setLocalHouse] = useState("");
  const [getReportBooking, { data: resReportSumBooking, loading }] =
    useLazyQuery(QUERY_SUM_TOTAL, { fetchPolicy: "cache-and-network" });
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);

  useEffect(() => {
    getReportBooking({
      variables: {
        where: {
          // room: getRoomValue ? getRoomValue : undefined,
          // house: localHouse,
          status: undefined,
          // checkInAt_gte: createdAt_gte(bookingDate_gte),
          // checkInAt_lte: createdAt_lt(bookingDate_lt),
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
    localHouse
  ]);
  //pageination
  const countData = resReportSumBooking?.bookingTotal?.total;
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
          <h3 className="page-title mb-2 text-white">ລາຍງານຍອດສະຫລຸບ</h3>
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
                    <div className="row pt-4 pe-0">
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
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap text-center">
                            ລວມຍອດຄັ້ງຈອງ
                          </th>
                          <th className="text-nowrap text-center">
                            ລວມຍອດເງິນຈອງ
                          </th>
                          <th className="text-nowrap text-center">
                            ລວມຍອດເງິນຊົ່ວຄາວ
                          </th>
                          <th className="text-nowrap text-center">
                            ລວມຍອດເງິນຄ້າງຄືນ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-nowrap">1</td>
                          <td className="text-nowrap text-end">
                            {resReportSumBooking?.summaryBookingTotal
                              ?.bookingTotal
                              ? currency(
                                resReportSumBooking?.summaryBookingTotal
                                  ?.bookingTotal
                              )
                              : 0}{" "}
                            ຄັ້ງ
                          </td>
                          <td className="text-nowrap text-end">
                            {resReportSumBooking?.summaryBookingTotal
                              ?.feeBookingAmount
                              ? currency(
                                resReportSumBooking?.summaryBookingTotal
                                  ?.feeBookingAmount
                              )
                              : 0}{" "}
                            ກີບ
                          </td>
                          <td className="text-nowrap text-end">
                            {resReportSumBooking?.summaryBookingTotal
                              ?.halfPriceTotal
                              ? currency(
                                resReportSumBooking?.summaryBookingTotal
                                  ?.halfPriceTotal
                              )
                              : 0}{" "}
                            ກີບ
                          </td>
                          <td className="text-nowrap text-end">
                            {resReportSumBooking?.summaryBookingTotal
                              ?.fullPriceTotal
                              ? currency(
                                resReportSumBooking?.summaryBookingTotal
                                  ?.fullPriceTotal
                              )
                              : 0}{" "}
                            ກີບ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <PaginationController
                    routes={SUM_TOTAL_BOOKING_SCREEN}
                    numberRows={numberRows}
                    numberPage={numberPage}
                    countPage={countPage}
                  />
                </div>
                <div
                  style={{
                    position: "fixed",
                    bottom: 15,
                    right: 25,
                    opacity: 0.7,
                  }}
                >
                  <Export
                    _Data={resReportSumBooking}
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
