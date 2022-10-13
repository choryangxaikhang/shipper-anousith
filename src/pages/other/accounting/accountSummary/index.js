/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SUMMARY_ACCOUNT } from "../../../../routes/app";
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
} from "../../../../helper";
import { UPDATE_ACCOUNT_SUMMARY, QUERY_SUMMARY_ACCOUNT } from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import _ from "lodash";
import AddAccountSummary from "./AddAccount";
import { DELETE_ACCOUNT_SUMMARY } from "./apollo";
import TotalSummaryAccount from "./TotalSummaryAccount";
import Export from "./Export";
import Pagination from "../../../../helper/controllers/Pagination";

export default function SummaryAccount() {
  const { history, location, match } = useReactRouter();
  const queryParams = new URLSearchParams(location?.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [newLoadData, setNewLoadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [fetchData, { data: extraExpenseData, loading }] = useLazyQuery(
    QUERY_SUMMARY_ACCOUNT,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    let whereDate = {};
    if (startDate && endDate) {
      whereDate = {
        createdAt_gte: createdAt_gte(startDate),
        createdAt_lt: createdAt_lt(endDate),
      };
    } else {
      whereDate = {};
    }
    fetchData({
      variables: {
        where: {
          house: localHouse,
          ...whereDate,
        },
        skip: numberRow * (numberPage - 1),
        limit: parseInt(numberRow),
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRow, numberPage, newLoadData, startDate, endDate, localHouse]);
  //pageination
  const countData = extraExpenseData?.accountingSummaries?.total;
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

  useEffect(() => {
    let page = queryParams.get("page");
    const _startDate = queryParams.get("startDate");
    const _endDate = queryParams.get("endDate");
    setStartDate(_startDate);
    setEndDate(_endDate);
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(100);
    }
  }, [queryParams]);

  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">
            ສະຫລຸບລາຍຮັບ ແລະ ລາຍຈ່າຍ
          </h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="p-2">
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
              <TotalSummaryAccount startDate={startDate} endDate={endDate} />
              <div className="card-body">
                <div className="table-responsive">
                  <Table className="table  table-sm text-black">
                    <thead>
                      <tr>
                        <th className="text-nowrap">ລຳດັບ</th>
                        <th className="text-nowrap">ລົງວັນທີ່</th>
                        <th className="text-nowrap text-end">ລາຍຮັບ</th>
                        <th className="text-nowrap text-end">ລາຍຈ່າຍ</th>
                        <th className="text-nowrap text-end">ຍອດຄົງເຫລືອ</th>
                        <th className="text-nowrap text-center">
                          ພະນັກງານສະຫລຸບ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {extraExpenseData?.accountingSummaries?.data?.map(
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
                              {data?.createdAt
                                ? formatDateDash(data?.createdAt)
                                : "-"}
                            </td>
                            <td className="text-nowrap text-end fs-5">
                              <div>
                                {currency(
                                  data?.incomeKIP ? data?.incomeKIP : 0
                                )}{" "}
                                ກີບ
                              </div>
                              <div className=" mt-1">
                                {currency(
                                  data?.incomeTHB ? data?.incomeTHB : 0
                                )}{" "}
                                ບາດ
                              </div>
                              <div className=" mt-1">
                                {currency(
                                  data?.incomeUSD ? data?.incomeUSD : 0
                                )}{" "}
                                ໂດລາ
                              </div>
                            </td>
                            <td className="text-nowrap text-end fs-5">
                              <div>
                                {currency(
                                  data?.expenseKIP ? data?.expenseKIP : 0
                                )}{" "}
                                ກີບ
                              </div>
                              <div />
                              <div className="mt-1 ">
                                {currency(
                                  data?.expenseTHB ? data?.expenseTHB : 0
                                )}{" "}
                                ບາດ
                              </div>
                              <div className=" mt-1">
                                {currency(
                                  data?.expenseUSD ? data?.expenseUSD : 0
                                )}{" "}
                                ໂດລາ
                              </div>
                            </td>
                            <td className="text-nowrap text-end fs-5">
                              <div className="  ">
                                {currency(
                                  data?.endBalanceKIP ? data?.endBalanceKIP : 0
                                )}{" "}
                                ກີບ
                              </div>
                              <div className=" mt-1">
                                {currency(
                                  data?.endBalanceTHB ? data?.endBalanceTHB : 0
                                )}{" "}
                                ບາດ
                              </div>
                              <div className=" mt-1">
                                {currency(
                                  data?.endBalanceUSD ? data?.endBalanceUSD : 0
                                )}{" "}
                                ໂດລາ
                              </div>
                            </td>
                            <td className="text-nowrap text-center">
                              <span>
                                {data?.createdBy?.firstName
                                  ? data?.createdBy?.firstName
                                  : "-" + " " + data?.createdBy?.lastName
                                  ? data?.createdBy?.lastName
                                  : "-"}
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
                    bottom: 50,
                    right: 25,
                    opacity: 0.7,
                  }}
                >
                  <Export _Data={extraExpenseData} />
                </div>
                {extraExpenseData?.accountingSummaries?.data?.total > 100 && (
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
            </div>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            backgroundColor: "#edece8",
          }}
          className="col-md-12 appBottomMenu"
        >
          <AddAccountSummary
            onSuccess={() => {
              setNewLoadData(!newLoadData);
            }}
          />
        </div>
      </div>
    </>
  );
}
