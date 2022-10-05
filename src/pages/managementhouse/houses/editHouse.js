import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import {
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
  aws_url_images,
  loadingScreen,
} from "../../../helper";
import { EDIT_HOUSE, QUERY_TYPE_HOUSE } from "./apollo";
import Provinces from "../../../helper/components/Province";
import Village from "../../../helper/components/Village";
import District from "../../../helper/components/District";
import Notiflix, { Loading } from "notiflix";
import male from "../../../img/males.png";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../../helper/s3Client";
import TypeHouses from "../../../helper/components/TypeHouse";
import SelectTypeHouse from "../../../helper/components/SelectTypeHouse";
export default function EditHouse({ data, onSuccess }) {
  const [provinceData, setProvinceData] = useState(data.province);
  const [show, setShow] = useState(false);
  const [upData] = useMutation(EDIT_HOUSE);
  const handleClose = () => setShow(false);
  const [districtData, setDistrictData] = useState(data.district);
  const [viLLage, setVillageData] = useState(data.village);
  const [isMain, setMain] = useState("MAIN");
  const [getPublic, setPublic] = useState("ACTIVE");
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [typeHouse, setListTypeHouse] = useState();

  // const [queryTypeHouse, { data: queryTypeHouseData }] = useLazyQuery(
  //   QUERY_TYPE_HOUSE,
  //   { fetchPolicy: "cache-and-network" }
  // );

  // useEffect(() => {
  //   queryTypeHouse();
  // }, []);

  // useEffect(() => {
  //   if (queryTypeHouseData) {
  //     setTypeHouse(queryTypeHouseData?.typeHouses?.data);
  //   }
  // }, [queryTypeHouseData]);

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

  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    resetForm,
    setFieldValue,
    isDisabled,
  } = useFormik({
    initialValues: {
      houseName: "",
      powerTime: "",
      map_lat: "",
      map_lng: "",
      contactPhone: "",
      contactEmail: "",
      contactWebsite: "",
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
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: updated } = await upData({
          variables: {
            data: {
              houseName: String(values?.houseName),
              province: String(provinceData?._id),
              district: String(districtData?._id),
              village: String(viLLage?._id),
              public: String(getPublic),
              mainHouses: String(isMain),
              powerTime: String(values?.powerTime),
              map_lat: String(values?.map_lat),
              map_lng: String(values?.map_lng),
              ...(imageName && imageName
                ? { coverImage: String(imageName) }
                : ""),
              contactPhone: parseInt(values?.contactPhone),
              contactEmail: String(values.contactEmail),
              contactWebsite: String(values?.contactWebsite),
              type: String(typeHouse?._id),
            },
            where: {
              _id: parseInt(data?._id),
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
        console.log(error);
        Notiflix.Loading.remove();
        messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
      }
    },
  });

  useEffect(() => {
    if (!show) {
      return;
    }
    setFieldValue("houseName", data?.houseName ? data?.houseName : "", false);
    setFieldValue("powerTime", data?.powerTime ? data?.powerTime : "", false);
    setFieldValue("map_lat", data?.map_lat ? data?.map_lat : "", false);
    setFieldValue("map_lng", data?.map_lng ? data?.map_lng : "", false);
    setFieldValue(
      "contactPhone",
      data?.contactPhone ? data?.contactPhone : "",
      false
    );
    setFieldValue(
      "contactEmail",
      data?.contactEmail ? data?.contactEmail : "",
      false
    );
    setFieldValue(
      "contactWebsite",
      data?.contactWebsite ? data?.contactWebsite : "",
      false
    );
    setListTypeHouse(data?.type ? data?.type : "", false)
    // setFieldValue("type", data?.type ? data?.type : "", false);
  }, [data, show]);

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => setShow(true)}
      >
        <i className="icon-edit" />
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
            <i className="icon-edit" /> ຟອມແກ້ໄຂຂໍ້ມູນກິຈະການ
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
                      // style={{ width: 300, height: 250 }}
                      style={{
                        height: 200,
                        width: 200,
                        borderRadius: 100 / 2,
                      }}
                    />
                  ) : (
                    <img
                      src={
                        data?.coverImage
                          ? aws_url_images + data?.coverImage
                          : male
                      }
                      style={{ width: "170px", height: "180px" }}
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="form-row mt-2">
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
            <div className="col-md-4 mt-2">
              <div className="form-row mt-2">
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
            <div className="col-md-4 mt-2">
              <div className="form-row mt-2">
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
          <div className="row mt-3">
            <div className="form-group col-6">
              <label>ປະເພດກິດຈະການ {valiDate()}</label>
              <SelectTypeHouse
                style={{ minWidth: 200 }}
                value={typeHouse?._id}
                onChange={(obj) => {
                  if (obj?._id) {
                    setListTypeHouse(obj);
                  }
                }}
              />
              {/* <select
                className={
                  errors.type
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="type"
                onChange={handleChange}
              >
                {typeHouse.map((item, index) => (
                  <option
                    value={item._id}
                    selected={data?.type?._id === item?._id ? true : false}
                  >
                    {item.title_lao}
                  </option>
                ))}
              </select> */}
            </div>
            <div className="form-group col-6">
              <label>ຊື່ກິດຈະການ {valiDate()}</label>
              <input
                type="text"
                style={{color: "black" }}
                className={
                  errors.houseName
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                name="houseName"
                value={values.houseName}
                onChange={handleChange}
                placeholder="ປ້ອນຊື່ກິດຈະການ"
              />
            </div>
            <div className="col-md-6">
              <div className="form-row mt-2">
                <label className="text-black">ເສັ້ນແວງ {valiDate()}</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    style={{color: "black" }}
                    className={
                      errors.map_lat
                        ? "form-control mb-3 is-invalid"
                        : "form-control mb-3 invalid"
                    }
                    name="map_lat"
                    value={values.map_lat}
                    onChange={handleChange}
                    placeholder="ຂໍ້ມູນເສັ້ນແວງ"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 ml-auto">
              <div className="form-row mt-2">
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

          <div className="form-group mt-3">
            <label>ເວລາເປີດ {valiDate()}</label>
            <input
              type="time"
              style={{color: "black" }}
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

          <div className="row mt-1">
            <div className="col-md-6">
              <div className="form-row">
                <label className="text-black">ເບີໂທ {valiDate()}</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    style={{color: "black" }}
                    className={
                      errors.contactPhone
                        ? "form-control mb-3 is-invalid"
                        : "form-control mb-3 invalid"
                    }
                    name="contactPhone"
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
                    style={{color: "black" }}
                    className="form-control form-control-lg"
                    name="contactEmail"
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
                style={{color: "black" }}
                className="form-control form-control-lg"
                name="contactWebsite"
                value={values.contactWebsite}
                onChange={handleChange}
                placeholder="ປ້ອນເວັບໄຊສ໌"
              />
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
            className="btn btn-light  btn-sm"
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
