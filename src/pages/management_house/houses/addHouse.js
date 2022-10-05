// import { useLazyQuery } from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ADD_HOUSE, QUERY_TYPE_HOUSE } from "./apollo";
import { useFormik } from "formik";
import {
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
} from "../../../helper";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import Provinces from "../../../helper/components/Province";
import District from "../../../helper/components/District";
import Village from "../../../helper/components/Village";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { s3Client } from "../../../helper/s3Client";
import TypeHouses from "../../../helper/components/TypeHouse";
export default function AddHouses({ onSuccess }) {
  const [show, setShow] = useState(false);
  const [addHouse] = useMutation(ADD_HOUSE);
  const handleClose = () => setShow(false);
  const [provinceData, setProvinceData] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [viLLage, setVillageData] = useState({});
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [typeHouse, setTypeHouse] = useState([]);

  const [queryTypeHouse,{data:queryTypeHouseData}] = useLazyQuery(QUERY_TYPE_HOUSE,{'fetchPolicy':'cache-and-network'});

  // pictrue
  const handleUpload = async (event) => {
    const imageName = uuidv4() + "." + event.target.files[0].type.split("/")[1];
    const _file = event.target.files[0];
    setFile(_file);
    const res = await s3Client.uploadFile(_file, imageName);
    if (res?.location) {
      setFile(_file);
      setImageName(imageName);
      messageSuccess("ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ");
    } else {
      setFile(null);
      setImageName("");
      messageWarning("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
    }
  };

  useEffect(()=>{
    queryTypeHouse();
  },[])
  useEffect(()=>{
    if(queryTypeHouseData){
      setTypeHouse(queryTypeHouseData?.typeHouses?.data)
    }
  },[queryTypeHouseData])

  const { handleChange, errors, values, handleSubmit, resetForm, isDisabled } =
    useFormik({
      initialValues: {
        houseName: "",
        powerTime: "",
        map_lat: "",
        map_lng: "",
        contactPhone: "",
        contactEmail: "",
        contactWebsite: "",
        type: "",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.houseName) {
          errors.houseName = "error";
        }
        if (!values.powerTime) {
          errors.powerTime = "error";
        }
        if (!values.map_lat) {
          errors.map_lat = "error";
        }
        if (!values.map_lng) {
          errors.map_lng = "error";
        }
        if (!provinceData?._id) errors.province = "error";
        if (!districtData?._id) errors.district = "error";
        if (!viLLage?._id) errors.village = "error";
        if (!values.contactPhone) errors.contactPhone = "error";
        if (!values?.type) errors.type = "error";
        return errors;
      },
      onSubmit: async (values) => {
        loadingScreen();
        try {
          const { data: updated } = await addHouse({
            variables: {
              data: {
                houseName: values?.houseName,
                province: String(provinceData?._id),
                district: String(districtData?._id),
                village: String(viLLage?._id),
                powerTime: String(values?.powerTime),
                map_lat: String(values?.map_lat),
                map_lng: String(values?.map_lng),
                coverImage: String((values.coverImage = imageName)),
                contactPhone: parseInt(values?.contactPhone),
                contactEmail: String(values.contactEmail),
                contactWebsite: String(values?.contactWebsite),
                type: values?.type,
              },
            },
          });
          if (updated) {
            Notiflix.Loading.remove();
            messageSuccess("ການດຳເນີນງານສຳເລັດ");
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
            setShow(false);
            onSuccess();
            setImageName("");
          } else {
            Notiflix.Loading.remove();
            messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
          }
        } catch (error) {
          console.log(error)
          Notiflix.Loading.remove();
          messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
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
            <i className="icon-plus-circle" /> ຟອມເພີ່ມຂໍ້ມູນກິດຈະການ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="container">
          <div className="row mt-1">
            <div className="form-group">
              <label className="control-label">ອັບໂຫຼດຮູບ</label>
              <div
                style={{ textAlign: "center" }}
                for="file-upload"
                className="long"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="bg-danger"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={handleUpload}
                  hidden
                />
                <label for="file-upload" style={{ padding: 20 }}>
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        height: 200,
                        width: 200,
                        borderRadius: 100 / 2,
                      }}
                    />
                  ) : (
                    <AddCircleOutlineTwoToneIcon
                      style={{ fontSize: 45 }}
                      className="text-secondary"
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-4 mt-1">
              <div className="form-row mt-1">
                <div>
                  <label className="text-black">ແຂວງ {valiDate()}</label>
                  <Provinces
                    size={"lg"}
                    getData={(data) => {
                      setProvinceData(data);
                      setDistrictData({});
                    }}
                    defaultValue={provinceData?.provinceName}
                    className={errors.province ? "is-invalid" : ""}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-1">
              <div className="form-row mt-1">
                <label className="text-black">ເລືອກເມືອງ {valiDate()}</label>
                <div className="col-md-12">
                  <District
                    size={"lg"}
                    getData={(data) => {
                      setDistrictData(data);
                      setVillageData({});
                    }}
                    where={{ _id: provinceData?._id }}
                    defaultValue={districtData?.title}
                    className={errors?.district ? "is-invalid" : ""}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-1">
              <div className="form-row mt-1">
                <label className="text-black">ເລືອກບ້ານ {valiDate()}</label>
                <div className="col-md-12">
                  <Village
                    size={"lg"}
                    getData={(data) => {
                      setVillageData(data);
                    }}
                    where={{ _id: districtData?._id }}
                    defaultValue={viLLage?.title}
                    className={errors?.village ? "is-invalid" : ""}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-1">
          <div className="form-group ">
              <label>ປະເພດກິດຈະການ {valiDate()}</label>
              <select
                className={
                  errors.type
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="type"
                style={{color: "black" }}
                onChange={handleChange}
              >
                <option value="">ເລືອກປະເພດກິດຈະການ</option>
                {typeHouse.map((item, index) => (
                  <option value={item._id}>{item.title_lao}</option>
                ))}
              
              </select>
            </div>
            {/* <div className="form-group ">
              <label>ຊື່ປະເພດກິດຈະການ {valiDate()}</label>
              <TypeHouses
                size={"lg"}
                getData={(data) => {
                  setTypeHouse(data);
                }}
                defaultValue={typeHouse?.title_lao}
                className={errors?.type ? "is-invalid" : ""}
              />
            </div> */}
            <div className="form-group mt-2">
              <label>ຊື່ກິດຈະການ {valiDate()}</label>
              <input
                type="text"
                className={
                  errors.houseName
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="houseName"
                style={{color: "black" }}
                value={values.houseName}
                onChange={handleChange}
                placeholder="ປ້ອນຊື່ກິດຈະການ"
              />
            </div>
            <div className="col-md-6">
              <div className="form-row mt-1">
                <label className="text-black">ເສັ້ນແວງ {valiDate()}</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    className={
                      errors.map_lat
                        ? "form-control mb-3 is-invalid"
                        : "form-control mb-3 invalid"
                    }
                    style={{color: "black" }}
                    name="map_lat"
                    value={values.map_lat}
                    onChange={handleChange}
                    placeholder="ເສັ້ນແວງ"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 ml-auto">
              <div className="form-row mt-1">
                <label className="text-black">ເສັ້ນຂະຫນານ {valiDate()}</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    style={{color: "black" }}
                    className={
                      errors.map_lng
                        ? "form-control mb-3 is-invalid"
                        : "form-control mb-3 invalid"
                    }
                    name="map_lng"
                    value={values.map_lng}
                    onChange={handleChange}
                    placeholder="ຂໍ້ມູນເສັ້ນຂະຫນານ"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-md-6">
              <div className="form-row">
                <label className="text-black">ເບີໂທ {valiDate()}</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    className={
                      errors.contactPhone
                        ? "form-control mb-3 is-invalid"
                        : "form-control mb-3 invalid"
                    }
                    name="contactPhone"
                    style={{color: "black" }}
                    value={values.contactPhone}
                    onChange={handleChange}
                    placeholder="ປ້ອນເບີໂທ"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 ml-auto">
              <div className="form-row mt-1">
                <label className="text-black">ອີເມລ</label>
                <div className="col-md-12">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="contactEmail"
                    style={{color: "black" }}
                    value={values.contactEmail}
                    onChange={handleChange}
                    placeholder="ປ້ອນອີເມລ"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row mt-1">
            <label className="text-black">ເວບໄຊສ໌</label>
            <div className="col-md-12">
              <input
                type="text"
                className="form-control form-control-lg"
                name="contactWebsite"
                style={{color: "black" }}
                value={values.contactWebsite}
                onChange={handleChange}
                placeholder="ປ້ອນເວັບໄຊສ໌"
              />
            </div>
          </div>
          <div className="form-group mt-1">
            <label>ເວລາເປີດ {valiDate()}</label>
            <input
              type="time"
              className={
                errors.powerTime
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="powerTime"
              value={values.powerTime}
              onChange={handleChange}
              placeholder="ເວລາ"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            onClick={() => handleSubmit()}
            disabled={isDisabled}
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
