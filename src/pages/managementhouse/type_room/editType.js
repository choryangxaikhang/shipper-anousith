import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { messageError, messageSuccess, valiDate } from "../../../helper";
import { EDIT_ROOM } from "./apollo";
import Notiflix, { Loading } from "notiflix";
export default function EditType({ getId, onSuccess }) {
  const [show, setShow] = useState(false);
  const [editProvinces] = useMutation(EDIT_ROOM);
  const handleClose = () => setShow(false);

  
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
        Loading.dots();
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
            messageSuccess("ການດຳເນີນງານສຳເລັດ");
            setShow(false);
            onSuccess();
          } else {
            Notiflix.Loading.remove();
            messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
          }
        } catch (error) {
          Notiflix.Loading.remove();
          messageError("ການເຂົ້າລະບົບມີຄວາມຂັດຂ້ອງ");
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isDisabled,
      }) => (
        <React.Fragment>
          <button
            type="button"
            className="btn btn-success btn-ms"
            onClick={() => setShow(true)}
          >
            <i className="icon-edit" />
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
                <i className="icon-sliders" /> ແກ້ໄຂຂໍ້ມູນປະເພດຫ້ອງ
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">
                <label>ປະເພດຫ້ອງ (ພາສາລາວ){valiDate()}</label>
                <input
                  type="text"
                  className={
                    errors.title_lao
                      ? "form-control mb-3 is-invalid"
                      : "form-control mb-3 invalid"
                  }
                  name="title_lao"
                  value={values.title_lao}
                  onChange={handleChange}
                  placeholder="ພາສາລາວ"
                />
              </div>
              <div className="form-group">
                <label>ປະເພດຫ້ອງ (ພາສາອັງກິດ)</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="title_eng"
                  value={values.title_eng}
                  onChange={handleChange}
                  placeholder="ພາສາອັງກິດ"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-primary btn-block btn-sm"
                onClick={() => handleSubmit()}
                disabled={isDisabled}
              >
                <i className="icon-save" style={{ marginRight: 3 }} />
                ບັນທຶກ
              </button>
              <button
                className="btn btn-light btn-block btn-lg"
                onClick={() => handleClose()}
              >
                <i className="icon-x" style={{ marginRight: 3 }} />
                ປິດ
              </button>
            </Modal.Footer>
          </Modal>
        </React.Fragment>
      )}
    </Formik>
  );
}
