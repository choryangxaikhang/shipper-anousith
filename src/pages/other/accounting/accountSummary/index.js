/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SUMMARY_ACCOUNT } from "../../../Routes/app";
import useReactRouter from "use-react-router";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  endOfMonth,
  formatDateDash,
  formatDateTime,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  setParams,
  startOfMonth,
} from "../../../helper";
import {
  UPDATE_ACCOUNT_SUMMARY,
  QUERY_SUMMARY_ACCOUNT,
} from "./apollo";
import { Table } from "react-bootstrap";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import Notiflix from "notiflix";
import _ from "lodash";
import AddAccountSummary from "./AddAccount";
import { DELETE_ACCOUNT_SUMMARY } from "./apollo";
import TotalSummaryAccount from "./TotalSummaryAccount";
import Export from "./Export";

export default function SummaryAccount() {
  const { history, location, match } = useReactRouter();
  const queryParams = new URLSearchParams(location?.search);
  const numberPage = match?.params?.page;
  const [numberRows, setNumberRows] = useState(ITEM_PER_PAGE);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [newLoadData, setNewLoadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("")
  const [fetchData, { data: extraExpenseData, loading }] = useLazyQuery(
    QUERY_SUMMARY_ACCOUNT,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    let whereDate = {}
    if (startDate && endDate) {
      whereDate = {
        accountingDate_gte: createdAt_gte(startDate),
        accountingDate_lt: createdAt_lt(endDate),
      }
    } else {
      whereDate = {}
    }
    fetchData({
      variables: {
        where: {
          house: localHouse,
          ...whereDate,
        },
        skip: numberRows * (numberPage - 1),
        limit: parseInt(numberRows),
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, numberPage, newLoadData, startDate, endDate, localHouse]);
  //pageination
  const countData = extraExpenseData?.accountingSummaries?.total;
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

  useEffect(() => {
    let _rows = queryParams.get("rows");
    const _startDate = queryParams.get("startDate");
    const _endDate = queryParams.get("endDate");
    setStartDate(_startDate);
    setEndDate(_endDate);
    setNumberRows(_rows ? parseInt(_rows) : ITEM_PER_PAGE);
  }, []);

  // get route params
  useEffect(() => {
    const _rows = queryParams.get("rows");
    if (_rows) {
      setNumberRows(_rows);
    } else {
      setNumberRows(ITEM_PER_PAGE);
    }
  }, [queryParams]);


  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ສະຫລຸບລາຍຮັບ ແລະ ລາຍຈ່າຍ</h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-6">
                      <AddAccountSummary
                        onSuccess={() => {
                          setNewLoadData(!newLoadData);
                        }}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <div className="input-group">
                        <input
                          type="date"
                          onChange={(e) => {
                            history.push({
                              search: setParams(`startDate`, e.target.value),
                            });
                          }}
                          className="form-control"
                          value={startDate}
                        />
                        <input
                          type="date"
                          value={endDate}
                          className="form-control"
                          onChange={(e) => {
                            history.push({
                              search: setParams(`endDate`, e.target.value),
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 text-center">
                      {loading ? loadingData(25) : false}
                    </div>
                  </div>
                </div>
                <TotalSummaryAccount
                  startDate={startDate}
                  endDate={endDate}
                />
                <div className="card-body">
                  <div className="table-responsive">
                    <Table className="table table-striped table-sm text-black">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ລົງວັນທີ່</th>
                          <th className="text-nowrap text-end">ລາຍຮັບ</th>
                          <th className="text-nowrap text-end">ລາຍຈ່າຍ</th>
                          <th className="text-nowrap text-end">ຍອດຄົົງເຫລືອ</th>
                          <th className="text-nowrap text-center">
                            ພະນັກງານສະຫລຸບ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {extraExpenseData &&
                          extraExpenseData?.accountingSummaries?.data?.map(
                            (data, index) => (
                              <tr
                                key={index}
                                className={
                                  data?.confirmStatus === "CONFIRMED"
                                    ? "table-success"
                                    : ""
                                }
                              >
                                <td className="text-nowrap">{NO(index)}</td>

                                <td className="text-nowrap">
                                  {data?.accountingDate
                                    ? formatDateDash(data?.accountingDate)
                                    : "-"}
                                </td>
                                <td className="text-nowrap text-end">
                                  {currency(
                                    data?.incomeKIP ? data?.incomeKIP : 0
                                  )}{" "}
                                  ກີບ <hr />
                                  {currency(
                                    data?.incomeTHB ? data?.incomeTHB : 0
                                  )}{" "}
                                  ບາດ <hr />
                                  {currency(
                                    data?.incomeUSD ? data?.incomeUSD : 0
                                  )}{" "}
                                  ໂດລາ
                                </td>
                                <td className="text-nowrap text-end">
                                  {currency(
                                    data?.expenseKIP ? data?.expenseKIP : 0
                                  )}{" "}
                                  ກີບ <hr />
                                  {currency(
                                    data?.expenseTHB ? data?.expenseTHB : 0
                                  )}{" "}
                                  ບາດ <hr />
                                  {currency(
                                    data?.expenseUSD ? data?.expenseUSD : 0
                                  )}{" "}
                                  ໂດລາ
                                </td>
                                <td className="text-nowrap text-end">
                                  {currency(
                                    data?.endBalanceKIP ? data?.endBalanceKIP : 0
                                  )}{" "}
                                  ກີບ <hr />
                                  {currency(
                                    data?.endBalanceTHB ? data?.endBalanceTHB : 0
                                  )}{" "}
                                  ບາດ <hr />
                                  {currency(
                                    data?.endBalanceUSD ? data?.endBalanceUSD : 0
                                  )}{" "}
                                  ໂດລາ
                                </td>
                                <td className="text-nowrap text-center">
                                  <span>
                                    {data?.createdBy?.firstName ? data?.createdBy?.firstName : "-" + " " +
                                      data?.createdBy?.lastName ? data?.createdBy?.lastName : "-"}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </Table>
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
                      _Data={extraExpenseData}
                    />
                  </div>
                  <PaginationController
                    routes={`${SUMMARY_ACCOUNT}`}
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
