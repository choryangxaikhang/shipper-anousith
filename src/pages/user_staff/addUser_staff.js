import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ADD_USERSTAFF } from "./apollo";
import { Formik, useFormik } from "formik";
import {
  endOfMonth,
  formatDateDash,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  startOfMonth,
  valiDate,
} from "../../helper";
import Gender from "../../helper/Gender";
import male from "../../img/males.png";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import * as ROUTES from "../../routes/app";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../helper/s3Client";
// import Provinces from "../../helper/components/Province";
// import District from "../../helper/components/District";
// import Village from "../../helper/components/Village";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
import Houses from "../../helper/components/house";
export default function AddUserStaff({ onSuccess, getData }) {
  const [show, setShow] = useState(false);
  const [role, setRole] = useState("");
  const [addUserStaff] = useMutation(ADD_USERSTAFF);
  const handleClose = () => setShow(false);
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  const [provinceData, setProvinceData] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [viLLage, setVillageData] = useState({});
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [gender, setGender] = useState("MALE");
  const [getHouse, setHouse] = useState({});
  const [startWorkTime, setStartDate] = useState(startOfMonth());
  const [endWorkTime, setEndDate] = useState(endOfMonth());
  // pictrue
  const handleUpload = async (event) => {
    const imageName = uuidv4() + "." + event.target.files[0].type.split("/")[1];
    const _file = event.target.files[0];
    setFile(_file);
    const res = await s3Client.uploadFile(_file, imageName);
    if (res?.location) {
      setFile(_file);
      // setImageName(res?.location);
      setImageName(imageName);
      messageSuccess("ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ");
    } else {
      setFile(null);
      setImageName("");
      messageWarning("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
    }
  };

  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      carSign: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.firstName) {
        errors.firstName = "error";
      }
      if (!values.lastName) {
        errors.lastName = "error";
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = "error";
      }
      if (!values.password) {
        errors.password = "error";
      }
      if (!districtData?._id) errors.district = "error";
      if (!provinceData?._id) errors.province = "error";
      if (!getHouse?._id) errors.house = "error";
      if (!role) errors.role = "error";
      return errors;
    },
    onSubmit: async (values) => {
      // return
      loadingScreen();
      try {
        const { data: create } = await addUserStaff({
          variables: {
            data: {
              carSign: String(values?.carSign),
              startWorkTime: String(startWorkTime),
              endWorkTime: String(endWorkTime),
              firstName: values?.firstName,
              lastName: values?.lastName,
              password: values?.password,
              phoneNumber: parseInt(values?.phoneNumber),
              profileImage: String((values.profileImage = imageName)),
              village: viLLage?._id,
              district: String(districtData?._id),
              province: String(provinceData?._id),
              role: String(role),
              gender: String(gender),
              house: String(getHouse?._id),
            },
          },
        });
        if (create) {
          Notiflix.Loading.remove();
          messageSuccess("ການດຳເນີນງານສຳເລັດ");
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          onSuccess();
          setShow(false);
        } else {
          Notiflix.Loading.remove();
          messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        console.log(error)
        messageError("ບັນທືກຂໍ້ມູນຜິດພາດ");
      }
    },
  });


  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={() => setShow(true)}
      >
        <i className="icon-plus-circle" /> <span className="vr" /> ເພີ່ມ
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
            <i className="icon-sliders" /> ເພີ່ມພະນັກງານ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-1">
            <div className="form-group">
              <label className="control-label">ອັບໂຫຼດຮູບໂປຣໄຟຣ໌</label>
              <div style={{ textAlign: "center" }} for="file-upload">
                <input
                  type="file"
                  id="file-upload"
                  className="bg-danger"
                  onChange={handleUpload}
                  hidden
                />
                <label htmlFor="file-upload" className="long-border">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: "170px", height: "180" }}
                    />
                  ) : (
                    <img
                      src={male}
                      style={{ width: "170px", height: "180px" }}
                    />
                  )}
                </label>
              </div>
            </div>

            <div className="form-group col-md-6 mt-2">
              <label>ຊື່ {valiDate()}</label>
              <input
                type="text"
                className={
                  errors.firstName
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                placeholder="ຊື່"
              />
            </div>
            <div className="form-group mb-2 col-md-6 mt-2">
              <label>ນາມສະກຸນ {valiDate()}</label>
              <input
                type="text"
                className={
                  errors.lastName
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                placeholder="ນາມສະກຸນ"
              />
            </div>
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="">ເພດ {valiDate()}</label>
            </div>
            <Gender onClick={(value) => setGender(value)} value={gender} />
            <span className="invalid">{errors?.gender}</span>
          </div>
          <div className="row mt-1">
            <div className="form-group col-md-6">
              <label>ເບີໂທ(+856 20) {valiDate()}</label>
              <input
                type="number"
                className={
                  errors.phoneNumber
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="phoneNumber"
                onWheel={(e) => e.target.blur()}
                value={values.phoneNumber}
                onChange={handleChange}
                placeholder="7678XXXX"
              />
            </div>
            <div className="form-group col-md-6">
              <label>ບັດປະຈຳຕົວ {valiDate()}</label>
              <input
                type="text"
                className={
                  errors.carSign
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="carSign"
                value={values.carSign}
                onChange={handleChange}
                placeholder="ປ້ອນເລກບັດ"
              />
            </div>
          </div>

          <div className="form-group mb-2">
            <label>ລະຫັດຜ່ານ {valiDate()}</label>
            <input
              type="password"
              className={
                errors.password
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="ລະຫັດຜ່ານ"
            />
          </div>
          <div className="row">
            <div className="form-row mt-2 col-md-4">
              <div>
                <label className="text-black">ແຂວງ {valiDate()}</label>
                {/* <Provinces
                  size={"lg"}
                  getData={(data) => {
                    setProvinceData(data);
                    setDistrictData({});
                  }}
                  defaultValue={provinceData?.provinceName}
                  className={errors.province ? "is-invalid" : ""}
                /> */}
              </div>
            </div>
            <div className="form-row mt-2 col-md-4">
              <label className="text-black">ເລືອກເມືອງ {valiDate()}</label>
              <div className="col-md-12">
                {/* <District
                  size={"lg"}
                  getData={(data) => {
                    setDistrictData(data);
                    setVillageData({});
                  }}
                  where={{ _id: provinceData?._id }}
                  defaultValue={districtData?.title}
                  className={errors?.district ? "is-invalid" : ""}
                /> */}
              </div>
            </div>
            <div className="form-row mt-2 col-md-4">
              <label className="text-black">ເລືອກບ້ານ </label>
              <div className="col-md-12">
                {/* <Village
                  size={"lg"}
                  getData={(data) => {
                    setVillageData(data);
                  }}
                  where={{ _id: districtData?._id }}
                  defaultValue={viLLage?.title}
                /> */}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="form-group mb-2">
              <label>ເລືອກກິດຈະການ{valiDate()}</label>
              <Houses
                size={"lg"}
                getData={(data) => {
                  setHouse(data);
                }}
                provinceId={{ _id: provinceData?._id }}
                defaultValue={getHouse?.houseName}
                className={errors.house ? "is-invalid" : ""}
              />
            </div>
          </div>
          <div className="form-group mt-3">
            <label>ເລືອກຕຳແຫນ່ງ {valiDate()}</label>
            <select
              className={
                errors.role
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {userRole?.map((item, index) => (
                <option key={index} value={item?.value}>
                  {item?.title}
                </option>
              ))}
            </select>
          </div>
          <div className="row mt-1">
            <div className="form-row mt-2 col-md-12">
              <div>
                <label className="text-black">
                  ວັນທີ່ເລີ່ມງານ {valiDate()}
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg"
                  name="startWorkTime"
                  value={formatDateDash(startWorkTime)}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            onClick={() => handleSubmit()}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
          <button
            className="btn btn-light btn-block btn-sm"
            onClick={() => handleClose()}
          >
            <i className="icon-x" style={{ marginRight: 3 }} />
            ປິດ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export const userRole = [
  { value: "", title: "ເລືອກຕຳແຫນ່ງ" },
  { value: "HR", title: "ບຸກຄາລະກອນ" },
  { value: "ACCOUNTANT", title: "ບັນຊີ" },
  { value: "FINANCE", title: "ການເງິນ" },
  { value: "LAW", title: "ກົດໝາຍ" },
  { value: "BRANCH_DIRECTOR", title: "ຫົວໜ້າບໍລິຫານກິດຈະການ" },
  { value: "CALL_CENTER", title: "ພ/ງ ຕ້ອນຮັບ" },
  { value: "ADMIN", title: "ເອັດມິນ" },
  { value: "SUPER_ADMIN", title: "ບໍລິຫານສູງສຸດ" },
  { value: "CUSTOMER_SERVICE", title: "ພ/ງ ບໍລິການລູກຄ້າ" },
  { value: "DRIVER_DIRECTOR", title: "ພ/ງ ຂັບລົດ" },
];