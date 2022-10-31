// import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import {
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  toDay,
} from "../../../../helper";

import { ADD_EQUIMENT, EDIT_EQUIMENT } from "./apollo";
import Notiflix from "notiflix";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SelectEquimentType from "../../../../helper/components/SelectEquimentType";

export default function EditData({ data, onSuccess }) {
  const [show, setShow] = useState(false);
  const [editEquiment] = useMutation(EDIT_EQUIMENT);
  const userState = getStaffLogin();
  const [listEquimentType, setListEquimentType] = useState("");
  const [house, setHouse] = useState({});
  const [today, setToday] = useState(toDay());
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);

  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    resetForm,
    setFieldValue,
    isDisabled,
  } = useFormik({
    initialValues: {
      title: "",
      receiptDate: "",
      unit: "",
      size: "",
      price: "",
      details: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "ກະລຸນາປ້ອນຊື່ຊັບສິນ";
      }
      if (!today) {
        errors.receiptDate = "error";
      }
      if (!values.unit) {
        errors.unit = "ກະລຸນາປ້ອນຫົວຫນ່ວຍ";
      }
      if (!listEquimentType?._id) errors.equimentType = "ກະລຸນາເລືອກຫມວດຊັບສິນ";
      if (!values.price) errors.price = "ກະລຸນາປ້ອນລາຄາ";
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: updated } = await editEquiment({
          variables: {
            data: {
              title: values?.title,
              equimentType: String(listEquimentType?._id),
              receiptDate: today,
              unit: String(values?.unit),
              size: String(values?.size),
              price: parseInt(values?.price),
              details: values?.details,
              total: parseInt(values?.total),
            },
            where: {
              _id: data?._id,
            },
          },
        });
        if (updated) {
          Notiflix.Loading.remove();
          messageSuccess("ບັນທືກສຳເລັດ");
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          setShow(false);
          onSuccess();
        } else {
          Notiflix.Loading.remove();
          messageError("ບັນທຶກບໍ່ສຳເລັດ");
        }
      } catch (error) {
        console.log(error);
        Notiflix.Loading.remove();
        messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
      }
    },
  });

  useEffect(() => {
    if (!show) {
      return;
    }
    setFieldValue("total", data?.total ? data?.total : 0, false);
    setListEquimentType(data?.equimentType);
    setFieldValue("title", data?.title ? data?.title : "", false);
    setFieldValue("unit", data?.unit ? data?.unit : "", false);
    setFieldValue("size", data?.size ? data?.size : "", false);
    setFieldValue("price", data?.price ? data?.price : "", false);
    setFieldValue("details", data?.details ? data?.details : "", false);
    setToday(formatDateDash(data?.receiptDate));
  }, [data, show]);

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
        // onClick={() => setShow(true)}
      >
        <i className="fas fa-edit me-1" />
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ແກ້ໄຂຂໍ້ມູນຊັບສິນ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <div className="form-row mt-1 mb-2">
            <SelectEquimentType
              style={{ minWidth: "100%" }}
              value={listEquimentType?._id}
              onChange={(obj) => {
                if (obj?._id) {
                  setListEquimentType(obj);
                }
              }}
            />
            <div className="text-danger fs-4">{errors?.equimentType}</div>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຊື່ຊັບສິນ:</InputAdornment>
                }
                type="text"
                placeholder="..."
                name="title"
                value={values?.title}
                onChange={handleChange}
              />
            </FormControl>
            <span className="text-danger">{errors.title}</span>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຫົວຫນ່ວຍ:</InputAdornment>
                }
                type="text"
                placeholder="..."
                onWheel={(e) => e.target.blur()}
                name="unit"
                value={values?.unit}
                onChange={handleChange}
              />
              <div className="text-danger">{errors.unit}</div>
            </FormControl>
          </div>
          <div className="form-group mb-2">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຂະນຫນາດ:</InputAdornment>
                }
                type="number"
                placeholder="..."
                onWheel={(e) => e.target.blur()}
                name="size"
                value={values?.size}
                onChange={handleChange}
              />
            </FormControl>
          </div>
          <div className="form-group mb-2">
            <TextField
              variant="outlined"
              type="number"
              name="total"
              hidden
              disabled={true}
              onWheel={(e) => e.target.blur()}
              value={values?.total}
              onChange={handleChange}
              sx={{
                m: 0,
                width: "100%",
                backgroundColor: "#ffff",
              }}
            />
          </div>
          <div className="form-group mb-2">
            <TextField
              label="ລາຄາ"
              variant="outlined"
              type="number"
              name="price"
              onWheel={(e) => e.target.blur()}
              value={values?.price}
              onChange={handleChange}
              sx={{
                m: 0,
                width: "100%",
                backgroundColor: "#ffff",
              }}
              error={errors.price}
            />
            <span className="text-danger">{errors.price}</span>
          </div>
          <div className="form-group mb-1">
            <TextField
              label="ວັນທີ່"
              variant="outlined"
              type="date"
              name="receiptDate"
              value={formatDateDash(today)}
              onChange={(e) => {
                setToday(e.text.value);
              }}
              sx={{
                m: 0,
                width: "100%",
                backgroundColor: "#ffff",
              }}
            />
          </div>
          <div className="form-group mt-1">
            <label>ລາຍລະອຽດ</label>
            <textarea
              type="text"
              className="form-control form-control-lg"
              placeholder="..."
              name="details"
              style={{ color: "black" }}
              onChange={handleChange}
            ></textarea>
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
