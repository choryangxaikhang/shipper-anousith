/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  endOfMonth,
  formatDateTime,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  setParams,
  startMonth,
  startOfMonth,
} from "../../../helper";
import {
  DELETE_EXTRA_EXPENSE,
  QUERY_EXTRA_EXPENSE,
  UPDATE_EXTRA_EXPENSE,
  QUERY_SUMMARY_EXPENSE,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import _ from "lodash";
import Pagination from "../../../helper/controllers/Pagination";
import AddIncome from "./widgets/AddIncome";
import Export from "./Export";
import Expenses from "./widgets/Expeses";
import PreviewImage from "./previewImage";
import EditAddIncome from "./widgets/EditAddIncome";
export default function ListAllExpenses() {
  const { history, location, match } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const queryParams = new URLSearchParams(location?.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [startDate, setStartDate] = useState(startOfMonth());
  const [endDate, setEndDate] = useState(endOfMonth());
  const [newLoadData, setNewLoadData] = useState(false);
  const [listHouses, setListHouses] = useState({});
  const [localHouse, setLocalHouse] = useState("");
  const [fetchData, { data: extraExpenseData, loading }] = useLazyQuery(
    QUERY_EXTRA_EXPENSE,
    { fetchPolicy: "cache-and-network" }
  );

  const [querySummaryExpense, { data: summaryExpenseData }] = useLazyQuery(
    QUERY_SUMMARY_EXPENSE,
    { fetchPolicy: "cache-and-network" }
  );
  // update extraExpenses
  const [updateExtraExpense] = useMutation(UPDATE_EXTRA_EXPENSE);
  const [deleteExtraExpense] = useMutation(DELETE_EXTRA_EXPENSE);
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    let whereDate = {};
    if (startDate && endDate) {
      whereDate = {
        accountantDate_gte: createdAt_gte(startDate),
        accountantDate_lte: createdAt_lt(endDate),
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
    querySummaryExpense({
      variables: {
        where: {
          house: localHouse,
          ...whereDate,
        },
      },
    });
  }, [numberRow, numberPage, localHouse, newLoadData, startDate, endDate]);
  useEffect(() => {
    const page = queryParams.get("page");
    const _startDate = queryParams.get("startDate");
    const _endDate = queryParams.get("endDate");
    setStartDate(_startDate || startMonth());
    setEndDate(_endDate || endOfMonth());
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(100);
    }
  }, [queryParams]);
  // summay Total

  // const sumAllMoney = {
  //   totalIncome: _.sumBy( summaryExpenseData?.summaryExtraExpense?.data,"totalIncome" ),
  //   totalExpense: _.sumBy( summaryExpenseData?.summaryExtraExpense?.data,"totalExpense" ),
  //   totalEndBalance: _.sumBy( summaryExpenseData?.summaryExtraExpense?.data,"totalEndBalance" ),

  // };
  const Income = summaryExpenseData?.summaryExtraExpense?.totalIncome;
  const exPres = summaryExpenseData?.summaryExtraExpense?.totalExpense;
  const finalMoney = Income - exPres;

  //pageination
  const countData = extraExpenseData?.extraExpenses?.total;
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

  // get route params
  useEffect(() => {
    const _rows = queryParams.get("rows");
    if (_rows) {
      setNumberRow(_rows);
    } else {
      setNumberRow(ITEM_PER_PAGE);
    }
  }, [queryParams]);

  const _handleConfirm = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການຢືນຢັນລາຍການນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const onConfirmed = await updateExtraExpense({
            variables: {
              where: {
                id_list: parseInt(id),
              },
              data: {
                confirmStatus: "CONFIRMED",
              },
            },
          });
          if (onConfirmed) {
            messageSuccess("ດຳເນີນການສຳເລັດ");
            setNewLoadData(!newLoadData);
          }
        } catch (error) {
          messageError("ດຳເນີນການບໍ່ສຳເລັດ");
        }
      },
      () => {
        return false;
      }
    );
  };
  const _handleDelete = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການລຶບລາຍການນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const onDeleted = await deleteExtraExpense({
            variables: {
              where: {
                id_list: parseInt(id),
              },
            },
          });
          if (onDeleted) {
            messageSuccess("ລຶບການສຳເລັດ");
            setNewLoadData(!newLoadData);
          }
        } catch (error) {
          messageError("ລຶບບໍ່ສຳເລັດ");
        }
      },
      () => {
        return false;
      }
    );
  };
  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">
            ສະຫລູບລາຍຮັບ ແລະ ລາຍຈ່າຍ
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
                    <div className="col-md-4 ">
                      {/* <AddIncome
                        onSuccess={() => {
                          setNewLoadData(!newLoadData);
                        }}
                      />
                      <Expenses
                        getData={extraExpenseData}
                        onSuccess={() => {
                          setNewLoadData(!newLoadData);
                        }}
                      /> */}
                      dff
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
                <div className="card-body">
                  <div className="card-group mb-2">
                    <div
                      className="card"
                      style={{
                        borderRight: "1px solid #ccc",
                        borderLeft: "1px solid #ccc",
                      }}
                    >
                      <div className="card-body text-center">
                        <h5 className="card-title">ຍອດຍົກມາ</h5>
                        <h2>
                          {summaryExpenseData?.summaryExtraExpense?.totalIncome
                            ? currency(
                                summaryExpenseData?.summaryExtraExpense
                                  ?.totalIncome
                              )
                            : 0}{" "}
                          ກີບ
                        </h2>
                      </div>
                    </div>
                    <div
                      className="card"
                      style={{ borderRight: "1px solid #ccc" }}
                    >
                      <div className="card-body text-center">
                        <h5 className="card-title">ຍອດຈ່າຍອອກ</h5>
                        <h2>
                          {summaryExpenseData?.summaryExtraExpense?.totalExpense
                            ? currency(
                                summaryExpenseData?.summaryExtraExpense
                                  ?.totalExpense
                              )
                            : 0}{" "}
                          ກີບ
                        </h2>
                      </div>
                    </div>
                    <div
                      className="card"
                      style={{ borderRight: "1px solid #ccc" }}
                    >
                      <div className="card-body text-center">
                        <h5 className="card-title">ຍອດຄົງເຫຼືອ</h5>
                        <h2>{currency(finalMoney ? finalMoney : 0)} ກີບ</h2>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <Table className="table table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ລົງວັນທີ່</th>
                          <th>ເນື້ອໃນລາຍການ</th>
                          <th className="text-nowrap text-right">ລາຍຮັບ</th>
                          <th className="text-nowrap text-right">ລາຍຈ່າຍ</th>
                          <th className="text-nowrap text-right">
                            ຍອດຄົງເຫຼືອ
                          </th>
                          <th className="text-nowrap text-center">
                            ຜູ້ອານຸມັດ/ວັນທີອານຸມັດ
                          </th>
                          <th className="text-nowrap text-start">ຈັດການ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extraExpenseData?.extraExpenses?.data?.map(
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
                                {data?.accountantDate
                                  ? formatDateTime(data?.accountantDate)
                                  : "-"}
                              </td>
                              <td>{data?.detail ? data?.detail : "-"}</td>
                              <td className="text-nowrap text-right">
                                {currency(
                                  data?.incomeKIP ? data?.incomeKIP : 0
                                )}{" "}
                                ກີບ
                              </td>
                              <td className="text-nowrap text-right">
                                {currency(
                                  data?.expenseKIP ? data?.expenseKIP : 0
                                )}{" "}
                                ກີບ
                              </td>
                              <td className="text-nowrap text-right">
                                {currency(
                                  data?.endBalanceKIP ? data?.endBalanceKIP : 0
                                )}{" "}
                                ກີບ
                              </td>
                              <td className="text-nowrap text-center">
                                {data?.confirmStatus === "CONFIRMED" ? (
                                  <span>
                                    {data?.confirmBy?.firstName +
                                      " " +
                                      data?.confirmBy?.lastName}
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() =>
                                        _handleConfirm(data?.id_list)
                                      }
                                      disabled={
                                        userData?.role === "ADMIN" ||
                                        userData?.role === "SUPER_ADMIN"
                                          ? false
                                          : true
                                      }
                                    >
                                      <i className="icon-check-circle" />{" "}
                                      ອານຸມັດ
                                    </button>
                                    <hr className="m-1" />
                                    {data?.confirmDate
                                      ? formatDateTime(data?.confirmDate)
                                      : "--/--/----"}
                                  </>
                                )}
                              </td>
                              <td className="text-nowrap text-end">
                                <div className="btn-group">
                                  <PreviewImage
                                    image={
                                      data?.fileUpload ? data?.fileUpload : ""
                                    }
                                  />

                                  <EditAddIncome _data={data} />
                                  <button
                                    className="btn btn-sm  ms-2"
                                    onClick={() => _handleDelete(data?.id_list)}
                                  >
                                    <i className="icon-trash text-danger" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                  {extraExpenseData?.extraExpenses?.data?.total > 100 && (
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
                  <div
                    style={{
                      position: "fixed",
                      bottom: 5,
                      right: 2,
                    }}
                    className="col-md-12"
                  >
                    <AddIncome />
                    <Expenses />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
