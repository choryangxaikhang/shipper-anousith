import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ADD_BILL, QUERY_TYPE_HOUSE } from "./apollo";
import { useFormik } from "formik";
import {
  getLocalHouse,
  loadingScreen,
  messageError,
  messageSuccess,
  randomBillNo,
  valiDate,
} from "../../../../helper";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
export default function AddData({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [addData] = useMutation(ADD_BILL);
  const handleClose = () => setShow(false);
  const [billNumber, setBillNumber] = useState("");
  const [localHouse, setLocalHouse] = useState("");
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);

  const { handleChange, errors, values, handleSubmit, resetForm, isDisabled } =
    useFormik({
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
                house: localHouse,
                billNo: String(billNumber),
                status: "FEE",
              },
            },
          });
          if (updated) {
            Notiflix.Loading.remove();
            messageSuccess("ສ້າງບິນສຳເລັດ");
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
        onClick={() => {
          setShow(true);
          setBillNumber(randomBillNo());
        }}
      >
        <i className="icon-plus-circle me-1" /> ສ້າງບີນ
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header> ຟອມສ້າງບີນ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
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
                style={{ color: "black" }}
                name="details"
                value={values.details}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                placeholder="ປ້ອນຫົວຂໍ້ບິນ"
                rows={6}
              ></textarea>
              <div className="text-danger">{errors?.details}</div>
            </div>
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
