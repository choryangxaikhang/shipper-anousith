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
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  toDayDash,
  valiDate,
} from "../../../../helper";
import { useFormik } from "formik";
import { s3Client } from "../../../../helper/s3Client";
import { CREATE_ACCOUNT_SUMMARY } from "./apollo";
import "./utils/index.css";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
export default function AddAccountSummary({ onSuccess }) {
  const [show, setShow] = useState(false);
  const componentRef = useRef(null);
  const [createIncome, { loading: creating }] = useMutation(
    CREATE_ACCOUNT_SUMMARY
  );
  const [startDate, setStartDate] = useState(toDayDash());
  const [localHouse, setLocalHouse] = useState("");
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  const { handleChange, errors, values, handleSubmit, resetForm, submitCount } =
    useFormik({
      initialValues: {
        incomeKIP: "",
        incomeTHB: "",
        incomeUSD: "",
        expenseKIP: "",
        expenseTHB: "",
        expenseUSD: "",
        endBalanceKIP: "",
        endBalanceTHB: "",
        endBalanceUSD: "",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.incomeKIP) {
          errors.incomeKIP = "ກະລູນາປ້ອນຈຳນວນເງິນ";
        }
        if (!values.endBalanceKIP) {
          errors.endBalanceKIP = "ກະລູນາປ້ອນຍອດຄົງເຫລືອ";
        }
        return errors;
      },
      onSubmit: async (values) => {
        loadingScreen();
        try {
          const { data: _create } = await createIncome({
            variables: {
              data: {
                incomeKIP: Number(values.incomeKIP),
                incomeTHB: Number(values.incomeTHB),
                incomeUSD: Number(values.incomeUSD),
                expenseKIP: Number(values.expenseKIP),
                expenseTHB: Number(values.expenseTHB),
                expenseUSD: Number(values.expenseUSD),
                endBalanceKIP: Number(values.endBalanceKIP),
                endBalanceTHB: Number(values.endBalanceTHB),
                endBalanceUSD: Number(values.endBalanceUSD),
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
          console.log(error);
        }
      },
    });

  return (
    <>
      <button
        className="btn btn-block me-1 text-nowrap shadow-none"
        onClick={() => setShow(true)}
      >
        <i className="fa-solid fa-circle-plus me-1"></i>ສະຫລຸບບັນຊີລາຍຮັບ
      </button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header>
          <h3>ຟອມສະຫລຸບບັນຊີລາຍຮັບ</h3>
          <a
            className="pull-right ms-2 float-end "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2" id="grad1">
          <div className="row">
            <div id="grad1"></div>
            <b className="text-black"> ລາຍຮັບທັງຫມົດ</b>
            <div className="form-row  mt-1 col-md-4">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.incomeKIP}
                    onChange={handleChange}
                    name="incomeKIP"
                    startAdornment={
                      <InputAdornment position="start">ກີບ</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.incomeKIP}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
                <div className="text-danger fs-5">{errors.incomeKIP}</div>
              </div>
            </div>
            <div className="form-row  mt-1 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.incomeTHB}
                    onChange={handleChange}
                    name="incomeTHB"
                    startAdornment={
                      <InputAdornment position="start">ບາດ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.incomeTHB}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
                <i className="text-danger fs-5">{errors.incomeTHB}</i>
              </div>
            </div>
            <div className="form-row  mt-1 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.incomeUSD}
                    onChange={handleChange}
                    name="incomeUSD"
                    startAdornment={
                      <InputAdornment position="start">ໂດລາ:</InputAdornment>
                    }
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
          <div className="row" style={{ backgroundColor: "#fcf6f2" }}>
            <label className="text-black border-top"> ລາຍຈ່າຍທັງຫມົດ</label>
            <div className="form-row  mt-1 col-md-4">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.expenseKIP}
                    onChange={handleChange}
                    name="expenseKIP"
                    startAdornment={
                      <InputAdornment position="start">ກີບ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.expenseKIP}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div>
            </div>
            <div className="form-row  mt-1 col-md-4">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.expenseTHB}
                    onChange={handleChange}
                    name="expenseTHB"
                    startAdornment={
                      <InputAdornment position="start">ບາດ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.expenseTHB}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
                <div className="text-danger fs-5">{errors.expenseTHB}</div>
              </div>
            </div>
            <div className="form-row  mt-1 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.expenseUSD}
                    onChange={handleChange}
                    name="expenseUSD"
                    startAdornment={
                      <InputAdornment position="start">ໂດລາ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.expenseUSD}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
                <div className="text-danger fs-5">{errors.expenseUSD}</div>
              </div>
            </div>
          </div>
          <br />
          <div className="row" style={{ backgroundColor: "#daffd6" }}>
            <label className="text-black border-top"> ຍອດຄົງເຫລືອທັງຫມົດ</label>
            <div className="form-row  mt-1 col-md-4  ">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.endBalanceKIP}
                    onChange={handleChange}
                    name="endBalanceKIP"
                    startAdornment={
                      <InputAdornment position="start">ກີບ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.endBalanceKIP}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
                <div className="text-danger fs-5">{errors.endBalanceKIP}</div>
              </div>
            </div>
            <div className="form-row  mt-1 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.endBalanceTHB}
                    onChange={handleChange}
                    name="endBalanceTHB"
                    startAdornment={
                      <InputAdornment position="start">ບາດ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.endBalanceTHB}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div>
            </div>
            <div className="form-row  mt-1 col-md-4 ">
              <div className="col-md-12 ms-1">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    value={values?.endBalanceUSD}
                    onChange={handleChange}
                    name="endBalanceUSD"
                    startAdornment={
                      <InputAdornment position="start">ໂດລາ:</InputAdornment>
                    }
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    error={errors.endBalanceUSD}
                    inputProps={{ maxLength: 10 }}
                  />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-row  mt-3 col-md-12">
              <div className="col-md-12">
                <FormControl
                  fullWidth
                  sx={{ m: 0, backgroundColor: "#fafafa" }}
                >
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">ວັນທີ່</InputAdornment>
                    }
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <Modal.Footer className="border-top">
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => {
              if (!creating) {
                handleSubmit();
              }
            }}
            onDoubleClick={() => {
              return false;
            }}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
