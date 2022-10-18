import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ADD_USERSTAFF, UPDATE_USER } from "./apollo";
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
import * as ROUTES from "../../routes/app";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../helper/s3Client";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import SelectDistrict from "../../helper/components/SelectDistrict";
import SelectProvince from "../../helper/components/SelectProvince";
import SelectVillage from "../../helper/components/SelectVillage";
export default function EditUserStaff({ onSuccess, getData }) {
  const [show, setShow] = useState(false);
  const [role, setRole] = useState(getData?.role);
  const [update_user] = useMutation(UPDATE_USER);
  const handleClose = () => setShow(false);
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  const [provinceData, setProvinceData] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [viLLage, setVillageData] = useState({});

  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [gender, setGender] = useState(getData?.gender);
  const [getHouse, setHouse] = useState({});
  const [startWorkTime, setStartDate] = useState(
    formatDateDash(getData?.startWorkTime)
  );
  const [endWorkTime, setEndDate] = useState(
    formatDateDash(getData?.endWorkTime)
  );
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

  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      startWorkTime: "",
      endWorkTime: "",
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
      if (!role) errors.role = "error";
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
        const { data: create } = await update_user({
          variables: {
            data: {
              carSign: String(values?.carSign),
              startWorkTime: String(startWorkTime),
              endWorkTime: String(endWorkTime),
              firstName: String(values?.firstName),
              lastName: String(values?.lastName),
              phoneNumber: parseInt(values?.phoneNumber),
              profileImage: String((values.profileImage = imageName)),
              village: viLLage?._id,
              district: String(districtData?._id),
              province: String(provinceData?._id),
              role: String(role),
              gender: String(gender),
              house: String(getHouse?._id),
            },
            where: {
              _id: getData?._id,
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
        messageError("ແກ້ໄຂຂໍ້ມູນຜິດພາດ");
      }
    },
  });

  useEffect(() => {
    if (!show) {
      return;
    }
    setProvinceData(getData?.province);
    setDistrictData(getData?.district);
    setVillageData(getData?.village);
    setHouse(getData?.house);
    setFieldValue(
      "firstName",
      getData?.firstName ? getData?.firstName : "",
      false
    );
    setFieldValue(
      "lastName",
      getData?.lastName ? getData?.lastName : "",
      false
    );
    setFieldValue(
      "phoneNumber",
      getData?.phoneNumber ? getData?.phoneNumber : "",
      false
    );
    setFieldValue(
      "password",
      getData?.password ? getData?.password : "",
      false
    );
    setFieldValue(
      "startWorkTime",
      getData?.startWorkTime ? getData?.startWorkTime : "",
      false
    );
    setFieldValue(
      "endWorkTime",
      getData?.endWorkTime ? getData?.endWorkTime : "",
      false
    );
    setFieldValue("carSign", getData?.carSign ? getData?.carSign : "", false);
  }, [getData, show]);

  return (
    <React.Fragment>
      <button
        type="button"
        classNameName="btn btn-light btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      >
        <i classNameName="icon icon-edit"></i>
      </button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title classNameName="fs-5">
            <i classNameName="icon-edit" /> ແກ້ໄຂພະນັກງານ
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
              <label>ບັດປະຈຳຕົວ {valiDate()}</label>
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
  { value: "BRANCH_DIRECTOR", title: "ຫົວໜ້າບໍລິຫານກິດຈະການ" },
  { value: "CALL_CENTER", title: "ພ/ງ ຕ້ອນຮັບ" },
  { value: "ADMIN", title: "ເອັດມິນ" },
  { value: "SUPER_ADMIN", title: "ບໍລິຫານສູງສຸດ" },
  { value: "CUSTOMER_SERVICE", title: "ພ/ງ ບໍລິການລູກຄ້າ" },
  { value: "DRIVER_DIRECTOR", title: "ພ/ງ ຂັບລົດ" },
];
