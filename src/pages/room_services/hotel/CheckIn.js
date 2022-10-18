import { useLazyQuery, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import Notiflix, { Loading } from "notiflix";
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  loadingData,
  loadingScreen,
  messageError,
  messageSuccess,
  toDayDash,
  valiDate,
} from "../../../helper";
import { ADD_CHECK_IN, QUERY_ROOMS, QUERY_RATE, PROMOTIONS } from "./apollo";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import "./utils/index.css";

import RegisterCustomerOfHotel from "./RegisterCustomerOfHoltel";
import { TodayTwoTone } from "@material-ui/icons";
import moment from "moment";
import SearchCustomer from "../../../helper/components/SearchCustomer";
import { Modal } from "react-bootstrap";
import { HOTEL } from "../../../routes/app";
// import "./utils/index.css";
export default function CheckIn({
  onSuccess,
  params,
  index,
  getId,
  OpenModalChange,
  CloseModalChange,
}) {
  const { history, match, location } = useReactRouter();
  let today = moment().format("YYYY-MM-DD HH:mm:ss");
  // let _time = moment().format("HH:mm:ss");
  const searchParams = new URLSearchParams(location?.search);
  const [customerId, setCustomerId] = useState("");
  const userState = getStaffLogin();
  const [localHouse, setLocalHouse] = useState("");
  const [bookingStatus, setBookingStatus] = useState("FULL");
  // query rate exchage
  const [rateExchange, setRateExchange] = useState([]);
  const [listRoom, setListRoom] = useState([]);
  const [listPromotion, setListPromotion] = useState([]);
  const [exChangeTotal, setExChangeTotal] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [countTime, setCountTime] = useState(1);

  // promotions
  const getPromotion =
    listPromotion?.percent / 100 ? listPromotion?.percent / 100 : 0;

  // show price room
  const [halfPrice, setHalfPrice] = useState(listRoom?.priceHalf);
  const [fullPrice, setFullPrice] = useState(listRoom?.priceFull);
  // get Percent
  const feeInComeFull = (fullPrice * 2) / 100;
  const feeIncomeHalf = (halfPrice * 2) / 100;

  // show exChangeTotal price room
  const [inputKIP, setInputKIP] = useState(0);
  const [inputTHB, setInputTHB] = useState(0);
  const [inputUSD, setInputUSD] = useState(0);
  const _rateTHB = rateExchange?.laoTHB || 0;
  const _rateUSD = rateExchange?.laoUSD || 0;
  // final total
  const [finalTotalKIP, setFinalTotalKIP] = useState(0);
  // const [createCheckIn] = useMutation(ADD_CHECK_IN);

  const [createCheckIn, { loading: creating }] = useMutation(ADD_CHECK_IN);

  const [fetchPromotion, { data: setPromotion, loading: LoadingData }] =
    useLazyQuery(PROMOTIONS, { fetchPolicy: "network-only" });

  const [queryRateExchange, { data: rateExchangeData, error, loading }] =
    useLazyQuery(QUERY_RATE, { fetchPolicy: "network-only" });
  const [
    queryRoom,
    { data: roomData, error: roomError, loading: roomLoading },
  ] = useLazyQuery(QUERY_ROOMS, { fetchPolicy: "network-only" });

  useEffect(() => {
    setHalfPrice(listRoom?.priceHalf * countTime * (1 - getPromotion));
    setFullPrice(listRoom?.priceFull * countTime * (1 - getPromotion));
    setInputTHB(inputTHB);
    setInputUSD(inputUSD);
    if (inputTHB) {
      setInputKIP(inputTHB * _rateTHB);
    }
    if (inputUSD) {
      setInputKIP(inputUSD * _rateUSD);
    }
    setFinalTotalKIP(inputKIP);
    if (bookingStatus === "FULL") {
      setExChangeTotal(finalTotalKIP - fullPrice);
    } else {
      setExChangeTotal(finalTotalKIP - halfPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listRoom,
    rateExchange,
    countTime,
    inputKIP,
    inputTHB,
    inputUSD,
    _rateTHB,
    _rateUSD,
    halfPrice,
    fullPrice,
    finalTotalKIP,
    exChangeTotal,
    bookingStatus,
  ]);

  //get IdHouses
  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);
  useEffect(() => {
    if (!getId) {
      return;
    }
    queryRateExchange({
      variables: {
        where: {
          house: localHouse?._id,
        },
        orderBy: "createdAt_DESC",
        limit: 1,
      },
    });
    queryRoom({
      variables: {
        where: {
          _id: getId,
        },
        limit: 1,
      },
    });
  }, [getId]);

  useEffect(() => {
    if (rateExchangeData) {
      setRateExchange(rateExchangeData.rateExchanges.data[0]);
    }
  }, [rateExchangeData]);
  useEffect(() => {
    if (roomData) {
      setListRoom(roomData.rooms.data[0]);
    }
  }, [roomData]);

  // promotions
  useEffect(() => {
    fetchPromotion({
      variables: {
        where: {
          house: getLocalHouse()?._id,
        },
      },
    });
  }, []);
  useEffect(() => {
    if (setPromotion) {
      setListPromotion(setPromotion.promotions.data[0]);
    }
  }, [setPromotion]);

  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {},
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      // if (!customerId?._id)errors.customer = "ກະລຸນາປ້ອນເບີລູດຄ້າເພື່ອຄົ້ນຫາຂໍ້ມູນ";
      // if (inputKIP == 0) {
      //   errors.incomeKIP = "ກະລຸນາປ້ອນເງິນກີບ";
      // }
      if (inputKIP <= 0) {
        errors.incomeKIP = "ກະລຸນາປ້ອນຈຳນວນເງິນຫລາຍກວ່າ 0";
      }
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      values.customer = String(customerId?._id);
      values.paidStatus = 1;
      values.status = "CHECK_IN";
      values.checkInAt = today;
      values.bookingType = String(bookingStatus);
      values.inTime = parseInt(countTime);
      values.incomeKIP = parseInt(inputKIP ? inputKIP : 0);
      values.incomeTHB = parseInt(inputTHB ? inputTHB : 0);
      values.incomeUSD = parseInt(inputUSD ? inputUSD : 0);
      values.exChange = exChangeTotal;
      if (bookingStatus === "FULL") {
        values.fee = feeInComeFull;
        values.fullPriceTotal = fullPrice;
      } else {
        values.fee = feeIncomeHalf;
        values.halfPriceTotal = halfPrice;
      }
      try {
        const { data: inputData } = await createCheckIn({
          variables: {
            data: {
              ...values,
              house: String(localHouse?._id),
              houseCode: String(localHouse?.houseCode),
              customer: String(customerId?._id ? customerId?._id : 0),
              room: String(getId),
            },
          },
        });
        if (inputData) {
          Notiflix.Loading.remove();
          messageSuccess("ເປິດຫ້ອງສຳເລັດແລ້ວ");
          setTimeout(() => {
            resetForm({ values: "" });
            history.push(`${HOTEL}/1`);
          }, 100);
          onSuccess((e) => {
            CloseModalChange();
          });
        } else {
          Notiflix.Loading.remove();
          messageError("ເປີດຫ້ອງບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        console.log(error);
      }
    },
  });
  return (
    <>
      <Modal show={OpenModalChange} size="xl">
        <Modal.Header>
          <h3>
            ເປີດຫ້ອງ {listRoom?.title_lao ? listRoom?.title_lao : "..."} /{" "}
            {listRoom?.title_eng ? listRoom?.title_eng : "..."}
          </h3>
          {/* <RegisterCustomerOfHotel /> */}
          <a
            classNameName="pull-right ms-2 "
            style={{ textDecoration: "none" }}
            onClick={() => CloseModalChange()}
          >
            <i classNameName="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        {/* <Modal.Body style={{ height: "150%" }}> */}
        <div classNameName="row bg-color">
          <div classNameName=" col-md-12">
            {/* <div classNameName="form-row mt-3 col-11 ms-2  mb-2 me-2">
              <SearchCustomer
                response={(obj) => {
                  setCustomerId(obj);
                }}
                error={errors.customer}
                roomID={getId}
              />
              <div classNameName="text-danger fs-5">{errors?.customer}</div>
            </div> */}
            <div classNameName="card-body">
              {/* <div classNameName="form-row mt-3">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#e3e0de" }}
                >
                  <InputLabel
                    classNameName="inputLabel"
                    htmlFor="outlined-adornment-amount"
                  >
                    ຊື່ ແລະ ນາມສະກຸມ {valiDate()}
                  </InputLabel>
                  <OutlinedInput
                    value={customerId?.fullName}
                    startAdornment={
                      <InputAdornment position="start">
                        <i classNameName="fa-solid fa-user text-secondary me-1" />
                      </InputAdornment>
                    }
                    label="ຊື່ ແລະ ນາມສະກຸມ"
                    disabled={true}
                    type="text"
                    error={errors.username}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div> */}
              {/* <div classNameName="form-row mt-3">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#e3e0de" }}
                >
                  <InputLabel
                    classNameName="inputLabel"
                    htmlFor="outlined-adornment-amount"
                  >
                    ເບີໂທ {valiDate()}
                  </InputLabel>
                  <OutlinedInput
                    value={customerId?.phoneNumber}
                    disabled={true}
                    startAdornment={
                      <InputAdornment position="start">
                        <i classNameName="fa-solid fa-phone text-secondary me-1" />
                      </InputAdornment>
                    }
                    type="tel"
                    label="ເບີໂທ"
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div> */}
              <div
                classNameName="btn-group btn-lg "
                style={{ marginLeft: -25, marginTop: 10 }}
              >
                <button
                  type="button"
                  classNameName={
                    bookingStatus === "HALF"
                      ? "btn btn-lg btn-primary"
                      : "btn btn-outline-primary"
                  }
                  onClick={() => {
                    setBookingStatus("HALF");
                  }}
                >
                  {bookingStatus === "HALF" ? (
                    <>
                      <i classNameName="icon-check" /> ຊົ່ວຄາວ
                    </>
                  ) : (
                    "ຊົ່ວຄາວ"
                  )}
                </button>
                <button
                  type="button"
                  classNameName={
                    bookingStatus === "FULL"
                      ? "btn btn-lg btn-primary "
                      : "btn btn-outline-primary "
                  }
                  onClick={() => {
                    setBookingStatus("FULL");
                  }}
                >
                  {bookingStatus === "FULL" ? (
                    <>
                      <i classNameName="icon-check" /> ຄ້າງຄືນ
                    </>
                  ) : (
                    "ຄ້າງຄືນ"
                  )}
                </button>
              </div>
              {bookingStatus === "FULL" ? (
                <div classNameName="form-row mt-3">
                  <FormControl fullWidth>
                    <InputLabel
                      classNameName="inputLabel text-black"
                      htmlFor="outlined-adornment-amount"
                    >
                      ຈຳນວນມື້ {valiDate()}
                    </InputLabel>
                    <OutlinedInput
                      type="number"
                      id="Number"
                      label="ຈຳນວນມື້"
                      defaultValue={countTime}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        setCountTime(e.target.value);
                      }}
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
              ) : (
                <div classNameName="form-row mt-3">
                  <FormControl fullWidth>
                    <InputLabel
                      classNameName="inputLabel text-black"
                      htmlFor="outlined-adornment-amount"
                    >
                      ຈຳນວນຊົ່ວໂມງ {valiDate()}
                    </InputLabel>
                    <OutlinedInput
                      type="number"
                      id="Number"
                      onWheel={(e) => e.target.blur()}
                      label="ຈຳນວນຊົ່ວໂມງ"
                      defaultValue={countTime}
                      onChange={(e) => {
                        setCountTime(e.target.value);
                      }}
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
              )}

              <div classNameName="form-row mt-3">
                <FormControl fullWidth>
                  <InputLabel
                    classNameName="inputLabel text-black"
                    htmlFor="outlined-adornment-amount"
                  >
                    ລາຄາຫ້ອງ
                  </InputLabel>
                  <OutlinedInput
                   sx={{backgroundColor:"#f2f7f3"}}
                    type="text"
                    disabled={true}
                    id="Number"
                    label="ລາຄາຫ້ອງ"
                    value={
                      bookingStatus === "FULL"
                        ? currency(listRoom?.priceFull * countTime) +
                          " Pro: " +
                          currency(
                            listRoom?.priceFull -
                              listRoom?.priceFull *
                                countTime *
                                (1 - getPromotion)
                          )
                        : currency(listRoom?.priceHalf * countTime) +
                          " Pro: " +
                          currency(
                            listRoom?.priceHalf -
                              listRoom?.priceHalf *
                                countTime *
                                (1 - getPromotion)
                          )
                    }
                  />
                </FormControl>
              </div>
              <div classNameName="form-row mt-3">
                <FormControl fullWidth>
                  <InputLabel
                    classNameName="inputLabel text-black"
                    htmlFor="outlined-adornment-amount"
                  >
                    ເງິນທີ່ຄວນເກັບ
                  </InputLabel>
                  <OutlinedInput
                    startAdornment={
                      <h2 classNameName="fw-bold text-success">LAK</h2>
                    }
                    type="text"
                    id="Number"
                    classNameName="fs-2 text-center text-success"
                    disabled={true}
                    value={
                      bookingStatus === "FULL"
                        ? currency(fullPrice)
                        : currency(halfPrice)
                    }
                    label="ເງິນທີ່ຄວນເກັບ"
                    sx={{backgroundColor:"#f2f7f3"}}
                  />
                </FormControl>
              </div>
              <div classNameName="form-row mt-3">
                <FormControl fullWidth>
                  <InputLabel
                    classNameName="inputLabel text-black"
                    htmlFor="outlined-adornment-amount"
                  >
                    ເງິນໄດ້ຮັບຕົວຈິງ(ກີບ)
                  </InputLabel>
                  <OutlinedInput
                    startAdornment={
                      <h2 classNameName="fw-bold text-primary">LAK</h2>
                    }
                    type="number"
                    id="Number"
                    onChange={(e) => {
                      setInputKIP(e.target.value);
                    }}
                    onWheel={(e) => e.target.blur()}
                    defaultValue={inputKIP}
                    label="ເງິນໄດ້ຮັບຕົວຈິງ(ກີບ)"
                    error={errors.incomeKIP}
                  />
                  <div classNameName="text-danger fs-5">{errors?.incomeKIP}</div>
                </FormControl>
              </div>
              <div classNameName="form-row mt-3">
                <FormControl fullWidth>
                  <InputLabel
                    classNameName="inputLabel text-black"
                    htmlFor="outlined-adornment-amount"
                  >
                    ເງິນໄດ້ຮັບຕົວຈິງ(ບາດ)
                  </InputLabel>
                  <OutlinedInput
                    startAdornment={
                      <h2 classNameName="fw-bold text-primary">THB</h2>
                    }
                    type="number"
                    id="Number"
                    onChange={(e) => {
                      setInputTHB(e.target.value);
                    }}
                    onWheel={(e) => e.target.blur()}
                    defaultValue={inputTHB}
                    label="ເງິນໄດ້ຮັບຕົວຈິງ(ບາດ)"
                  />
                </FormControl>
              </div>
              <div classNameName="form-row mt-3">
                <FormControl fullWidth>
                  <InputLabel
                    classNameName="inputLabel text-black"
                    htmlFor="outlined-adornment-amount"
                  >
                    ເງິນໄດ້ຮັບຕົວຈິງ(ໂດລ່າ)
                  </InputLabel>
                  <OutlinedInput
                    startAdornment={
                      <h2 classNameName="fw-bold text-primary">USD</h2>
                    }
                    type="number"
                    id="Number"
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setInputUSD(e.target.value);
                    }}
                    defaultValue={inputUSD}
                    label="ເງິນໄດ້ຮັບຕົວຈິງ(ໂດລ່າ)"
                  />
                </FormControl>
              </div>
              <div classNameName="form-row mt-3">
                <FormControl fullWidth>
                  <InputLabel
                    classNameName="inputLabel text-black"
                    htmlFor="outlined-adornment-amount"
                  >
                    ເງິນທອນ
                  </InputLabel>
                  <OutlinedInput
                    startAdornment={
                      <h2 classNameName="fw-bold text-danger">LAK</h2>
                    }
                    type="text"
                    id="Number"
                    classNameName="fs-2 text-center"
                    disabled={true}
                    value={currency(exChangeTotal)}
                    label="ເງິນທອນ"
                    sx={{backgroundColor:"#f2f7f3"}}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <button
            type="button"
            classNameName="btn btn-success btn-lg  mt-2 w-100"
            // onClick={() => handleSubmit()}
            onClick={() => {
              if (!creating) {
                handleSubmit();
              }
            }}
            onDoubleClick={() => {
              return false;
            }}
          >
            <i classNameName="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
        {/* </Modal.Body> */}
      </Modal>
    </>
  );
}
