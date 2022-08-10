/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import "./login.css";
import { EMPLOYEE_LOGIN } from "./gql";
import Notiflix, { Loading } from "notiflix";
import { loadingScreen, messageWarning, TOKEN } from "../../helper";
import Imglogo from "../../img/app-icon.png";
export default function Login({ history }) {
  window.history.forward();
  const [employeeLogin] = useMutation(EMPLOYEE_LOGIN);
  return (
    <>
      <Formik
        initialValues={{
          phoneNumber: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.phoneNumber) errors.phoneNumber = "ກະລຸນາປ້ອນເບີໂທ";
          else if (values.phoneNumber.length > 8) {
            errors.phoneNumber = "ເບີໂທຕ້ອງມີບໍ່ເກີນ 8 ໂຕເລກ";
          } else if (values.phoneNumber.length < 7) {
            errors.phoneNumber = "ເບີໂທຕ້ອງມີ 7 ໂຕເລກຂື້ນໄປ";
          }
          if (!values.password) errors.password = "ກະລຸນາປ້ອນລະຫັດຜ່ານ";
          return errors;
        }}
        onSubmit={async (values) => {
          try {
            let user = await employeeLogin({
              variables: {
                where: {
                  phoneNumber: parseInt(values?.phoneNumber),
                  password: String(values?.password),
                },
              },
            });

            if (user) {
              localStorage.setItem(
                TOKEN,
                JSON.stringify(user?.data?.employeeLogin)
              );
              loadingScreen();
              setTimeout(() => {
                Loading.remove();
                window.location.href = "/home";
              }, 2000);
            } else {
              messageWarning("ເບີໂທຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
            }
          } catch (error) {
            messageWarning("ເບີໂທຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            <div className="header-bg header-bg-1 text-white" />
            <div
              className="body-content bg-white"
            >
              <center>
                <img
                  src={Imglogo}
                  alt="logo"
                  className="logo"
                  style={{
                    marginTop: -70,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    border: "2px solid #eb6572",
                  }}
                />
              </center>
              <div className="container">
                <center>
                  <h2>ເຂົ້າສູ່ລະບົບ</h2>
                </center>
                <div className="authentication-form">
                  <form>
                    <div className="form-group pb-15">
                      <label>ເບີໂທ</label>
                      <div className="input-group">
                        <input
                          type="number"
                          name="phoneNumber"
                          className="form-control form-control-lg card"
                          placeholder="7678XXXX"
                          onChange={handleChange}
                        />
                        <span className="input-group-text btn btn-lg">
                          <i className="icon-phone ml-1 fs-3" />
                        </span>
                      </div>
                      <div className="invalid fs-5">{errors?.phoneNumber}</div>
                    </div>
                    <div className="form-group pb-15">
                      <label>ລະຫັດຜ່ານ</label>
                      <div className="input-group">
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-lg password auto-complete card"
                          placeholder="**********"
                          onChange={handleChange}
                        />
                        <span className="input-group-text btn btn-lg">
                          <i className="icon-lock ml-1 fs-3" />
                        </span>
                      </div>
                      <div className="invalid fs-5">{errors?.password}</div>

                    </div>
                    <div className="row">
                      <div className="col-5">
                        <hr />
                      </div>
                      <div className="col-2 text-center">
                        <i className="icon-lock fs-2" />
                      </div>
                      <div className="col-5">
                        <hr />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn main-btn main-btn-lg main-btn-red rounded full-width mb-10 p-3"
                    >
                      ເຂົ້າສູ່ລະບົບ
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
