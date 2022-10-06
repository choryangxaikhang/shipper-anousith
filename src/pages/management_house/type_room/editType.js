import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import {
  loadingScreen,
  messageError,
  messageSuccess,
  valiDate,
} from "../../../helper";
import { EDIT_ROOM } from "./apollo";
import Notiflix, { Loading } from "notiflix";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
export default function EditType({ getId, onSuccess }) {
  const [show, setShow] = useState(false);
  const [editProvinces] = useMutation(EDIT_ROOM);
  const handleClose = () => setShow(false);

  console.log("getId", getId?._id);
  return (
    <Formik
      initialValues={{
        title_lao: getId?.title_lao ? getId?.title_lao : "",
        title_eng: getId?.title_eng ? getId?.title_eng : "",
      }}
      enableReinitialize={true}
      validate={(values) => {
        const errors = {};
        if (!values.title_lao) {
          errors.title_lao = "error";
        }
        return errors;
      }}
      onSubmit={async (values) => {
        loadingScreen();
        try {
          let _upDate = await editProvinces({
            variables: {
              data: {
                title_lao: String(values?.title_lao),
                title_eng: String(values?.title_eng),
              },
              where: {
                _id: getId?._id,
              },
            },
          });
          if (_upDate) {
            Notiflix.Loading.remove();
            messageSuccess("ແກ້ໄຂສຳເລັດ");
            setShow(false);
            onSuccess();
          } else {
            Notiflix.Loading.remove();
            messageError("ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ");
          }
        } catch (error) {
          Notiflix.Loading.remove();
          console.log(error);
          messageError("ຂໍ້ມູນຜິດພາດ");
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isDisabled }) => (
        <React.Fragment>
          <button
            type="button"
            className="btn btn-light btn-lg"
            onClick={() => setShow(true)}
          >
            <i className="fas fa-edit " />
          </button>
          <Modal show={show} size="xl" animation={false}>
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
                    error={errors.title_lao}
                    onChange={handleChange}
                  />
                  <div className="text-danger">{errors.title_lao}</div>
                </FormControl>
              </div>
              <div className="form-group">
                <FormControl fullWidth sx={{ m: 0 }}>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        ພາສາອັງກິດ:
                      </InputAdornment>
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
                disabled={isDisabled}
              >
                <i className="icon-save" style={{ marginRight: 3 }} />
                ບັນທຶກ
              </button>
            </Modal.Footer>
          </Modal>
        </React.Fragment>
      )}
    </Formik>
  );
}
