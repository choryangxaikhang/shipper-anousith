import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
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
  loadingData,
  messageConfirm,
  messageError,
  messageSuccess,
  setParams,
  socketServer,
  startMonth,
  _month,
} from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import { OTHER } from "../../routes/app";
import NoData from "../../helper/components/NoData";
import { QUERY_RATE_EXCHANGE, DELETE_RATE_EXCHANGE } from "./apollo";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Pagination from "../../helper/controllers/Pagination";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import Notiflix from "notiflix";
import EditRateExChange from "./editRateExchange";
import AddRateExchange from "./addRateExchange";
export default function RateExChange() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const query = new URLSearchParams(location?.search);
  const [house, setHouse] = useState("");
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(50);
  const [reloadData, setReloadData] = useState(false);
  const [startDate, setStartDate] = useState(startMonth());
  const [endDate, setEndDate] = useState(endOfMonth());
  const [searchValue, setSearchValue] = useState("");
  const [deleteRateExchange] = useMutation(DELETE_RATE_EXCHANGE);
  const [queryBooking, { data: setData, loading: loading }] = useLazyQuery(
    QUERY_RATE_EXCHANGE,
    { fetchPolicy: "network-only" }
  );
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);
  useEffect(() => {
    queryBooking({
      variables: {
        where: {
          house: house?._id,
          createdAt_gte: createdAt_gte(startDate),
          createdAt_lt: createdAt_lt(endDate),
        },
        skip: numberRow * (numberPage - 1),
        limit: searchValue ? 1000 : numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberRow,
    searchValue,
    numberPage,
    reloadData,
    house,
    startDate,
    endDate,
  ]);
  // pagination
  useEffect(() => {
    const page = query.get("page");
    const _startDate = query.get("startDate");
    const _endDate = query.get("endDate");
    setStartDate(_startDate || startMonth());
    setEndDate(_endDate || endOfMonth());
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(50);
    }
  }, [query]);
  const countPage = [];
  for (
    var i = 1;
    i <= Math.ceil(setData?.rateExchanges?.total / numberRow);
    i++
  ) {
    countPage.push(i);
  }

  const _deleteRateExChange = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການລົບ ລາຍການ ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _deleteRateExchange = await deleteRateExchange({
            variables: {
              where: {
                _id: parseInt(id),
              },
            },
          });
          if (_deleteRateExchange) {
            messageSuccess("ລືບສຳເລັດ");
            setReloadData(!reloadData);
          }
        } catch (error) {
          console.log(error);
          messageError("ລືບຂໍ້ມູນບໍ່ສຳເລັດ");
        }
      },
      () => {
        return false;
      }
    );
  };

  return (
    <div style={{ marginTop: -80 }}>
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
            ຈັດການຂໍ້ມູນອັດຕາແລກປ່ຽນ
            <div
              className="text-white pageTitle text-right text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <button
                className="btn text-white mr-0"
                onClick={() => setReloadData(!reloadData)}
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
                  <SelectLocalHouse
                    style={{ width: "100%" }}
                    value={house?._id}
                    onChange={(obj) => {
                      if (obj?._id) {
                        setHouse(obj);
                      }
                    }}
                    ownerId={userData?._id}
                  />
                </div>
              </div>
              <div className="text-center">
                {loading ? loadingData(25) : ""}
              </div>
              {setData?.rateExchanges?.total > 0 ? (
                <div className="listView mt-2">
                  {setData?.rateExchanges?.data?.map((data, index) => (
                    <>
                      <b
                        className="float-end"
                        style={{ marginTop: -8, marginRight: -10 }}
                      >
                        <i
                          className="icon-trash text-danger"
                          onClick={(e) => {
                            _deleteRateExChange(data?._id);
                          }}
                          style={{ fontSize: 20 }}
                        ></i>
                      </b>

                      <a
                        href="javascript:void(0)"
                        className="item pr-0 "
                        key={index}
                        style={{ borderTop: "1px solid #ed6b0e" }}
                      >
                        <div className="detail col-md-10">
                          <div>
                            <strong>
                              ຊື່ກິດຈະການ: {data?.house?.houseName}
                            </strong>
                            <b className="text-black">
                              ກີບ: {currency(data?.laoKIP)}
                            </b>
                            <br />
                            <b className="text-black">
                              ບາດ: {currency(data?.laoTHB)}
                            </b>
                            <br />
                            <b className="text-black pt-1">
                              ໂດລາ: {currency(data?.laoUSD)}
                            </b>
                            <br />
                            <b className="text-black">
                              ວັນທີ່: {formatDateTime(data?.createdAt)}
                            </b>
                          </div>
                        </div>
                        <div className="right">
                          <button className="btn  btn-sm">
                            <EditRateExChange
                              dataValue={data}
                              onSuccess={() => {
                                setReloadData(!reloadData);
                              }}
                            />
                          </button>
                        </div>
                      </a>
                    </>
                  ))}
                </div>
              ) : (
                <NoData loading={loading} />
              )}
              {setData?.rateExchanges?.total > 50 && (
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
        <AddRateExchange
          onSuccess={(e) => {
            setReloadData(!reloadData);
          }}
        />
      </div>
    </div>
  );
}
