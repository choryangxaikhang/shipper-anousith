/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  endOfMonth,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  messageWarning,
  setParams,
  startMonth,
  StatusEquiment,
} from "../../../../helper";
import {
  ADD_EQUIMENT_STOCK,
  DELETE_EQUIMENT_STOCK,
  QUERY_BILL,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import { EQUIMENT_LIST, OTHER } from "../../../../routes/app";
import DetailData from "./DetailData";
import NoData from "../../../../helper/components/NoData";
import Pagination from "../../../../helper/controllers/Pagination";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

export default function History() {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  // get query search
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [searchValue, setSearchValue] = useState();
  const [reloadData, setNewLoadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [startDate, setStartDate] = useState(startMonth());
  const [endDate, setEndDate] = useState(endOfMonth());

  const [queryStock, { data: setData, loading }] = useLazyQuery(QUERY_BILL, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);

  useEffect(() => {
    queryStock({
      variables: {
        where: {
          status: "FULL",
          billNo: searchValue ? searchValue : undefined,
          house: localHouse?._id,
          createdAt_gte: createdAt_gte(startDate),
          createdAt_lte: createdAt_lt(endDate),
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
    reloadData,
    localHouse,
    startDate,
    endDate,
  ]);

  //pageination

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

  const countData = setData?.equimentStocks?.total;
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
      <div className="justify-content-md-center" style={{ marginTop: -30 }}>
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
          >
            <button
              className="btn text-white mr-0"
              onClick={() => setNewLoadData(!reloadData)}
            >
              {loading ? loadingData(23) : <i className="icon-cycle fs-4" />}
            </button>
          </div>
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
                <FormControl fullWidth sx={{ m: 0 }}>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <i className="fa-solid fa-magnifying-glass" />
                      </InputAdornment>
                    }
                    type="search"
                    placeholder="ຄັ້ນຫາ"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </FormControl>
              </div>
            </div>
            <div className="text-center">{loading ? loadingData(25) : ""}</div>
            {setData?.billEquiment?.total > 0 ? (
              <>
                <div className="table-responsive mt-2 ">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th className="text-nowrap">ເລກໃບເບີກ</th>
                        <th className="text-nowrap">ຫົວຂໍ້</th>
                        <th className="text-end">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {setData?.billEquiment?.data?.map((data, index) => (
                        <>
                          <tr key={index} className="text-black">
                            <td>{index + 1}</td>
                            <td className="text-nowrap">
                              {data?.billNo ? data?.billNo : "-"}
                            </td>
                            <td className="text-nowrap">
                              {data?.details ? data?.details : "-"}
                            </td>
                            <td className="text-nowrap text-end">
                              <DetailData
                                billNo={data?.billNo}
                                getId={data?._id}
                              />
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
            {setData?.billEquiment?.total > 100 && (
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
    </>
  );
}
