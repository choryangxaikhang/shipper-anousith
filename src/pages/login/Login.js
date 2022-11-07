/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import "./login.css";
import { LOGIN_USER } from "./gql";
import {
  messageError,
  messageWarning,
  parseJwt,
  TOKEN,
} from "../../helper";
import Imglogo from "../../img/icon.png";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
export default function Login() {
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
            let { data: user } = await userLogIn({
              variables: {
                data: {
                  phoneNumber: parseInt(values?.phoneNumber),
                  password: String(values?.password),
                },
              },
            });
            const _user = parseJwt(user?.userLogin?.accessToken)
            if (_user?.role !== "SHIPPER") {
              return messageError("ທ່ານບໍ່ມີສິດໃນການເຂົ້າໃຊ້ລະບົບນີ້");
            }
            localStorage.setItem(
              TOKEN, user?.userLogin?.accessToken
            );
            window.location.href = `/home`;
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
            <div className="appHeader header-bg-1 text-white" />
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
                          value={values.phoneNumber}
                          onChange={handleChange("phoneNumber")}
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="icon-phone  fs-3" />
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
                        <label>ລະຫັດຜ່ານ</label>
                        <OutlinedInput
                          value={values.password}
                          onChange={handleChange("password")}
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="fa-sharp fa-solid fa-key fs-3" />
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
