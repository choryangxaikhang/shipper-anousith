import { useLazyQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import Notiflix, { Loading } from "notiflix";
import React, { useContext, useEffect, useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { AppContext } from "../../App";
import {
  aws_url_image,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  TOKEN,
  valiDate,
} from "../../helper";
import { v4 as uuidv4 } from "uuid";
import District from "../../helper/components/District";
import Gender from "../../helper/components/Gender";
import Provinces from "../../helper/components/Province";
// import Village from "../../helper/components/Village";
import male from "../../img/male.png";
import whatsapp from "../../img/whatsapp.svg";
import useReactRouter from "use-react-router";
import {UPDATE_CUSTOMER } from "./apollo";
import { s3Client } from "../../helper/s3Client";
import placeholderImage from "../../img/male.png";
import { Redirect } from "react-router-dom";
// import "./profile.css";

export default function ProfileUpdate() {
  const getdata = localStorage.getItem("data");
  const data = JSON.parse(getdata);
  const { history } = useReactRouter();
  const { userState, userDispatch, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  //useState form

  const [gender, setGender] = useState(data?.gender);
  const [valueNote,setValueNote] = useState(data?.note);


    const [provinceData, setProvinceData] = useState(data?.province);
    const [districtData, setDistrictData] = useState(data?.district);



  useEffect(() => {
    titleDispatch("ແກ້ໄຂຂໍ້ມູນໂປຣໄຟລ໌");
  }, []);


  
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const handleUpload = async (event) => {
    try {
      const imageName =
        uuidv4() + "." + event.target.files[0].type.split("/")[1];
      const _file = event.target.files[0];
      const res = await s3Client.uploadFile(_file, imageName);
      if (res?.location) {
        setFile(_file);
        setFileName(imageName);
        setImageName(res?.location);
        messageSuccess("ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ");
      } else {
        setFile(null);
        setImageName("");
        messageWarning("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#f1f1f1f1",
        }}
      >
        <Formik
          initialValues={{
            fullName: data?.fullName ? data?.fullName : "",
            phoneNumber: data?.phoneNumber ? data?.phoneNumber : "",
            gender: gender ? gender : data?.gender,
            password: "",
            village: data?.village ? data?.village : "",
            note: data?.note ? data?.note : "",
          }}
          enableReinitialize={true}
          validate={(values) => {
            const errors = {};
            if (!values.fullName)
              errors.fullName = "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ";
            if (!gender) errors.gender = "ກະລຸນາເລືອກເພດ";
            if (!values.phoneNumber) errors.phoneNumber = "ກະລຸນາປ້ອນເບີໂທ";
            if (values.phoneNumber.length > 8)
              errors.phoneNumber = "ເບີໂທຕ້ອງບໍ່ເກີນ 8 ໂຕເລກ";
            if (values.phoneNumber.length < 8)
              errors.phoneNumber = "ເບີໂທຕ້ອງບໍ່ຕ່ຳກວ່າ 8 ໂຕເລກ";
            if (!values.village) errors.village = "ກະລຸນາປ້ອນຊື່ບ້ານ";

            if (!provinceData?._id) errors.province = "ກະລຸນາເລືອກທີ່ຢູ່ແຂວງ";
            if (!districtData?._id) errors.district = "ກະລຸນາເລືອກທີ່ຢູ່ເມືອງ";

            return errors;
          }}
          onSubmit={async (values) => {
            try {
              let _updateCustomer = await updateCustomer({
                variables: {
                  data: {
                    ...(fileName && fileName
                      ? { profileImage: String(fileName) }
                      : ""),
                    fullName: String(values.fullName),
                    gender: String(values.gender),
                    phoneNumber: parseInt(values.phoneNumber),
                    ...(values?.password && values?.password
                      ? { password: values?.password }
                      : ""),
                    province: provinceData?._id,
                    district: districtData?._id,
                    village: String(values.village),
                    note: String(valueNote ? valueNote : ""),
                  },
                  where: {
                    _id: parseInt(data?._id),
                  },
                },
              });
              if (_updateCustomer) {
                history.push("../profile");
                messageSuccess("ການດຳເນີນງານສຳເລັດ");
                
              } else {
                messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
              }
            } catch (error) {
              messageError("ການບັນທືກຂໍ້ມູນຜິດພາດ");
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
              <div
                className="container mt-5 pt-3 bg-white"
                style={{ paddingBottom: 100 }}
              >
                <div className="section  text-center">
                  <div className="avatar-section mb-3">
                    <a href="javascript:void(0)">
                      <img
                        src={
                          fileName
                            ? `${aws_url_image}${fileName}`
                            : data?.profileImage
                            ? aws_url_image + data?.profileImage
                            : placeholderImage
                        }
                        // src={fileName ? fileName : placeholderImage}
                        alt="avatar"
                        className="imaged w100 rounded"
                        style={{ width: 100, height: 100 }}
                      />
                      <label htmlFor="file">
                        <span className="button">
                          <i className="icon-camera" />
                          <input
                            type="file"
                            hidden
                            id="file"
                            onChange={handleUpload}
                          />
                        </span>
                      </label>
                    </a>
                  </div>
                </div>

                <div className="appHeader text-light border-0 pr-0">
                  <div style={{ flex: 1 }} className="text-left">
                    <button
                      className="btn text-white pr-0"
                      onClick={() => history.push(`/profile`)}
                      // onClick={() => history.goBack()}
                    >
                      <i className="icon-x fs-4" />
                    </button>
                  </div>
                  ແກ້ໄຂຂໍ້ມູນໂປຣໄຟລ໌
                  <div
                    className="text-white pageTitle text-center text-nowrap"
                    style={{ flex: 1 }}
                  ></div>
                </div>
                <div>
                  <div className="form-group basic">
                    <label htmlFor="">ຊື່ {valiDate()}</label>
                    <input
                      className={`form-control form-control-lg ${
                        errors?.fullName ? "is-invalid" : null
                      }`}
                      type="search"
                      name="fullName"
                      onChange={handleChange}
                      placeholder="ປ້ອນຊື່"
                      defaultValue={values?.fullName}
                    />
                    <span className="invalid">{errors?.fullName}</span>
                  </div>
                  <div className="form-group basic">
                    <div>
                      <label htmlFor="">ເພດ {valiDate()}</label>
                    </div>
                    <Gender
                      value={gender}
                      onClick={(value) => setGender(value)}
                    />
                    <span className="invalid">{errors?.gender}</span>
                  </div>
                  <div className="form-group basic">
                    <label htmlFor="">ເບີໂທ {valiDate()}</label>
                    <input
                      className={`form-control form-control-lg ${
                        errors?.phoneNumber ? "is-invalid" : null
                      }`}
                      type="tel"
                      name="phoneNumber"
                      onChange={handleChange}
                      placeholder="ປ້ອນເບີໂທ"
                      defaultValue={values?.phoneNumber}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <span className="invalid">{errors?.phoneNumber}</span>
                  </div>
                  <div className="form-group basic">
                    <label htmlFor="">ລະຫັດຜ່ານ</label>
                    <input
                      className={`form-control form-control-lg ${
                        errors?.password ? "is-invalid" : null
                      }`}
                      type="password"
                      name="password"
                      onChange={handleChange}
                      placeholder="ປ້ອນລະຫັດຜ່ານ"
                    />
                    <span className="invalid">{errors?.password}</span>
                  </div>
                  <div className="form-group basic">
                    <label htmlFor="">ແຂວງ {valiDate()}</label>
                    <Provinces
                      size={"lg"}
                      getData={(data) => setProvinceData(data)}
                      defaultValue={provinceData?.provinceName}
                    />
                    <span className="invalid">{errors?.province}</span>
                  </div>

                  <div className="form-group basic">
                    <label htmlFor="">ເມືອງ {valiDate()}</label>
                    <District
                      size={"lg"}
                      getData={(data) => setDistrictData(data)}
                      where={{ province: provinceData?._id }}
                      defaultValue={districtData?.title}
                    />
                    <span className="invalid">{errors?.district}</span>
                  </div>

                  <div className="form-group basic">
                    <label htmlFor="">ບ້ານ {valiDate()}</label>
                    <input
                      type="text"
                      name="village"
                      className={`form-control ${
                        errors?.village ? "is-invalid" : null
                      }`}
                      placeholder="ປ້ອນບ້ານ"
                      value={values?.village}
                      onChange={handleChange}
                    />
                    <span className="invalid">{errors?.village}</span>
                  </div>
                  <div className="form-group basic">
                    <label htmlFor="">ລາຍລະອຽດ</label>
                    <textarea
                      name="note "
                      onChange={handleChange}
                      placeholder="ລາຍລະອຽດ"
                      defaultValue={valueNote}
                      onKeyUp={(e) => setValueNote(e.target.value)}
                      rows={4}
                      className="form-control form-control-lg"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-lg w-100"
                onClick={handleSubmit}
                style={{
                  fontSize: "1.1em",
                  position: "fixed",
                  bottom: "0",
                  minHeight: 50,
                }}
              >
                <i className="icon-check-circle mr-1" /> ແກ້ໄຂຂໍ້ມູນ
              </button>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}
