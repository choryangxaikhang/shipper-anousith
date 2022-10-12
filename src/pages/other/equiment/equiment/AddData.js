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

import { ADD_EQUIMENT } from "./apollo";
import Notiflix from "notiflix";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SelectEquimentType from "../../../../helper/components/SelectEquimentType";

export default function AddData({ onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;
  const [listEquimentType, setListEquimentType] = useState("");
  const [show, setShow] = useState(false);
  const [addEquiment] = useMutation(ADD_EQUIMENT);
  const [house, setHouse] = useState({});
  const [today, setToday] = useState(toDay());
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);

  const { handleChange, errors, values, handleSubmit, resetForm, isDisabled } =
    useFormik({
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
        if (!listEquimentType?._id)
          errors.equimentType = "ກະລຸນາເລືອກຫມວດຊັບສິນ";
        if (!values.price) errors.price = "ກະລຸນາປ້ອນລາຄາ";
        return errors;
      },
      onSubmit: async (values) => {
        loadingScreen();
        try {
          const { data: updated } = await addEquiment({
            variables: {
              data: {
                title: values?.title,
                equimentType: String(listEquimentType?._id),
                receiptDate: String(today),
                unit: String(values?.unit),
                size: String(values?.size),
                price: parseInt(values?.price),
                details: values?.details,
                house: house?._id,
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

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg btn-block"
        onClick={() => setShow(true)}
      >
        <i className="icon-plus-circle me-1" /> ເພີ່ມຊັບສິນ
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ເພີ່ມລາຍການຊັບສິນ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <div className="form-row mt-1 mb-2">
            <label className="text-black">ເລືອກຫມວດຊັບສິນ</label>
            <div className="col-md-12">
              <SelectEquimentType
                style={{ minWidth: 200 }}
                value={listEquimentType?._id}
                onChange={(obj) => {
                  if (obj?._id) {
                    setListEquimentType(obj);
                  }
                }}
              />
            </div>
            <div className="text-danger">{errors?.equimentType}</div>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    ຊື່ຊັບສິນ: 
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    ຫົວຫນ່ວຍ: 
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    ຂະນຫນາດ: 
                  </InputAdornment>
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
