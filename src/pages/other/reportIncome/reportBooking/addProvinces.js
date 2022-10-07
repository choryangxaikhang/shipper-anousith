import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ADD_PROVINCES } from "./apollo";
import { useFormik } from "formik";
import { messageError, messageSuccess, valiDate } from "../../../helper";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
export default function AddProvinces({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [createProvince] = useMutation(ADD_PROVINCES);
  const handleClose = () => setShow(false);
  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {
      provinceName: "",
      addressInfo: "",
      province_map_lat: "",
      province_map_lng: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.provinceName) {
        errors.provinceName = "error";
      }
      if (!values.province_map_lat) {
        errors.province_map_lat = "error";
      }
      if (!values.province_map_lng) {
        errors.province_map_lng = "error";
      }
      return errors;
    },
    onSubmit: async (values) => {
      Loading.dots();
      try {
        const { data: create } = await createProvince({
          variables: {
            data: {
              provinceName: values?.provinceName,
              addressInfo: values?.addressInfo,
              province_map_lng: values?.province_map_lng,
              province_map_lat: values?.province_map_lat,
            },
          },
        });
        if (create) {
          Notiflix.Loading.remove();
          messageSuccess("ການດຳເນີນງານສຳເລັດ");
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          onSuccess();
          setShow(false);
        } else {
          Notiflix.Loading.remove();
          messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        messageError("ແຂວງນີ້ມີຢູ່ແລ້ວ");
      }
    },
  });

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={() => setShow(true)}
      >
        <i className="icon-plus-circle" /> <span className="vr" /> ເພີ່ມແຂວງ
      </button>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            <i className="icon-add" /> ເພີ່ມແຂວງ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>ຊື່ແຂວງ {valiDate()}</label>
            <input
              type="text"
              className={
                errors.provinceName
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="provinceName"
              value={values.provinceName}
              onChange={handleChange}
              placeholder="ຊື່ແຂວງ"
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>ທີ່ຕັ້ງ {valiDate()}</label>
                <input
                  type="text"
                  className={
                    errors.province_map_lng
                      ? "form-control mb-3 is-invalid"
                      : "form-control mb-3 invalid"
                  }
                  name="province_map_lng"
                  value={values.province_map_lng}
                  onChange={handleChange}
                  placeholder="ປ້ອນ IP ທີ່ຢູ່"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>ທີ່ຕັ້ງ {valiDate()}</label>
                <input
                  type="text"
                  className={
                    errors.province_map_lat
                      ? "form-control mb-3 is-invalid"
                      : "form-control mb-3 invalid"
                  }
                  name="province_map_lat"
                  value={values.province_map_lat}
                  onChange={handleChange}
                  placeholder="ປ້ອນ IP ທີ່ຢູ່"
                />
              </div>
            </div>
          </div>

          <div className="form-group mb-2">
            <label>ທີ່ຢູ່ ແລະ ລາຍລະອຽດ </label>
            <textarea
              rows={4}
              className={
                errors.addressInfo
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="addressInfo"
              value={values.addressInfo}
              onChange={handleChange}
              placeholder="ລາຍລະອຽດແຂວງ"
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            onClick={() => handleSubmit()}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
          <button
            className="btn btn-light btn-block btn-sm"
            onClick={() => handleClose()}
          >
            <i className="icon-x" style={{ marginRight: 3 }} />
            ປິດ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
