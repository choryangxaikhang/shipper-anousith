import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  currency,
  startOfMonth,
  getLocalHouse,
  createdAt_gte,
  createdAt_lt,
  endOfMonth,
  setParams,
} from "../../../../helper";

import { QUERY_SUM_TOTAL } from "./apollo";

import _ from "lodash";
import Export from "./Export";
import Pagination from "../../../../helper/controllers/Pagination";
import SearchRoom from "../../../../helper/components/SearchRoom";
export default function SumTotalBooking() {
  const { history, location, match } = useReactRouter();
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const userState = getStaffLogin();
  const userInfo = userState?.data;
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [getRoomValue, setGetRoomValue] = useState("");
  const [startDate, setStartDate] = useState(startOfMonth());
  const [endDate, setEndDate] = useState(endOfMonth());

  const [localHouse, setLocalHouse] = useState("");
  const [getReportBooking, { data: resReportSumBooking, loading }] =
    useLazyQuery(QUERY_SUM_TOTAL, { fetchPolicy: "cache-and-network" });
  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);

  useEffect(() => {
    let whereData = {};
    whereData = {
      house: parseInt(localHouse?._id),
    };
    if (userInfo?.role === "IT" || userInfo?.role === "SUPER_ADMIN") {
      delete whereData.house;
    }

    getReportBooking({
      variables: {
        where: {
          ...whereData,
          checkInAt_gte: createdAt_gte(startDate),
          checkInAt_lte: createdAt_lt(endDate),
        },
        skip: searchValue ? 0 : numberRow * (numberPage - 1),
        limit: searchValue ? 1000 : numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberRow,
    searchValue,
    numberPage,
    newLoadData,
    getRoomValue,
    localHouse,
    startDate,
    endDate,
  ]);
  //pageination
  const countData = resReportSumBooking?.bookingTotal?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRow); i++) {
    countPage.push(i);
  }
  const NO = (index) => {
    const no = numberRow * numberPage - numberRow;
    if (numberRow > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
  };
  const _onChangeRows = (e) => {
    let _value = e?.target?.value;
    history.push(`?rows=${_value}`);
    setNumberRow(parseInt(_value));
  };
  useEffect(() => {
    const page = query.get("page");
    const _startDate = query.get("startDate");
    const _endDate = query.get("endDate");
    setStartDate(_startDate || startOfMonth());
    setEndDate(_endDate || endOfMonth());
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(100);
    }
  }, [query]);

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
                    <div className="col-md-6 mb-2">
                      <div className="input-group">
                        <input
                          type="date"
                          className="form-control"
                          value={startDate}
                          onChange={(e) => {
                            history.push({
                              search: setParams(`startDate`, e.target.value),
                            });
                          }}
                        />
                        <input
                          type="date"
                          className="form-control"
                          value={endDate}
                          onChange={(e) => {
                            history.push({
                              search: setParams(`endDate`, e.target.value),
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <SearchRoom
                        style={{ with: "100%", heigh: "200px" }}
                        value={getRoomValue?._id}
                        onChange={(obj) => {
                          setGetRoomValue(obj);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table  table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap text-end">ຈຳນວນ</th>
                          <th className="text-nowrap text-end">
                            ລວມຍອດເງິນຈອງ
                          </th>
                          <th className="text-nowrap text-end">ຊົ່ວຄາວ</th>
                          <th className="text-nowrap text-end">ຄ້າງຄືນ</th>
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
                  {resReportSumBooking?.bookings?.total > 100 && (
                    <Pagination
                      className="mt-2"
                      pageTotal={countPage}
                      currentPage={numberPage}
                      onPageChange={(page) => {
                        history.push({
                          search: setParams(`page`, page),
                        });
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    position: "fixed",
                    bottom: 15,
                    right: 25,
                    opacity: 0.7,
                  }}
                >
                  <Export _Data={resReportSumBooking} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
