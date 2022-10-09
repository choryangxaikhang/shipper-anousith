import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  endOfMonth,
  getLocalHouse,
  getStaffLogin,
  loadingData,
  messageConfirm,
  messageSuccess,
  newSound,
  setParams,
  socketServer,
  startOfMonth,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import { HOME_PAGE, OTHER } from "../../../routes/app";
import NoData from "../../../helper/components/NoData";
import moment from "moment";
import { QUERY_BOOKING, UPDATE_BOOKING_STATUS } from "./apollo";
import SearchRoom from "../../../helper/components/SearchRoom";
import DetailRoom from "./DetailRoom";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Pagination from "../../../helper/controllers/Pagination";
export default function BookingRequestScreen() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const query = new URLSearchParams(location?.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [reloadData, setReloadData] = useState(false);
  const [startDate, setStartDate] = useState(startOfMonth());
  const [endDate, setEndDate] = useState(endOfMonth());
  const [localHouse, setLocalHouse] = useState("");
  const [detailRoom, setDetailRoom] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS);
  // call Data
  const [queryBooking, { data: setData, loading: loading }] = useLazyQuery(
    QUERY_BOOKING,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  socketServer.on("booking", (data) => {
    setReloadData(!reloadData);
    newSound.play();
  });

  useEffect(() => {
    let whereData = {};
    whereData = {
      house: parseInt(localHouse),
    };
    if (userData?.role === "SUPER_ADMIN" || userData?.role === "IT") {
      delete whereData.house;
    }
    queryBooking({
      variables: {
        where: {
          ...whereData,
          status: "REQUESTED",
          bookDate_gte: createdAt_gte(startDate),
          bookDate_lte: createdAt_lt(endDate),
          // _id: parseInt(searchValue ? searchValue : undefined),
        },
        skip: numberRow * (numberPage - 1),
        limit: numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberPage,
    numberRow,
    searchValue,
    reloadData,
    localHouse,
    startDate,
    endDate,
  ]);
  // pagination
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
  const countPage = [];
  for (var i = 1; i <= Math.ceil(setData?.bookings?.total / numberRow); i++) {
    countPage.push(i);
  }

  // update status
  const updateStatus = async (_id, roomId, customerID, houseId) => {
    messageConfirm("ຕ້ອງການຢືນຢັນແທ້ ຫຼື ບໍ່?", async () => {
      try {
        const { data: updateData } = await updateBookingStatus({
          variables: {
            data: {
              status: "BOOKING",
              paidStatus: 1,
              room: roomId,
              customer: customerID,
              house: houseId,
              bookDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            where: {
              _id: _id,
            },
          },
        });
        if (updateData) {
          messageSuccess("ຢືນຢັນສຳເລັດ");
          setReloadData(!reloadData);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  // cancel
  const _cancel = async (_id, roomId, houseID) => {
    messageConfirm("ຕ້ອງການຍົກເລີກແທ້ ຫຼື ບໍ່?", async () => {
      try {
        const { data: updateData } = await updateBookingStatus({
          variables: {
            data: {
              status: "CANCEL",
              room: roomId,
              house: houseID,
            },
            where: {
              _id: _id,
            },
          },
        });
        if (updateData) {
          messageSuccess("ຍົກເລີກສຳເລັດແລ້ວ");
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
            ຢືນຢັນແຂກຈອງ
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
                  <TextField
                    type="date"
                    className="inputLabel"
                    variant="outlined"
                    value={startDate}
                    name="startDate"
                    onChange={(e) => {
                      history.push({
                        search: setParams(`startDate`, e.target.value),
                      });
                    }}
                    sx={{
                      m: 0,
                      width: "100%",
                      backgroundColor: "#ffff",
                    }}
                  />
                </div>
              </div>
              <div
                className="col-6"
                style={{
                  right: -15,
                }}
              >
                <div className="option-card">
                  <TextField
                    type="date"
                    className="inputLabel"
                    variant="outlined"
                    value={endDate}
                    onChange={(e) => {
                      history.push({
                        search: setParams(`endDate`, e.target.value),
                      });
                    }}
                    sx={{
                      m: 0,
                      width: "100%",
                      backgroundColor: "#ffff",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="section  mb-2 mt-1">
            <div className="transactions">
              <div className="row">
                <FormControl fullWidth sx={{ m: 0 }}>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <i className="fa-solid fa-magnifying-glass" />
                      </InputAdornment>
                    }
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    placeholder="ປ້ອນລະຫັດຈອງ"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </FormControl>
              </div>
              <div className="text-center">
                {loading ? loadingData(25) : ""}
              </div>
              {setData?.bookings?.total > 0 ? (
                <div className="listView mt-2">
                  {setData?.bookings?.data?.map((data, index) => (
                    <>
                      <b
                        className="float-end"
                        style={{ marginTop: -8, marginRight: -10 }}
                      >
                        <i
                          className="icon-x-circle text-danger"
                          onClick={(e) => {
                            _cancel(
                              data?._id,
                              data?.room?._id,
                              data?.house?._id
                            );
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
                        <div
                          className="detail col-md-10"
                          onClick={() => setDetailRoom(data?._id)}
                        >
                          <div>
                            <strong>ລະຫັດຈອງ: BH-{data?._id}</strong>
                            <strong>ຫ້ອງ: {data?.room?.title_lao}</strong>
                            <b className="text-black">
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
                            <b className="text-black">
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
                            <b className="text-black">
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
                          </div>
                        </div>
                        <div className="right">
                          <button
                            className="btn btn-primary btn-sm action-button"
                            onClick={(e) => {
                              updateStatus(
                                data?._id,
                                data?.room?._id,
                                data.customer._id,
                                data?.house?._id
                              );
                            }}
                          >
                            <i className="icon-check-circle me-1 " /> ຢືນຢັນ
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
          <DetailRoom _id={detailRoom} onHide={() => setDetailRoom()} />
        </div>
      </div>
    </div>
  );
}
