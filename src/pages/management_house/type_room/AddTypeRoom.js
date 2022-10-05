import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, useFormik } from "formik";
import {
  loadingScreen,
  messageError,
  messageSuccess,
  valiDate,
} from "../../../helper";
import Notiflix, { Loading } from "notiflix";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import { CREATE_TYPE } from "./apollo";
export default function AddTypeRoom({ getId, onSuccess }) {
  const [show, setShow] = useState(false);
  const [createType] = useMutation(CREATE_TYPE);

  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {
      title_lao: "",
      title_eng: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.title_lao) {
        errors.title_lao = "ກະລຸນາປ້ອນເພດຫ້ອງ";
      }
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: updated } = await createType({
          variables: {
            data: {
              title_lao: String(values?.title_lao),
              title_eng: String(values?.title_eng),
            },
          },
        });
        if (updated) {
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
        size="xl"
      >
        <i className="icon-plus-circle me-1" /> ເພີ່ມປະເພດຫ້ອງ
      </button>
      <Modal show={show} size="xl">
        <Modal.Header>
          ແກ້ໄຂຂໍ້ມູນປະເພດຫ້ອງ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ພາສາລາວ:</InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="text"
                name="title_lao"
                placeholder="..."
                value={values.title_lao}
                onChange={handleChange}
              />
              <div className="text-danger">{errors.title_lao}</div>
            </FormControl>
          </div>
          <div className="form-group">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ພາສາອັງກິດ:</InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="text"
                name="title_eng"
                placeholder="..."
                value={values.title_eng}
                onChange={handleChange}
              />
            </FormControl>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => handleSubmit()}
            onDoubleClick={() => {
              return false;
            }}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
