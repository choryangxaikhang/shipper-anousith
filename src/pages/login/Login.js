/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import "./login.css";
import { LOGIN_USER } from "./gql";
import Notiflix, { Loading } from "notiflix";
import {
  loadingScreen,
  messageError,
  messageWarning,
  TOKEN,
} from "../../helper";
import Imglogo from "../../img/app-icon.png";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
export default function Login({ history }) {
  window.history.forward();
  const [showPassword, setShowPassword] = useState("password");
  const [userLogIn] = useMutation(LOGIN_USER);
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
          if (!values.password) errors.password = "ກະລຸນາປ້ອນລະຫັດຜ່ານ";
          return errors;
        }}
        onSubmit={async (values) => {
          try {
            let user = await userLogIn({
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
                userRole === "CALL_CENTER" ||
                userRole === "BRANCH_DIRECTOR" ||
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
            messageWarning("ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
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
                <div className="authentication-form mt-5">
                  <form>
                    <div className="form-group">
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <OutlinedInput
                          value={values.phoneNumber}
                          onChange={handleChange("phoneNumber")}
                          startAdornment={
                            <InputAdornment position="start">
                              {/* <i className="icon-phone  fs-3" /> */}
                              +85620:
                            </InputAdornment>
                          }
                          error={errors.phoneNumber}
                          name="phoneNumber"
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          placeholder="ປ້ອນເບີໂທ"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                    <div className="form-group pb-15">
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <OutlinedInput
                          value={values.password}
                          onChange={handleChange("password")}
                          startAdornment={
                            <InputAdornment position="start">
                              {/* <i className="fa-sharp fa-solid fa-key"/> */}
                              ລະຫັດຜ່ານ:
                            </InputAdornment>
                          }
                          error={errors.phoneNumber}
                          type={showPassword}
                          name="password"
                          placeholder="**********"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                          endAdornment={
                            <InputAdornment
                              position="end"
                              style={{ marginRight: -3 }}
                            >
                              <i
                                class="fa-sharp fa-solid fa-eye"
                                onClick={() =>
                                  showPassword === "password"
                                    ? setShowPassword("text")
                                    : setShowPassword("password")
                                }
                              />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={{ backgroundColor: "#f54f02" }}
                      className="btn btn-block btn-lg text-white rounded mb-10"
                    >
                      <i class="fa-sharp fa-solid fa-angles-right me-2"></i>
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
