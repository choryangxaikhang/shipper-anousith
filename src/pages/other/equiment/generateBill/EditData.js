
import {useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { EDIT_BILL } from "./apollo";
import { useFormik } from "formik";
import {
  loadingScreen,
  messageError,
  messageSuccess,
  valiDate,
} from "../../../../helper";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
export default function EditData({ onSuccess, _data }) {
  const [show, setShow] = useState(false);
  const [addData] = useMutation(EDIT_BILL);
  const handleClose = () => setShow(false);
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
      details: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.details) {
        errors.details = "ກະລຸນາປ້ອນຂໍ້ມູນບິນກ່ອນ";
      }
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: updated } = await addData({
          variables: {
            data: {
              details: values?.details,
            },
          },
        });
        if (updated) {
          Notiflix.Loading.remove();
          messageSuccess("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
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
    setFieldValue("details", _data?.details ? _data?.details : "", false);
  }, [_data, show]);
  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg"
        onClick={() => {
          setShow(true);
        }}
      >
        <i className="fas fa-edit" />
      </button>
      <Modal
        show={show}
        animation={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            <i className="icon-plus-circle" /> ຟອມສ້າງບີນ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="container">
          <div className="form-row mt-1">
            <label className="text-black">ປ້ອນຂໍ້ມູບິນ {valiDate()}</label>
            <div className="col-md-12">
              <textarea
                type="number"
                className={
                  errors.details
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="details"
                value={values.details}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                placeholder="..."
                rows={6}
                style={{color: "black" }}
              ></textarea>
              <div className="text-danger">{errors?.details}</div>
            </div>
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
