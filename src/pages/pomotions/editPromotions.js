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
  valiDate,
} from "../../helper";

import { UPDATE_PROMOTION } from "./apollo";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import Notiflix from "notiflix";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

export default function EditPromotions({ dataValue, onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;

  const [show, setShow] = useState(false);
  const [updateData] = useMutation(UPDATE_PROMOTION);
  const [house, setHouse] = useState({});
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);

  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    setFieldValue,
    resetForm,
    isDisabled,
  } = useFormik({
    initialValues: {
      title: "",
      percent: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "ກະລຸນາປ້ອນເນື່ອໃນ";
      }
      if (!values.percent) {
        errors.percent = "ກະລຸນາປ້ອນເປີເຊັນສ່ວນຫລຸດ";
      }
      if (!house?._id) errors.house = "ກະລຸນາເລືອກກິດຈະການ";

      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: inputData } = await updateData({
          variables: {
            data: {
              title: String(values.title),
              percent: parseInt(values.percent),
              status: parseInt(1),
              house: house?._id,
            },
            where: {
              _id: dataValue?._id,
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

  useEffect(() => {
    if (!show) {
      return;
    }
    setFieldValue("title", dataValue?.title ? dataValue?.title : "", false);
    setFieldValue(
      "percent",
      dataValue?.percent ? dataValue?.percent : 0,
      false
    );
    setHouse(dataValue?.house);
  }, [dataValue, show]);

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg btn-block"
        onClick={() => setShow(true)}
      >
        <i className="fas fa-edit" />
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ແກ້ໄຂໂປຣໂມຊັ່ນ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
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
                    <i className="fa-solid fa-pen" />
                  </InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="text"
                name="title"
                placeholder="ເນື້ອໃນໂປຮໂມຊັ່ນ"
                value={values.title}
                onChange={handleChange}
              />
            </FormControl>
            <span className="text-danger">{errors.title}</span>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                   ສ່ວນຫລຸດ <i className="fa-solid fa-percent ms-1" />:
                  </InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="number"
                name="percent"
                placeholder="ສ່ວນຫລຸດ %"
                value={values.percent}
                onChange={handleChange}
              />
            </FormControl>
            <span className="text-danger">{errors.percent}</span>
          </div>
        </div>
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
