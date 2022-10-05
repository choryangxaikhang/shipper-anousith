/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  valiDate,
} from "../../../helper";
import { useFormik } from "formik";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";

import Notiflix, { Loading } from "notiflix";
import { CREATE_TYPE, QUERY_TYPE_HOUSE } from "./apollo";
import { Row } from "react-bootstrap";
import EditType from "./editType";
export default function AddTypeRoom({ onSuccess }) {
  const { history, location, match } = useReactRouter();
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
      Loading.dots();
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
    <>
      <div className="card text-red" >
        <div className="card-header text-center">
          <b className="fs-4 text-center">ຟອມບັນທຶກປະເພດກິດຈະການ</b>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div>
              <label className="text-black">
              ປະເພດກິດຈະການ (ພາສາລາວ) {valiDate()}
              </label>
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="title_lao"
                  placeholder="ພາສາລາວ"
                  onChange={handleChange}
                  value={values?.title_lao}
                />
                <div className="invalid fs-5">{errors?.title_lao}</div>
              </div>
            </div>
          </div>
          <div className="form-row mt-3">
            <div>
              <label className="text-black">ປະເພດກິດຈະການ (ພາສາອັງກິດ)</label>
              <div className="col-md-12">
                <input
                  name="title_eng"
                  className="form-control form-control-lg"
                  placeholder="ພາສາອັງກິດ"
                  onChange={handleChange}
                  value={values?.title_eng}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="col-md-md-2 mt-2">
            <button className="btn btn-primary" onClick={handleSubmit}>
              <i className="icon-save me-1" />
              ບັນທຶກ
            </button>
            <button className="btn btn-light ms-2" onClick={resetForm}>
              <i class="icon-x me-1" />
              ຍົກເລີກ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
