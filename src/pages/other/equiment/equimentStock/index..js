/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  endOfMonth,
  equimentStatus,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  loadingScreen,
  messageConfirm,
  messageError,
  messageSuccess,
  setParams,
  startMonth,
} from "../../../../helper";
import {
  DELETE_EQUIMENT_STOCK,
  EDIT_EQUIMENT_STOCK,
  QUERY_EQUIMENT_STOCK,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import Pagination from "../../../../helper/controllers/Pagination";
import LimitData from "../../../../helper/controllers/LimitData";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import NoData from "../../../../helper/components/NoData";
import AddData from "./AddData";
import EditData from "./EditData";
import SearchEquiment from "../../../../helper/components/SearchEquiment";
import { OTHER } from "../../../../routes/app";

export default function EquimentStock() {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  // get query search
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [searchValue, setSearchValue] = useState();
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [startDate, setStartDate] = useState(startMonth());
  const [endDate, setEndDate] = useState(endOfMonth());
  const [listEquiment, setListEquiment] = useState("");
  const [queryType, { data: setData, loading }] = useLazyQuery(
    QUERY_EQUIMENT_STOCK,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [editType] = useMutation(EDIT_EQUIMENT_STOCK);
  const [deleteEquiment] = useMutation(DELETE_EQUIMENT_STOCK);

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);
  useEffect(() => {
    queryType({
      variables: {
        where: {
          equmentID: listEquiment?._id ? listEquiment?._id : undefined,
          house: localHouse?._id,
          createdAt_gte: createdAt_gte(startDate),
          createdAt_lte: createdAt_lt(endDate),
        },
        skip: numberRow * (numberPage - 1),
        limit: numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberRow,
    searchValue,
    numberPage,
    reloadData,
    localHouse,
    startDate,
    listEquiment,
  ]);
  useEffect(() => {
    const page = query.get("page");
    const _startDate = query.get("startDate");
    const _endDate = query.get("endDate");
    setStartDate(_startDate || startMonth());
    setEndDate(_endDate || endOfMonth());
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(100);
    }
  }, [query]);
  //pageination
  const countData = setData?.equiments?.total;
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
  return (
    <>
      <div style={{ marginTop: -90 }}>
        <div id="appCapsule">
          <div className="justify-content-md-center">
            <div className="appHeader text-light border-0">
              <div style={{ flex: 1 }} className="text-left">
                <button
                  className="btn text-white"
                  onClick={() => history.push(OTHER)}
                >
                  <i className="fa fa-chevron-left fs-4" />
                </button>
              </div>
              {localHouse?.houseName ? localHouse?.houseName : "ລາຍງານຂໍ້ມູນ"}
              <div
                className="text-white pageTitle text-right text-nowrap pr-0"
                style={{ flex: 1 }}
              ></div>
            </div>
            <br />
            <br />
            <div className="option-section">
              <br />
              <div className="row col-md-12  mt-1">
                <div className="col-6">
                  <div className="option-card">
                    <input
                      type="date"
                      className=" form-control form-control-lg"
                      style={{ marginLeft: 6 }}
                      value={formatDateDash(startDate)}
                      onChange={(e) => {
                        history.push({
                          search: setParams(`startDate`, e.target.value),
                        });
                      }}
                    />
                  </div>
                </div>
                <div
                  className="col-6"
                  style={{
                    right: -10,
                  }}
                >
                  <div className="option-card">
                    <input
                      type="date"
                      className=" form-control form-control-lg"
                      value={formatDateDash(endDate)}
                      onChange={(e) => {
                        history.push({
                          search: setParams(`endDate`, e.target.value),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="section  mb-2 mt-1">
              <div className="transactions">
                <div className="row">
                  <div className="col-12 w-100">
                    <SearchEquiment
                      style={{ width: "100%" }}
                      value={listEquiment?._id}
                      onChange={(obj) => {
                        setListEquiment(obj);
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  {loading ? loadingData(25) : ""}
                </div>
                {setData?.equimentStocks?.total > 0 ? (
                  <>
                    <span className="text-center mb-2">
                      {loading ? loadingData(25) : ""}
                    </span>
                    <div className="table-responsive mt-2">
                      <table className="table table-striped  table-sm mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="text-nowrap">ຊື່ຊັບສິນ</th>
                            <th className="text-nowrap">ວັນທີ່ນຳເຂົ້າ</th>
                            <th className="text-nowrap text-end">ຈຳນວນ</th>
                            <th className="text-end">ລາຄາ/ອັນ</th>
                            <th className="text-end">ລວມ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {setData?.equimentStocks?.data?.map((data, index) => (
                            <>
                              <tr key={index} className="text-black">
                                <td>{NO(index)}</td>
                                <td>{data?.equmentID?.title}</td>
                                <td>
                                  {formatDateDash(
                                    data?.createdAt ? data?.createdAt : "-"
                                  )}
                                </td>
                                <td className="text-end">
                                  {currency(data?.inTotal ? data?.inTotal : 0)}
                                </td>
                                <td className="text-end">
                                  {currency(
                                    data?.equmentID?.price
                                      ? data?.equmentID?.price
                                      : 0
                                  )}
                                </td>
                                <td className="text-end">
                                  {currency(
                                    data?.inTotal *
                                      parseInt(data?.equmentID?.price)
                                  )}
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <NoData loading={loading} />
                )}
                {setData?.equiments?.total > 100 && (
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
            bottom: 5,
            backgroundColor: "#edece8",
          }}
          className="col-md-12 appBottomMenu"
        >
          <AddData
            onSuccess={(e) => {
              setReloadData(!reloadData);
            }}
          />
        </div>
      </div>
    </>
  );
}
