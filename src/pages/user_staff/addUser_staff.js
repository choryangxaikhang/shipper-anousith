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
import male from "../../img/female.png";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import SelectDistrict from "../../helper/components/SelectDistrict";
import SelectProvince from "../../helper/components/SelectProvince";
import SelectVillage from "../../helper/components/SelectVillage";
import * as ROUTES from "../../routes/app";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../helper/s3Client";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
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
      if (!districtData?._id) errors.district = "ກະລຸນາເລືອກເມືອງ";
      if (!provinceData?._id) errors.province = "ກະລຸນາເລືອກແຂວງ";
      if (!getHouse?._id) errors.house = "ກະລຸນາເລືອກກີດຈະການ";
      if (!role) errors.role = "ກະລຸນາເລືອກຕຳແຫນ່ງ";
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
        console.log(error);
        messageError("ບັນທືກຂໍ້ມູນຜິດພາດ");
      }
    },
  });

  return (
    <React.Fragment>
      <button
        type="button"
        classNameName="btn btn-light btn-lg"
        onClick={() => setShow(true)}
      >
        <i classNameName="icon-plus-circle me-1" />  ເພີ່ມ
      </button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title classNameName="fs-5">
            <i classNameName="icon-sliders" /> ເພີ່ມພະນັກງານ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div classNameName="row mt-1">
            <div classNameName="form-group">
              <label classNameName="control-label">ອັບໂຫຼດຮູບໂປຣໄຟຣ໌</label>
              <div style={{ textAlign: "center" }} for="file-upload">
                <input
                  type="file"
                  id="file-upload"
                  classNameName="bg-danger"
                  onChange={handleUpload}
                  hidden
                />
                <label htmlFor="file-upload" classNameName="long-border">
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

            <div classNameName="form-group mt-1">
              <label>ຊື່ {valiDate()}</label>
              <input
                type="text"
                classNameName={
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
            <div classNameName="form-group mb-2">
              <label>ນາມສະກຸນ {valiDate()}</label>
              <input
                type="text"
                classNameName={
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
          <div classNameName="form-group">
            <div>
              <label htmlFor="">ເພດ {valiDate()}</label>
            </div>
            <Gender onClick={(value) => setGender(value)} value={gender} />
            <span classNameName="invalid">{errors?.gender}</span>
          </div>
          <div classNameName="row mt-1">
            <div classNameName="form-group">
              <label>ເບີໂທ(+856 20) {valiDate()}</label>
              <input
                type="number"
                classNameName={
                  errors.phoneNumber
                    ? "form-control  is-invalid"
                    : "form-control  invalid"
                }
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                placeholder="7678XXXX"
              />
            </div>
            <div classNameName="form-group">
              <label>ບັດປະຈຳຕົວ</label>
              <input
                type="text"
                classNameName={
                  errors.carSign
                    ? "form-control  is-invalid"
                    : "form-control  invalid"
                }
                name="carSign"
                value={values.carSign}
                onChange={handleChange}
                placeholder="ປ້ອນເລກບັດ"
              />
            </div>
          </div>
          <div classNameName="form-row mt-1">
            <div classNameName="col-md-12">
              <div>
                <SelectProvince
                  size={"lg"}
                  getData={(data) => {
                    setProvinceData(data);
                    setDistrictData({});
                  }}
                  defaultValue={provinceData?.provinceName}
                  classNameName={errors.province ? "is-invalid" : ""}
                />
                <div classNameName="text-danger">{errors.province}</div>
              </div>
            </div>
          </div>
          <div classNameName="form-row mt-1">
            <div classNameName="col-md-12">
              <SelectDistrict
                size={"lg"}
                getData={(data) => {
                  setDistrictData(data);
                  setVillageData({});
                }}
                provinceId={{ _id: provinceData?._id }}
                defaultValue={districtData?.title}
                classNameName={errors?.district ? "is-invalid" : ""}
              />
              <div classNameName="text-danger">{errors.district}</div>
            </div>
          </div>
          <div classNameName="form-row mt-1">
            <div classNameName="col-md-12">
              <SelectVillage
                size={"lg"}
                getData={(data) => {
                  setVillageData(data);
                }}
                districtId={{ _id: districtData?._id }}
                defaultValue={viLLage?.title}
                classNameName={errors?.village ? "is-invalid" : ""}
              />
            </div>
          </div>
          <div classNameName="row">
            <div classNameName="col-md-12 mt-1">
              <div classNameName="form-group mb-2">
                <SelectLocalHouse
                  size={"lg"}
                  getData={(data) => {
                    setHouse(data);
                  }}
                  provinceId={{ _id: provinceData?._id }}
                  defaultValue={getHouse?.houseName}
                  classNameName={errors.house ? "is-invalid" : ""}
                />
                <div classNameName="text-danger">{errors.house}</div>
              </div>
            </div>
          </div>
          <div classNameName="form-group mt-1">
            <label>ເລືອກຕຳແຫນ່ງ {valiDate()}</label>
            <select
              classNameName="form-select"
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
          <div classNameName="form-group mt-1">
            <label>ວັນທີ່ເລີ່ມງານ</label>
            <input
              type="date"
              classNameName="form-control form-control-lg"
              name="startWorkTime"
              value={formatDateDash(startWorkTime)}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="ເລືອກວັນທີ່"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            classNameName="btn btn-primary btn-block btn-lg"
            onClick={() => handleSubmit()}
          >
            <i classNameName="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
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
