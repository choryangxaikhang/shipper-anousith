/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import "./login.css";
import { LOGIN_USER } from "./gql";
import Notiflix, { Loading } from "notiflix";
import { loadingScreen, messageError, messageWarning, TOKEN } from "../../helper";
import Imglogo from "../../img/app-icon.png";
export default function Login({ history }) {
  window.history.forward();
  const [employeeLogin] = useMutation(LOGIN_USER);
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
                JSON.stringify(user?.data?.staffLogin)
              );
              const userRole = user?.data?.staffLogin?.data?.role;
              if (
                userRole === "SUPER_ADMIN" ||
                userRole === "IT" ||
                userRole === "ADMIN" ||
                userRole === "ACCOUNTANT" ||
                userRole === "FINANCE" ||
                userRole === "HR"
              ) {
                loadingScreen();
                setTimeout(() => {
                  Loading.remove();
                  window.location.href = `/home`;
                }, 2000);
              } else {
                messageError("ທ່ານບໍ່ມີສິດໃນການເຂົ້າໃຊ້ລະບົບນີ້");
              }
            } else {
              messageWarning("ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
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
            <div className="body-content bg-white">
              <center>
                <img
                  src={Imglogo}
                  alt="logo"
                  className="logo p-2"
                  style={{
                    marginTop: -70,
                    width: 120,
                    height: 120,
                    borderRadius: "40%",
                    border: "2px solid f54f02",
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
                        <span className="input-group-text btn btn-lg">
                          <i className="icon-phone ml-1 fs-3" />
                        </span>
                        <input
                          type="number"
                          name="phoneNumber"
                          className="form-control form-control-lg card"
                          placeholder="ປ້ອນເບີໂທ"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="invalid fs-5">{errors?.phoneNumber}</div>
                    </div>
                    <div className="form-group pb-15">
                      <label>ລະຫັດຜ່ານ</label>
                      <div className="input-group">
                        <span className="input-group-text btn btn-lg">
                          <i className="fa-solid fa-key ml-1" />
                        </span>
                        <input
                          type="password"
                          name="password"
                          className="form-control form-control-lg password auto-complete card"
                          placeholder="**********"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="invalid fs-5">{errors?.password}</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#f54f02" }}
                      className="btn btn-block btn-lg text-white rounded mb-10"
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
