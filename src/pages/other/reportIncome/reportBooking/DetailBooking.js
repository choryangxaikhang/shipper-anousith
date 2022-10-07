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
} from "../../../helper";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";
import { QUERY_REPORT_BOOKING } from "./apollo";

import { REPORT_ALL_BOOKING_SCREEN, DETAIL_BOOKING } from "../../../Routes/app";
import _ from "lodash";
import DataListHouse from "../../../helper/components/DataList/DataListHouse";
export default function DetailBooking() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  const query = new URLSearchParams(location.search);
  const getIdBooking = match?.params?._id;
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const userState = getStaffLogin();
  const userInfo = userState?.data;
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [getRoomValue, setGetRoomValue] = useState("");
  const [getHouseValue, setGetHouseValue] = useState("");

  const [getReportBooking, { data: resReportBooking, loading }] = useLazyQuery(
    QUERY_REPORT_BOOKING,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    if (!getIdBooking) {
      return
    }
    getReportBooking({
      variables: {
        where: {
          _id: String(getIdBooking),
          status: "BOOKING",
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
    getHouseValue,
  ]);

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
          <h3 className="page-title mb-2 text-white">ປະຫວັດລາຍລະອຽດ</h3>
        </div>
      </div>

      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-2">
                      <button
                        onClick={() => history.goBack()}
                        className="btn btn-light"
                      ><i className="fa-solid fa-arrow-left-long"></i></button>
                    </div>

                    <div className="col-md-1">
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
                    />
                  </div>
                </div>
                <div className="card-body ">
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ກິດຈະການ</th>
                          <th className="text-nowrap">ເບີຫ້ອງ</th>
                          <th className="text-nowrap text-center">ຄ່າຈອງ</th>
                          <th className="text-nowrap text-center">ວັນທີຈອງ</th>
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
                                  <td className="text-nowrap text-center">
                                    {item?.bookDate
                                      ? formatDateTime(item?.bookDate)
                                      : ""}
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        <tr>
                          <td
                            className="text-nowrap text-center"
                            colSpan="3"
                            style={{ textAlign: "center" }}
                          >
                            <h5>ຍອດລວມ</h5>
                          </td>
                          <td className="text-nowrap text-end">
                            <h5>{currency(_sumFeeBooking)} ກີບ</h5>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <PaginationController
                    routes={DETAIL_BOOKING}
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
