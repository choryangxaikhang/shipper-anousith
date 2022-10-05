// import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, useFormik } from "formik";
import {
  getLocalHouse,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  USER_KEY,
  valiDate,
} from "../../helper";

import { CREATE_RATE_EXCHANGE } from "./apollo";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import Notiflix from "notiflix";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

export default function AddRateExchange({ onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;

  const [show, setShow] = useState(false);
  const [addRateExchange] = useMutation(CREATE_RATE_EXCHANGE);
  const [house, setHouse] = useState({});
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);


  const { handleChange, errors, values, handleSubmit, resetForm, isDisabled } =
    useFormik({
      initialValues: {
        laoKIP: "",
        laoTHB: "",
        laoUSD: "",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.laoKIP) {
          errors.laoKIP = "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນເງິນກີບ";
        }
        if (!values.laoTHB) {
          errors.laoTHB = "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນເງິນກີບ-ບາດ";
        }
        if (!values.laoUSD) {
          errors.laoUSD = "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນເງິນກີບ-ໂດລາ";
        }
        if (!house?._id) errors.house = "ກະລຸນາເລືອກກິດຈະການ";

        return errors;
      },
      onSubmit: async (values) => {
        loadingScreen();
        try {
          const { data: inputData } = await addRateExchange({
            variables: {
              data: {
                laoKIP: parseFloat(values.laoKIP),
                laoTHB: parseFloat(values.laoTHB),
                laoUSD: parseFloat(values.laoUSD),
                house: house?._id,
              },
            },
          });
          if (inputData) {
            Notiflix.Loading.remove();
            messageSuccess("ບັນທືກຂໍ້ມູນສຳເລັດ");
            setShow(false);
            onSuccess();
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
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
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg btn-block"
        onClick={() => setShow(true)}
      >
        <i className="icon-plus-circle me-1" /> ເພີ່ມ
      </button>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        backdrop="static"
        size="xl"
        className="container-div"
      >
        <Modal.Header className="text-black">
          ເພີ່ມອັດຕາແລກປ່ຽນວັນນີ້
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label>ເລືອກກິດຈະການ {valiDate()}</label>
            <SelectLocalHouse
              style={{ width: "100%" }}
              value={house?._id}
              onChange={(obj) => {
                if (obj?._id) {
                  setHouse(obj);
                }
              }}
              ownerId={userInfo?._id}
            />
            <span className="text-danger">{errors.house}</span>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <i className="fa-sharp fa-solid fa-kip-sign" />
                  </InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="number"
                name="laoKIP"
                placeholder="ເງິນກີບ"
                value={values.laoKIP}
                onChange={handleChange}
              />
            </FormControl>
            <span className="text-danger">{errors.laoKIP}</span>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <i className="fa-sharp fa-solid fa-bitcoin-sign" />
                  </InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="number"
                name="laoTHB"
                placeholder="ກີບ-ບາດ"
                value={values.laoTHB}
                onChange={handleChange}
              />
            </FormControl>
            <span className="text-danger">{errors.laoTHB}</span>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <i className="fa-sharp fa-solid fa-dollar-sign" />
                  </InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="number"
                name="laoUSD"
                placeholder="ກີບ-ໂດລາ"
                value={values.laoUSD}
                onChange={handleChange}
              />
            </FormControl>
            <span className="text-danger">{errors.laoUSD}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => handleSubmit()}
            disabled={isDisabled}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
