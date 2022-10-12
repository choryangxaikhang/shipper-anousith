import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  ITEM_PER_PAGE,
  currency,
  formatDateDash,
  startOfMonth,
  getLocalHouse,
  createdAt_gte,
  createdAt_lt,
  setParams,
  endOfMonth,
} from "../../../../helper";
import { QUERY_REPORT_BOOKING } from "./apollo";
import _ from "lodash";
import moment from "moment";
import Pagination from "../../../../helper/controllers/Pagination";
import SearchRoom from "../../../../helper/components/SearchRoom";
import LimitData from "../../../../helper/controllers/LimitData";
import DetailRoom from "./DetailRoom";
export default function ReportCheckOut() {
  const { history, location, match } = useReactRouter();
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const userState = getStaffLogin();
  const userInfo = userState?.data;
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [listRoom, setListRoom] = useState("");
  const [startDate, setStartDate] = useState(startOfMonth());
  const [endDate, setEndDate] = useState(endOfMonth());
  const [detailRoom, setDetailRoom] = useState();
  const [houseID, setHouseID] = useState(getLocalHouse());

  const [getReportBooking, { data: resReportBooking, loading }] = useLazyQuery(
    QUERY_REPORT_BOOKING,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    let whereData = {};
    whereData = {
      house: parseInt(houseID?._id),
    };
    if (userInfo?.role === "IT" || userInfo?.role === "SUPER_ADMIN") {
      delete whereData.house;
    }
    getReportBooking({
      variables: {
        where: {
          ...whereData,
          room: listRoom?._id ? listRoom?._id : undefined,
          status: "CHECK_OUT",
          checkOutAt_gte: createdAt_gte(startDate),
          checkOutAt_lte: createdAt_lt(endDate),
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
    listRoom,
    houseID,
    startDate,
    endDate,
  ]);

  const _sumAll = resReportBooking?.bookings?.data;
  const _sumFeeBooking = _.sumBy(_sumAll, "feeBooking");
  //pageination
  const countData = resReportBooking?.bookings?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRow); i++) {
    countPage.push(i);
  }
  const _onChangeRows = (e) => {
    let _value = e?.target?.value;
    history.push(`?rows=${_value}`);
    setNumberRow(parseInt(_value));
  };
  const NO = (index) => {
    const no = numberRow * numberPage - numberRow;
    if (numberRow > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
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
          <h3 className="page-title mb-2 text-white">
            ລາຍງານຍອດແຂກເຂົ້າທັງຫມົດ
          </h3>
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
                    <div
                      className="col-md-3"
                      style={{
                        position: "fixed",
                        zIndex: 100,
                        top: 57,
                      }}
                    >
                      <SearchRoom
                        style={{ with: "100%", heigh: "200px" }}
                        value={listRoom?._id}
                        onChange={(obj) => {
                          setListRoom(obj);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body ">
                  <div className="table-responsive">
                    <table className="table  table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ເບີຫ້ອງ</th>
                          <th className="text-nowrap text-end">ຄ່າຈອງ</th>
                          <th className="text-nowrap text-center">ວັນທີຈອງ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resReportBooking &&
                          resReportBooking?.bookings?.data?.map(
                            (item, index) => (
                              <>
                                <tr
                                  key={index}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  className="text-black"
                                  onClick={() => setDetailRoom(item?._id)}
                                >
                                  <td className="text-nowrap">{NO(index)}</td>
                                  <td className="text-nowrap">
                                    {item?.room?.title_lao
                                      ? item?.room?.title_lao
                                      : "-"}
                                  </td>
                                  <td className="text-nowrap text-end">
                                    {item?.bookDate ? (
                                      <>
                                        {item?.feeBooking
                                          ? currency(item?.feeBooking)
                                          : "0"}{" "}
                                        ກີບ
                                      </>
                                    ) : (
                                      <>
                                        {item?.incomeKIP > 0 && (
                                          <>
                                            {item?.incomeKIP
                                              ? currency(item?.incomeKIP)
                                              : "0"}{" "}
                                            ກີບ
                                            <br />
                                          </>
                                        )}
                                        {item?.incomeTHB > 0 && (
                                          <>
                                            {item?.incomeTHB
                                              ? currency(item?.incomeTHB)
                                              : "0"}{" "}
                                            ບາດ
                                            <br />
                                          </>
                                        )}
                                        {item?.incomeUSD > 0 && (
                                          <>
                                            {item?.incomeUSD
                                              ? currency(item?.incomeUSD)
                                              : "0"}{" "}
                                            ບາດ
                                          </>
                                        )}
                                      </>
                                    )}
                                  </td>
                                  <td className="text-nowrap text-center">
                                    {item?.bookDate
                                      ? formatDateDash(item?.bookDate)
                                      : ""}
                                    <i className="fa-solid fa-angle-right ms-1 text-black ms-2" />
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        <tr
                          className="bg-light"
                          style={{ backgroundColor: "#d1fc97" }}
                        >
                          <td
                            className="text-nowrap text-center"
                            colSpan={2}
                            style={{ textAlign: "center" }}
                          >
                            <h4>ຍອດລວມ</h4>
                          </td>
                          <td className="text-nowrap text-end">
                            <h4>{currency(_sumFeeBooking)} ກີບ</h4>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {resReportBooking?.bookings?.total > 100 && (
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
        <DetailRoom _id={detailRoom} onHide={() => setDetailRoom()} />
      </div>
    </>
  );
}
