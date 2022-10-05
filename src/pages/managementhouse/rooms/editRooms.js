// import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import "./utils/index.css";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import {
  aws_url_image,
  aws_url_images,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
} from "../../../helper";
import { EDIT_ROOM } from "./apollo";
import TypeRoom from "../../../helper/components/typeRoom";
import Houses from "../../../helper/components/house";
import { s3Client } from "../../../helper/s3Client";
import Notiflix, { Loading } from "notiflix";
import male from "../../../img/males.png";
export default function EditRooms({ onSuccess, data, loadData }) {
  console.log("data",data)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [getValueStatus, setValueStatus] = useState();
  const [typeDataRoom, setTypeDataRoom] = useState();
  const [getHouse, setHouse] = useState();
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [createRoom] = useMutation(EDIT_ROOM);
  const [getDocFiles, setGetDocFiles] = useState(data.coverImage);
  const [getImages, setImages] = useState(data.images);
  const [getDocFiless, setDocFiless] = useState([]);
  const [getFileNames, setFileNames] = useState([]);
  const [status, setStatus] = useState(false);
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

  // upload any file
  const handleUploadDocFile = async (event) => {
    try {
      // setDocFiles(_image);
      const error = [];
      const success = [];
      const files = [];
      for (const doc of event.target.files) {
        files.push(doc.name);
        const docFileName = uuidv4() + "." + doc.type.split("/")[1];
        const res = await s3Client.uploadFile(doc, docFileName);
        if (res?.location) {
          success.push(docFileName);
        } else {
          error.push(docFileName);
        }
      }
      setFileNames(files);
      setDocFiless(success);
      messageSuccess("ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ");
    } catch (error) {
      console.log({ error });
    }
  };
  const newArray = [];
  for (let i = 0; i < getDocFiles?.split(',').length; i++) {
    newArray.push(getDocFiles?.split(",")[i]);
  }
  const removeArray = (index) => {
    getDocFiless.splice(index, 1);
    setDocFiless(getDocFiless);

    getFileNames.splice(index, 1);
    setFileNames(getFileNames);
    setStatus(!status);
  };
  const { handleChange, errors, values, handleSubmit, resetForm,setFieldValue } = useFormik({
    initialValues: {
      title_lao: "",
      title_eng:  "",
      priceHalf: "",
      priceFull: "",
      detail: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!values.title_lao) {
        errors.title_lao = "ກະລຸນາປ້ອນຫ້ອງ";
      }
      if (!values.priceFull) {
        errors.priceFull = "ກະລູນາປ້ອນລາຄາເຕັມ";
      }
      if (getDocFiles === "" && getDocFiless.length < 1) {
        errors.docFile = "ກະລຸນາເລືອກຮູບກ່ອນ";
      }
      if (!getHouse?._id) errors.house = "error";
      if (!typeDataRoom?._id) errors.typeRoom = "error";
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: updated } = await createRoom({
          variables: {
            data: {
              title_lao: String(values?.title_lao),
              title_eng: String(values?.title_eng),
              priceHalf: parseInt(values?.priceHalf),
              priceFull: parseInt(values?.priceFull),
              status: String(getValueStatus),
              detail: String(values?.detail),
              house: String(getHouse?._id),
              typeRoom: String(typeDataRoom?._id),
              coverImage:
                getDocFiless.length > 0
                  ? String(getDocFiless.join(","))
                  : getDocFiles,
              images: String(imageName ? imageName : getImages),
            },
            where: {
              _id: data?._id,
            },
          },
        });

        if (updated) {
          Notiflix.Loading.remove();
          messageSuccess("ການດຳເນີນງານສຳເລັດ");
          onSuccess(loadData===true?false:true);
          setFileNames("");
          setDocFiless("");
          setShow(false);
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
    if(!show){
      return
    }
    setFieldValue("title_lao", data?.title_lao ? data?.title_lao : "",false);
    setFieldValue("title_eng", data?.title_eng ? data?.title_eng : "",false);
    setFieldValue("priceFull", data?.priceFull ? data?.priceFull : 0,false);
    setFieldValue("priceHalf", data?.priceHalf ? data?.priceHalf : 0,false);
    setFieldValue("detail", data?.detail ? data?.detail : "", false);
    setValueStatus(data.status)
    setTypeDataRoom(data?.typeRoom)
    setHouse(data?.house) 
  }, [data,show])
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
            <i className="icon-edit" /> ຟອມແກ້ໄຂຂໍ້ມູນຫ້ອງ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="container">
          <div className="row">
            <div className="form-group">
              <label className="control-label">ອັບໂຫຼດຮູບໂປຣໄຟຣ໌ຫ້ອງ</label>
              <div
                style={{ textAlign: "center" }}
                for="file-upload"
                className="long"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="bg-danger"
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
                    <img
                      src={data?.images ? aws_url_images + data?.images : male}
                      style={{ width: "170px", height: "180px" }}
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <div className="form-group mb-2">
                <label>ເລືອກປະເພດຫ້ອງ {valiDate()}</label>
                <TypeRoom
                  size={"lg"}
                  getData={(data) => {
                    setTypeDataRoom(data);
                  }}
                  defaultValue={typeDataRoom?.title_lao}
                  className={errors.typeRoom ? "is-invalid" : ""}
                />
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <div className="form-group mb-2">
                <label>ເລືອກກິດຈະການ{valiDate()}</label>
                <Houses
                  size={"lg"}
                  getData={(data) => {
                    setHouse(data);
                  }}
                  defaultValue={getHouse?.houseName}
                  className={errors.house ? "is-invalid" : ""}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>ຊື່ຫ້ອງ {valiDate()}</label>
            <input
              type="text"
              style={{color: "black" }}
              className={
                errors.title_lao
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="title_lao"
              value={values.title_lao}
              onChange={handleChange}
              placeholder="ປ້ອນຫ້ອງພາສາລາວ"
            />
          </div>
          <div className="form-row mt-3">
            <div>
              <label className="text-black">ຊື່ຫ້ອງ (ພາສາອັງກິດ)</label>
              <div className="col-md-12">
                <input
                  type="text"
                  name="title_eng"
                  style={{color: "black" }}
                  className="form-control form-control-lg"
                  placeholder="ພາສາອັງກິດ"
                  onChange={handleChange}
                  value={values?.title_eng}
                />
              </div>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-md-6">
              <div className="form-row mt-2">
                <div>
                  <label className="text-black">ລາຄາເຕັມ {valiDate()}</label>
                  <div className="col-md-12">
                    <input
                      type="number"
                      style={{color: "black" }}
                      name="priceFull"
                      className={`form-control form-control-lg ${
                        errors?.priceFull ? "is-invalid" : null
                      }`}
                      placeholder="ພາສາອັງກິດ"
                      onChange={handleChange}
                      value={values?.priceFull}
                    />
                    <div className="invalid fs-5">{errors?.priceFull}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 ml-auto">
              <div className="form-row mt-2">
                <label className="text-black">ລາຄາສ່ວນຫຼຸບ</label>
                <div className="col-md-12">
                  <input
                    type="number"
                    name="priceHalf"
                    style={{color: "black" }}
                    className="form-control form-control-lg"
                    placeholder="ປ້ອນສ່ວນຫຼຸບ"
                    onChange={handleChange}
                    value={values?.priceHalf}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row mt-3 ml-auto">
            <div>
              <label className="text-black">ສະຖານະ {valiDate()}</label>
              <div className="col-md-12">
                <select
                  className="form-control form-control-lg"
                  name="status"
                  onChange={(e) => setValueStatus(e.target.value)}
                  value={getValueStatus}
                >
                  <option value="">ເລືອກສະຖານະ</option>
                  <option value="FULL">ຄ້າງຄືນ</option>
                  <option value="FEE">ຊົ່ວຄາວ</option>
                  <option value="BOOKING">ຈອງ</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-row mt-3">
            <div>
              <label className="text-black">ລາຍລະອຽດ</label>
              <div className="col-md-12">
                <textarea
                  rows={3}
                  name="detail"
                  style={{color: "black" }}
                  className="form-control form-control-lg"
                  placeholder="ປ້ອນລາຍລະອຽດ"
                  onChange={handleChange}
                  value={values?.detail}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="form-group mt-2">
            <label>ຮູບພາບ (ເລືອກຫຼາຍຮູບພ້ອມກັນ) {valiDate()}</label>
            <input
              type="file"
              className={
                errors.docFile
                  ? "form-control mb-3 is-invalid"
                  : "form-control mb-3 invalid"
              }
              name="docFile"
              value={values.docFile}
              onChange={handleUploadDocFile}
              placeholder="ເລືອກຮູບ"
              multiple
            />
          </div>
          <hr />
          <div className="form-group mb-2">
            <label>ຟາຍທີ່ອັບໂຫລດແລ້ວ</label>
            <hr />
            <div>
              <div className="col-md-12">
                {getFileNames.length === 0 ? (
                  <>
                    {newArray &&
                      newArray.map((item, index) => (
                        <>
                          <div className="row mb-0" key={index}>
                            <div className="col-md-6">
                              <h4>{item}</h4>
                            </div>
                          </div>
                          <hr />
                        </>
                      ))}
                  </>
                ) : (
                  <>
                    {getFileNames &&
                      getFileNames.map((item, index) => (
                        <>
                          <div className="row mb-0" key={index}>
                            <div className="col-md-6">
                              <h4>{item}</h4>
                            </div>
                            <div
                              className="col-md-6"
                              style={{ textAlign: "right" }}
                            >
                              <button
                                className="btn btn-icon btn-xs btn-danger rounded-circle dz-cancel"
                                onClick={() => removeArray(index)}
                              >
                                <i className="icon-delete"></i>
                              </button>
                            </div>
                          </div>
                          <hr />
                        </>
                      ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            onClick={() => handleSubmit()}
            // disabled={isDisabled}
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