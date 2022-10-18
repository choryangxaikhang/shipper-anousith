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
  newSound,
  setParams,
  socketServer,
  startOfMonth,
  _month,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import { ROOM_SERVICES } from "../../../routes/app";
import NoData from "../../../helper/components/NoData";
import { QUERY_BOOKING, UPDATE_BOOKING_STATUS } from "./apollo";
import DetailRoom from "./DetailRoom";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Pagination from "../../../helper/controllers/Pagination";
export default function Booking() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const query = new URLSearchParams(location?.search);
  const rows = parseInt(query.get("rows"));
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [reloadData, setReloadData] = useState(false);
  //state month adn year
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
          status: "BOOKING",
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
  socketServer.on("approveBooking", (res) => {
    if (res === localHouse) {
      newSound.play();
      setReloadData(!reloadData);
    }
  });

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
  const updateStatus = async (_id, roomId, houseID) => {
    messageConfirm("ຕ້ອງການຢືນຢັນແທ້ ຫຼື ບໍ່?", async () => {
      try {
        const { data: updateData } = await updateBookingStatus({
          variables: {
            data: {
              status: "CHECK_IN",
              room: roomId,
              house: houseID,
            },
            where: {
              _id: _id,
            },
          },
        });
        if (updateData) {
          messageSuccess("ຢືນຢັນເປີດຫ້ອງສຳເລັດ");
          setReloadData(!reloadData);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  // cancel
  const _cancel = async (_id, roomId, houseID) => {
    // return
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
          messageSuccess("ຢືນຢັນເປີດຫ້ອງສຳເລັດ");
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
            ຢືນຢັນແຂກຈອງ
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
                  <TextField
                    type="date"
                    classNameName="inputLabel"
                    variant="outlined"
                    value={formatDateDash(startDate)}
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
                classNameName="col-6"
                style={{
                  right: -15,
                }}
              >
                <div classNameName="option-card">
                  <TextField
                    type="date"
                    classNameName="inputLabel"
                    variant="outlined"
                    value={formatDateDash(endDate)}
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
          <div classNameName="section  mb-2 mt-1">
            <div classNameName="transactions">
              <div classNameName="row">
                <FormControl fullWidth sx={{ m: 0 }}>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <i classNameName="fa-solid fa-magnifying-glass" />
                      </InputAdornment>
                    }
                    onWheel={(e) => e.target.blur()}
                    type="number"
                    placeholder="ປ້ອນລະຫັດຈອງ"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </FormControl>
              </div>
              <div classNameName="text-center">
                {loading ? loadingData(25) : ""}
              </div>
              {setData?.bookings?.total > 0 ? (
                <div classNameName="listView mt-2">
                  {setData?.bookings?.data?.map((data, index) => (
                    <>
                      <b
                        classNameName="float-end"
                        style={{ marginTop: -8, marginRight: -10 }}
                      >
                        <i
                          classNameName="icon-x-circle text-danger"
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
                        classNameName="item pr-0 "
                        key={index}
                        style={{ borderTop: "1px solid #ed6b0e" }}
                      >
                        <div
                          classNameName="detail col-md-10"
                          onClick={() => setDetailRoom(data?._id)}
                        >
                          <div>
                            <strong>ລະຫັດຈອງ: BH-{data?._id}</strong>
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
                          </div>
                        </div>
                        <div classNameName="right">
                          <button
                            classNameName="btn btn-primary btn-sm action-button"
                            onClick={(e) => {
                              updateStatus(
                                data?._id,
                                data?.room?._id,
                                data?.house?._id
                              );
                            }}
                          >
                            <i classNameName="icon-check-circle me-1 " /> ຢືນຢັນ
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
          <DetailRoom _id={detailRoom} onHide={() => setDetailRoom()} />
        </div>
      </div>
    </div>
  );
}
