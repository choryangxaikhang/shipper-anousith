// import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, useFormik } from "formik";
import {
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
} from "../../../helper";
import Notiflix, { Loading } from "notiflix";
import { ADD_CUSTOMER } from "./apollo";
import SelectProvince from "../../../helper/components/SelectProvince";
import SelectDistrict from "../../../helper/components/SelectDistrict";
export default function RegisterCustomerOfHotel() {
  const [show, setShow] = useState(false);
  const [addCustomer] = useMutation(ADD_CUSTOMER);
  // const handleClose = () => setShow(false);
  const [provinceData, setProvinceData] = useState();
  const [districtData, setDistrictData] = useState();
  const [getTypeCheckIn, setTypeCheckIn] = useState("");
  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {
      fullName: "",
      password: "",
      age: "",
      signID: "",
      cardID: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.fullName) {
        errors.fullName = "ກະລຸນາປ້ອນ ຊື່ ແລະ ນາມສະກຸນ";
      }
      if (!values.gender) {
        errors.gender = "ກະລຸນາເລືອກເພດ";
      }
      if (!values.age) {
        errors.age = "ກະລຸນາປ້ອນອາຍຸ";
      }
      if (!values.password) {
        errors.password = "ກະລຸນາປ້ອນລະຫັດຜ່ານ";
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = "ກະລຸນາປ້ອນເບີໂທ";
      }
      if (
        values?.phoneNumber &&
        String(values?.phoneNumber)?.length !== 7 &&
        String(values?.phoneNumber)?.length !== 8
      ) {
        errors.phoneNumber =
          "ເບີໂທຕ້ອງບໍຕ່ຳກວ່າ 7 ໂຕເລກ ແລະ ສູງສຸດບໍເກີນ 8 ໂຕເລກ, ທ່ານປ້ອນແມ່ນ " +
          String(values?.phoneNumber)?.length +
          " ຕົວເລກ";
      }

      if (!values.cardID) {
        errors.cardID = "ກະລຸນາປ້ອນເອກະສານຕິດຄັດ";
      }
      if (!provinceData?._id) errors.province = "ກະລຸນາເລືອກແຂວງ";
      if (!districtData?._id) errors.district = "ກະລຸນາເລືອກເມືອງ";
      return errors;
    },
    onSubmit: async (values) => {
      Loading.dots();
      try {
        const { data: inputData } = await addCustomer({
          variables: {
            data: {
              fullName: String(values?.fullName),
              gender: String(values?.gender),
              password: String(values?.password),
              phoneNumber: values?.phoneNumber,
              age: values?.age,
              signID: values?.signID,
              cardID: values?.cardID,
              province: parseInt(provinceData?._id),
              district: parseInt(districtData?._id),
              village: String(values?.village),
            },
          },
        });
        if (inputData) {
          Notiflix.Loading.remove();
          messageSuccess("ການດຳເນີນງານສຳເລັດ");
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          setShow(false);
        } else {
          Notiflix.Loading.remove();
          messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        console.log(error);
      }
    },
  });

  return (
    <>
      <b className="float-end text-info" onClick={() => setShow(true)}>
        <i className="icon-user-plus" />
        ເພີ່ມລູກຄ້າ
      </b>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        size="xl"
      >
        <Modal.Header>
          <h3>ເພີ່ມລູກຄ້າ</h3>
          <RegisterCustomerOfHotel />
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        {/* <Modal.Body style={{ height: "150%" }}> */}
        <div className="row ">
          <div className=" col-md-12">
            <div className="card-body">
              <div className="form-row">
                <SelectProvince
                  style={{ width: "100%", fontSize: 14 }}
                  value={provinceData?._id}
                  onChange={(obj) => {
                    if (obj?._id) {
                      setDistrictData({});
                      setProvinceData(obj);
                    }
                  }}
                />
                <div className="text-danger fs-5">{errors.province}</div>
              </div>
              <div className="form-row mt-3">
                <SelectDistrict
                  style={{ width: "100%", fontSize: 14 }}
                  provinceId={provinceData?._id}
                  value={districtData?.id_list}
                  onChange={(obj) => {
                      setDistrictData(obj);
                  }}
                />
                <div className="text-danger fs-5">{errors.district}</div>
              </div>
              <div className="form-row mt-3">
                <label>ຊື່ບ້ານ {valiDate()}</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="village"
                  value={values.village}
                  onChange={handleChange}
                  placeholder="ປ້ອນຊື່ບ້ານ"
                />
              </div>
              <div className="form-row mt-3">
                <label>ຊື່ ແລະ ນາມສະກຸນ {valiDate()}</label>
                <input
                  type="text"
                  className={
                    errors.fullName
                      ? "form-control is-invalid"
                      : "form-control invalid"
                  }
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder="ຊື່ ແລະ ນາມສະກຸນ"
                />
              </div>{" "}
              <div className="form-row mt-3">
                <label>ເພດ {valiDate()}</label>
                <select
                  className={
                    errors.gender
                      ? "form-control is-invalid"
                      : "form-control invalid"
                  }
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                >
                  <option value="">ເລືອກເພດ</option>
                  <option value="MALE">ຊາຍ</option>
                  <option value="FEMALE">ຍິງ</option>
                  <option value="OTHER">ອື່ນໆ</option>
                </select>
                <div className="text-danger fs-5">{errors.gender}</div>
              </div>
              <div className="form-row mt-3">
                <label>ອາຍຸ {valiDate()}</label>
                <input
                  type="number"
                  className={
                    errors.age
                      ? "form-control is-invalid"
                      : "form-control invalid"
                  }
                  name="age"
                  value={values.age}
                  onWheel={(e) => e.target.blur()}
                  onChange={handleChange}
                  placeholder="ປ້ອນອາຍຸ"
                />
                <div className="text-danger fs-5">{errors.age}</div>
              </div>
              <div className="form-row mt-3">
                <label>ເບີໂທ(+856 20) {valiDate()}</label>
                <input
                  type="number"
                  className={
                    errors.phoneNumber
                      ? "form-control is-invalid"
                      : "form-control invalid"
                  }
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  placeholder="ເບີໂທ"
                  maxLength={8}
                />
                <div className="text-danger fs-5">{errors.phoneNumber}</div>
              </div>
              <div className="form-row mt-3">
                <label>ລະຫັດຜ່ານ{valiDate()}</label>
                <input
                  type="password"
                  className={
                    errors.password
                      ? "form-control is-invalid"
                      : "form-control invalid"
                  }
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="ລະຫັດຜ່ານ"
                />
                <div className="text-danger fs-5">{errors.password}</div>
              </div>
              <div className="form-row mt-3">
                <label>ບັດປະຈຳຕົວ{valiDate()}</label>
                <input
                  type="text"
                  className={
                    errors.cardID
                      ? "form-control is-invalid"
                      : "form-control invalid"
                  }
                  name="cardID"
                  value={values.cardID}
                  onChange={handleChange}
                  placeholder="ປ້ອນເລັກບັດເອກະສານ"
                />
                <div className="text-danger fs-5">{errors.cardID}</div>
              </div>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-success btn-lg  mt-2 w-100"
            onClick={() => handleSubmit()}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
        {/* </Modal.Body> */}
      </Modal>
    </>
  );
}
