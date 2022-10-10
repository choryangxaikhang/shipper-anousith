// import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {useFormik } from "formik";
import {
  getLocalHouse,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
} from "../../../../helper";

import { CREATE_TYPE } from "./apollo";
import Notiflix from "notiflix";
import {TextField } from "@mui/material";

export default function AddTypeData({ onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;

  const [show, setShow] = useState(false);
  const [addType] = useMutation(CREATE_TYPE);
  const [house, setHouse] = useState({});
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);

  const { handleChange, errors, values, handleSubmit, resetForm, isDisabled } =
    useFormik({
      initialValues: {
        title: "",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.title) {
          errors.title = "ກະລຸນາປ້ອນປະຫມວກຊັບສິນ";
        }
        return errors;
      },
      onSubmit: async (values) => {
        loadingScreen();
        try {
          const { data: inputData } = await addType({
            variables: {
              data: {
                title: values?.title,
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
        <i className="icon-plus-circle me-1" /> ເພີ່ມຫມວດຊັບສິນ
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ເພີ່ມຫມວດຊັບສິນ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-1">
            <TextField
              type="text"
              className="inputLabel"
              variant="outlined"
              name="title"
              placeholder="ປ້ອນຫມວດຊັບສິນ"
              value={values.title}
              onChange={handleChange}
              sx={{
                m: 0,
                width: "100%",
                backgroundColor: "#ffff",
              }}
            />
            <span className="text-danger">{errors.title}</span>
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
