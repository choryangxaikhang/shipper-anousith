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
          /* and other goodies */
        }) => (
          <>
            <div className="header-bg header-bg-1" />
            <div className="fixed-top">
              <div className="appbar-area sticky-black">
                <div className="container">
                  <div className="appbar-container">
                    <div className="appbar-item appbar-actions">
                      <div className="appbar-action-item">
                        <a href="#" className="back-page">
                          <i className="icon-x fs-2" />
                        </a>
                      </div>
                    </div>
                    <div className="appbar-item appbar-page-title mx-auto">
                      <h3>AT-APP</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="body-content"
              style={{ height: "100vh", marginTop: 120 }}
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
              <div className="container pt-3">
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
                          className="form-control form-control-lg"
                          placeholder="ປ້ອນເບີໂທ"
                          onChange={handleChange}
                        />
                        <span className="input-group-text btn btn-lg">
                          <i className="icon-phone ml-1 fs-3" />
                        </span>
                      </div>
                    </div>
                    <div className="form-group pb-15">
                      <label>ລະຫັດຜ່ານ</label>
                      <div className="input-group">
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-lg password auto-complete"
                          placeholder="**********"
                          onChange={handleChange}
                        />
                        <span className="input-group-text btn btn-lg">
                          <i className="icon-lock ml-1 fs-3" />
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5">
                        <hr />
                      </div>
                      <div className="col-2">
                        <i className="icon-lock fs-2" />
                      </div>
                      <div className="col-5">
                        <hr />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
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
