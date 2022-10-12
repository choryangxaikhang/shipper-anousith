import Notiflix, { Loading } from "notiflix";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  currency,
  formatDateTime,
  getLocalHouse,
  getLocalProvince,
  getStaffLogin,
  messageError,
  messageSuccess,
  messageWarning,
  toDayDash,
  valiDate,
} from "../../../helper";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../../helper/s3Client";
import { CREATE_ACCOUNT_SUMMARY } from "./apollo";
import { FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
export default function AddAccountSummary({ onSuccess }) {
  const [show, setShow] = useState(false);
  const componentRef = useRef(null);
  const [createIncome, { loading: creating }] = useMutation(CREATE_ACCOUNT_SUMMARY);
  const [userData, setUserData] = useState({});
  const [startDate, setStartDate] = useState(toDayDash());
  const [localHouse, setLocalHouse] = useState("")
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  const { handleChange, errors, values, handleSubmit, resetForm, submitCount } =
    useFormik({
      initialValues: {
        incomeKIP: 0,
        incomeTHB: 0,
        incomeUSD: 0,
        expenseKIP: 0,
        expenseTHB: 0,
        expenseUSD: 0,
        endBalanceKIP: 0,
        endBalanceTHB: 0,
        endBalanceUSD: 0,
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.incomeKIP) {
          errors.incomeKIP = "ກະລູນາປ້ອນຈຳນວນເງິນ";
        }
        if (!values.expenseKIP) {
          errors.expenseKIP = "ກະລູນາປ້ອນລາຍຈ່າຍ";
        }
        if (!values.endBalanceKIP) {
          errors.endBalanceKIP = "ກະລູນາປ້ອນຍອດຄົງເຫລືອ";
        }
        return errors;
      },
      onSubmit: async (values) => {
        Loading.dots();
        try {
          const { data: _create } = await createIncome({
            variables: {
              data: {
                incomeKIP: parseInt(values.incomeKIP),
                incomeTHB: parseInt(values.incomeTHB),
                incomeUSD: parseInt(values.incomeUSD),
                expenseKIP: parseInt(values.expenseKIP),
                expenseTHB: parseInt(values.expenseTHB),
                expenseUSD: parseInt(values.expenseUSD),
                endBalanceKIP: parseInt(values.endBalanceKIP),
                endBalanceTHB: parseInt(values.endBalanceTHB),
                endBalanceUSD: parseInt(values.endBalanceUSD),
                accountingDate: String(startDate),
                house: String(localHouse),
              },
            },
          });
          if (_create) {
            Notiflix.Loading.remove();
            messageSuccess("ລົງລາຍຈ່າຍສຳເລັດແລ້ວ");
            onSuccess();
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
            setShow(false);
          } else {
            Notiflix.Loading.remove();
            messageError("ລົງລາຍຈ່າຍບໍສຳເລັດ");
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
            onSuccess();
          }
        } catch (error) {
          Notiflix.Loading.remove();
          messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          onSuccess();
          console.log(error)
        }
      },
    });

  return (
    <>
      <button
        className="btn btn-success btn-block me-1 text-nowrap shadow-none"
        onClick={() => setShow(true)}
      >
        <i className="fa-solid fa-circle-plus me-1"></i>ສະຫລຸບບັນຊີລາຍຮັບ
      </button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <h3>ຟອມສະຫລຸບບັນຊີລາຍຮັບ</h3>
        </Modal.Header>
        <Modal.Body className="container">
          <div className="row">
            <div className="form-row  mt-3 col-md-4">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ລາຍຮັບທັງຫມົດ(ກີບ)  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.incomeKIP}
                    onChange={handleChange}
                    name="incomeKIP"
                    startAdornment={
                      <InputAdornment position="start">
                        <i className="fa-solid fa-kip-sign me-1"/>
                      </InputAdornment>}
                    label="ລາຍຮັບທັງຫມົດ(ກີບ)"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.incomeKIP}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.incomeKIP}</i>
              </div>
            </div>
            <div className="form-row  mt-3 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ລາຍຮັບທັງຫມົດ(ບາດ)  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.incomeTHB}
                    onChange={handleChange}
                    name="incomeTHB"
                    startAdornment={
                      <InputAdornment position="start">
                         <i className="fa-solid fa-baht-sign me-1"/>
                      </InputAdornment>}
                    label="ລາຍຮັບທັງຫມົດ(ບາດ)"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.incomeTHB}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.incomeTHB}</i>
              </div>
            </div>
            <div className="form-row  mt-3 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ລາຍຮັບທັງຫມົດ(ໂດລາ)  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.incomeUSD}
                    onChange={handleChange}
                    name="incomeUSD"
                    startAdornment={
                      <InputAdornment position="start">
                         <i className="fa-solid fa-dollar-sign me-1"/>
                      </InputAdornment>}
                    label="ລາຍຮັບທັງຫມົດ(ໂດລາ)"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.incomeUSD}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.incomeUSD}</i>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <label className="text-black border-top"> ລາຍຈ່າຍທັງຫມົດ</label>
            <div className="form-row  mt-3 col-md-4">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ກີບ {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.expenseKIP}
                    onChange={handleChange}
                    name="expenseKIP"
                    startAdornment={
                      <InputAdornment position="start">
                        <i className="fa-solid fa-kip-sign me-1"/>
                      </InputAdornment>}
                    label="ກີບ"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.expenseKIP}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.expenseKIP}</i>
              </div>
            </div>
            <div className="form-row  mt-3 col-md-4">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ບາດ  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.expenseTHB}
                    onChange={handleChange}
                    name="expenseTHB"
                    startAdornment={
                      <InputAdornment position="start">
                          <i className="fa-solid fa-baht-sign me-1"/>
                      </InputAdornment>}
                    label="ບາດ"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.expenseTHB}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.expenseTHB}</i>
              </div>
            </div>
            <div className="form-row  mt-3 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ໂດລາ  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.expenseUSD}
                    onChange={handleChange}
                    name="expenseUSD"
                    startAdornment={
                      <InputAdornment position="start">
                         <i className="fa-solid fa-dollar-sign me-1"/>
                      </InputAdornment>}
                    label="ໂດລາ"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.expenseUSD}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.expenseUSD}</i>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <label className="text-black border-top"> ຍອດຄົງເຫລືອທັງຫມົດ</label>
            <div className="form-row  mt-3 col-md-4  ">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ກີບ  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.endBalanceKIP}
                    onChange={handleChange}
                    name="endBalanceKIP"
                    startAdornment={
                      <InputAdornment position="start">
                         <i className="fa-solid fa-kip-sign me-1"/>
                      </InputAdornment>}
                    label="ກີບ"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.endBalanceKIP}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.endBalanceKIP}</i>
              </div>
            </div>
            <div className="form-row  mt-3 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ບາດ  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.endBalanceTHB}
                    onChange={handleChange}
                    name="endBalanceTHB"
                    startAdornment={
                      <InputAdornment position="start">
                          <i className="fa-solid fa-baht-sign me-1"/>
                      </InputAdornment>}
                    label="ບາດ"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.endBalanceTHB}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.endBalanceTHB}</i>
              </div>
            </div>
            <div className="form-row  mt-3 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl fullWidth sx={{ m: 0, backgroundColor: "#fafafa" }}>
                  <InputLabel htmlFor="outlined-adornment-amount">ໂດລາ  {valiDate()}</InputLabel>
                  <OutlinedInput
                    value={values?.endBalanceUSD}
                    onChange={handleChange}
                    name="endBalanceUSD"
                    startAdornment={
                      <InputAdornment position="start">
                         <i className="fa-solid fa-dollar-sign me-1"/>
                      </InputAdornment>}
                    label="ໂດລາ"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.endBalanceUSD}
                    inputProps={{ maxLength: 10 }}

                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.endBalanceUSD}</i>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <TextField
              label="ວັນທີ່" variant="outlined"
              name="accountantDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{
                m: 0, width: '100%', backgroundColor: "#fafafa"
              }}
            />
          </div>
          <hr />
          <div className="col-md-5 mt-3">
            <button
              className="btn btn-primary ms-2"
              onClick={() => {
                if (!creating) {
                  handleSubmit();
                }
              }}
              onDoubleClick={() => {
                return false;
              }}
            >
              <i className="fas fa-save me-1" />
              ບັນທຶກ
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => setShow(false)}
            >
              <i class="fa-solid fa-rectangle-xmark me-1" />
              ຍົກເລີກ
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
