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
  getLocalHouse,
  getStaffLogin,
  loadingData,
  messageConfirm,
  messageSuccess,
  setParams,
  startMonth,
} from "../../helper";
import { ROOM_SERVICES } from "../../routes/app";
import NoData from "../../helper/components/NoData";
import { QUERY_BOOKING, UPDATE_BOOKING_STATUS } from "./hotel/apollo";
import SearchRoom from "../../helper/components/SearchRoom";
import { TextField } from "@mui/material";
import Pagination from "../../helper/controllers/Pagination";
export default function PeopleCheckout() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const query = new URLSearchParams(location?.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [reloadData, setReloadData] = useState(false);
  const [startDate, setStartDate] = useState(startMonth());
  const [endDate, setEndDate] = useState(endOfMonth());
  const [localHouse, setLocalHouse] = useState("");
  const [listRoom, setListRoom] = useState();

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS);
  // call Data
  const [fetchDataRoom, { data: setData, loading: loading }] = useLazyQuery(
    QUERY_BOOKING,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    let whereData = {};
    whereData = {
      house: parseInt(localHouse),
    };
    if (userData?.role === "SUPER_ADMIN" || userData?.role === "IT") {
      delete whereData.house;
    }
    fetchDataRoom({
      variables: {
        where: {
          ...whereData,
          room: listRoom?._id ? listRoom?._id : undefined,
          status: "CHECK_IN",
          checkInAt_gte: createdAt_gte(startDate),
          checkInAt_lte: createdAt_lt(endDate),
        },
        skip: listRoom ? 0 : numberRow * (numberPage - 1),
        limit: listRoom ? 1000 : numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse, listRoom, reloadData, startDate, endDate]);

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
      setNumberRow(100);
    }
  }, [query]);
  const countPage = [];
  for (var i = 1; i <= Math.ceil(setData?.bookings?.total / numberRow); i++) {
    countPage.push(i);
  }

  // update status
  const updateStatus = async (_id, roomId) => {
    messageConfirm("ຕ້ອງການຢືນຢັນແທ້ ຫຼື ບໍ່?", async () => {
      try {
        const { data: updateData } = await updateBookingStatus({
          variables: {
            data: {
              status: "CHECK_OUT",
              room: roomId,
            },
            where: {
              _id: _id,
            },
          },
        });
        if (updateData) {
          messageSuccess("ຢືນຢັນແຂກອອກສຳເລັດ");
          setReloadData(!reloadData);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div style={{ marginTop: -80 }}>
      <div id="appCapsule">
        <div classNameName="justify-content-md-center">
          <div classNameName="appHeader text-light border-0">
            <div style={{ flex: 1 }} classNameName="text-left">
              <button
                classNameName="btn text-white"
                onClick={() => history.push(ROOM_SERVICES)}
              >
                <i classNameName="fa fa-chevron-left fs-4" />
              </button>
            </div>
            ຢືນຢັນແຂກອອກຫ້ອງ
            <div
              classNameName="text-white pageTitle text-right text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <button
                classNameName="btn text-white mr-0"
                onClick={() => setReloadData(!reloadData)}
              >
                {loading ? loadingData(23) : <i classNameName="icon-cycle fs-4" />}
              </button>
            </div>
          </div>
          <br />
          <br />
          <div classNameName="option-section">
            <br />
            <div classNameName="row col-md-12  mt-1">
              <div classNameName="col-6">
                <div classNameName="option-card">
                  <input
                    type="date"
                    classNameName=" form-control form-control-lg"
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
                classNameName="col-6"
                style={{
                  right: -10,
                }}
              >
                <div classNameName="option-card">
                  <input
                    type="date"
                    classNameName=" form-control form-control-lg"
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
          <div classNameName="section  mb-2 mt-1">
            <div classNameName="transactions">
              <div classNameName="row">
                <div classNameName="col-md-12 w-100">
                  <SearchRoom
                    style={{ with: "100%", heigh: "200px" }}
                    value={listRoom?._id}
                    onChange={(obj) => {
                      setListRoom(obj);
                    }}
                  />
                </div>
              </div>
              <div classNameName="text-center">
                {loading ? loadingData(25) : ""}
              </div>
              {setData?.bookings?.total > 0 ? (
                <div classNameName="listView mt-1">
                  {setData?.bookings?.data?.map((data, index) => (
                    <>
                      <a
                        href="javascript:void(0)"
                        classNameName="item pr-0 "
                        key={index}
                        style={{ borderTop: "1px solid #ed6b0e" }}
                      >
                        <div classNameName="detail col-md-10">
                          <div>
                            <strong>ຫ້ອງ: {data?.room?.title_lao}</strong>
                            <b classNameName="text-black">
                              ລາຄາ:{" "}
                              {data?.room?.priceFull
                                ? currency(data?.room?.priceFull)
                                : 0}{" "}
                              /
                              {data?.room?.priceHalf
                                ? currency(data?.room?.priceHalf)
                                : 0}{" "}
                            </b>
                            <br />
                            <b classNameName="text-black">
                              ເຂົ້າພັກ:{" "}
                              {data?.bookingType === "FULL" ? (
                                <>
                                  {currency(data?.inTime ? data?.inTime : 0)}{" "}
                                  ຄືນ
                                </>
                              ) : (
                                <>
                                  {currency(data?.inTime ? data?.inTime : 0)}{" "}
                                  ຊົ່ວໂມງ
                                </>
                              )}
                            </b>
                            <br />
                            <b classNameName="text-black">
                              ເກັບໄດ້:{" "}
                              {data?.fullPriceTotal > 0 ? (
                                <>
                                  {data?.fullPriceTotal
                                    ? currency(data?.fullPriceTotal)
                                    : 0}{" "}
                                </>
                              ) : (
                                <>
                                  {data?.halfPriceTotal
                                    ? currency(data?.halfPriceTotal)
                                    : 0}{" "}
                                </>
                              )}
                            </b>
                            <br />
                            <b classNameName="text-black">
                              ເງິນທອນ:{" "}
                              {currency(data?.exChange ? data?.exChange : 0)}{" "}
                              ກີບ
                            </b>
                          </div>
                        </div>
                        <div classNameName="">
                          <button
                            classNameName="btn btn-primary btn-sm btn-block"
                            onClick={(e) => {
                              updateStatus(data?._id, data?.room?._id);
                            }}
                            onDoubleClick={() => {
                              return false;
                            }}
                            style={{ marginRight: 50 }}
                          >
                            <i classNameName="icon-check-circle mr-1" /> ຢືນຢັນອອກ
                          </button>
                        </div>
                      </a>
                    </>
                  ))}
                </div>
              ) : (
                <NoData loading={loading} />
              )}
              {setData?.bookings?.total > 100 && (
                <Pagination
                  classNameName="mt-2"
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
    </div>
  );
}
