/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import "./login.css";
import { LOGIN_USER } from "./gql";
import Loading from "notiflix";
import {
  loadingScreen,
  messageError,
  messageWarning,
  TOKEN,
} from "../../helper";
import Imglogo from "../../img/icon.png";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
export default function Login({ history }) {
  window.history.forward();
  const [showPassword, setShowPassword] = useState("password");
  const [userLogIn] = useMutation(LOGIN_USER);
  return (
    <>
      <Formik
        initialValues={{
          phone_number: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.phone_number) errors.phone_number = "ກະລຸນາປ້ອນເບີໂທ";
          if (!values.password) errors.password = "ກະລຸນາປ້ອນລະຫັດຜ່ານ";
          return errors;
        }}
        onSubmit={async (values) => {
          try {
            let user = await userLogIn({
              variables: {
                where: {
                  phone_number: parseInt(values?.phone_number),
                  password: String(values?.password),
                },
              },
            });

            if (user) {
              localStorage.setItem(
                TOKEN,
                JSON.stringify(user?.data?.staffLogin)
              );
              const userRole = user?.data?.staffLogin;
              console.log(userRole)

              if (
                userRole
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
              messageWarning("ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ2222");
            }
          } catch (error) {
            messageWarning("ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleSubmit,
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
                    marginTop: 0,
                    width: '80%',
                    height: 250,
                    borderRadius: "10%",
                    border: "2px solid de0a0af2",
                  }}
                />
                <h2>shiper-anousith</h2>
              </center>
              <div className="container">
                <div className="authentication-form mt-2">
                  <form>
                    <div className="form-group">
                      <label>ເບີໂທ</label>
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <OutlinedInput
                          value={values.phone_number}
                          onChange={handleChange("phone_number")}
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="icon-phone  fs-3" />
                            </InputAdornment>
                          }
                          error={errors.phone_number}
                          name="phone_number"
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
                        <label>ລະຫັດຜ່ານ</label>
                        <OutlinedInput
                          value={values.password}
                          onChange={handleChange("password")}
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="fa-sharp fa-solid fa-key fs-3" />
                            </InputAdornment>
                          }
                          error={errors.phone_number}
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
                                className="fa-sharp fa-solid fa-eye"
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
                      style={{ backgroundColor: "#de0a0af2" }}
                      className="btn btn-block btn-lg text-white mb-10"
                    >
                      <i className="fa-sharp fa-solid fa-angles-right me-2"></i>
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
