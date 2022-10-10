// import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import "./utils/index.css";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import {
  aws_url_image,
  aws_url_images,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
} from "../../../helper";
import { EDIT_ROOM } from "./apollo";
import TypeRoom from "../../../helper/components/typeRoom";
import { s3Client } from "../../../helper/s3Client";
import Notiflix, { Loading } from "notiflix";
import male from "../../../img/male.png";
import SearchTypeRoom from "../../../helper/components/SearchTypeRoom";
import SelectLocalHouse from "../../../helper/components/SelectLocalHouse";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
export default function EditRooms({ onSuccess, data, loadData }) {
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
  const userState = getStaffLogin();
  const userData = userState?.data;
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
  for (let i = 0; i < getDocFiles?.split(",").length; i++) {
    newArray.push(getDocFiles?.split(",")[i]);
  }
  const removeArray = (index) => {
    getDocFiless.splice(index, 1);
    setDocFiless(getDocFiless);

    getFileNames.splice(index, 1);
    setFileNames(getFileNames);
    setStatus(!status);
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
      title_lao: "",
      title_eng: "",
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
          onSuccess(loadData === true ? false : true);
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
    if (!show) {
      return;
    }
    setFieldValue("title_lao", data?.title_lao ? data?.title_lao : "", false);
    setFieldValue("title_eng", data?.title_eng ? data?.title_eng : "", false);
    setFieldValue("priceFull", data?.priceFull ? data?.priceFull : 0, false);
    setFieldValue("priceHalf", data?.priceHalf ? data?.priceHalf : 0, false);
    setFieldValue("detail", data?.detail ? data?.detail : "", false);
    setValueStatus(data.status);
    setTypeDataRoom(data?.typeRoom);
    setHouse(data?.house);
  }, [data, show]);
  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => setShow(true)}
      >
        <i className="fas fa-edit" />
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header>
          {" "}
          ຟອມແກ້ໄຂຂໍ້ມູນຫ້ອງ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
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
                {/* <TypeRoom
                  size={"lg"}
                  getData={(data) => {
                    setTypeDataRoom(data);
                  }}
                  defaultValue={typeDataRoom?.title_lao}
                  className={errors.typeRoom ? "is-invalid" : ""}
                /> */}
                <SearchTypeRoom
                  style={{ height: "100%", backgroundColor: "red" }}
                  value={typeDataRoom?._id}
                  onChange={(obj) => {
                    setTypeDataRoom(obj);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <div className="form-group mb-2">
                <SelectLocalHouse
                  style={{ width: "100%" }}
                  value={getHouse?._id}
                  onChange={(obj) => {
                    if (obj?._id) {
                      setHouse(obj);
                    }
                  }}
                  ownerId={userData?._id}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ພາສາລາວ:</InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="text"
                name="title_lao"
                placeholder="..."
                value={values.title_lao}
                onChange={handleChange}
                error={errors.title_lao}
              />
              <div className="text-danger">{errors.title_lao}</div>
            </FormControl>
          </div>
          <div className="form-row mt-3">
            <div>
              <div className="col-md-12">
                <FormControl fullWidth sx={{ m: 0 }}>
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        ພາສາອັງກີດ:
                      </InputAdornment>
                    }
                    onWheel={(e) => e.target.blur()}
                    type="text"
                    name="title_lao"
                    placeholder="..."
                    value={values.title_eng}
                    onChange={handleChange}
                    error={errors.title_eng}
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-md-6">
              <div className="form-row mt-2">
                <div className="col-md-12">
                  <FormControl fullWidth sx={{ m: 0 }}>
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          ຄ້າງຄືນ:
                        </InputAdornment>
                      }
                      onWheel={(e) => e.target.blur()}
                      type="number"
                      name="priceFull"
                      placeholder="..."
                      value={values.priceFull}
                      error={errors.priceFull}
                      onChange={handleChange}
                    />
                    <div className="text-danger">{errors.priceFull}</div>
                  </FormControl>
                  <div className="invalid fs-5">{errors?.priceFull}</div>
                </div>
              </div>
            </div>
            <div className="col-md-6 ml-auto">
              <div className="form-row mt-2">
                <div className="col-md-12">
                  <FormControl fullWidth sx={{ m: 0 }}>
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          ຊົ່ວຄາວ:
                        </InputAdornment>
                      }
                      onWheel={(e) => e.target.blur()}
                      type="number"
                      name="priceHalf"
                      placeholder="..."
                      value={values.priceHalf}
                      onChange={handleChange}
                    />
                    <div className="text-danger">{errors.priceHalf}</div>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="form-row mt-3">
            <label className="text-black">ລາຍລະອຽດ</label>
            <div className="col-md-12">
              <textarea
                rows={3}
                name="detail"
                style={{ color: "black" }}
                className="form-control form-control-lg"
                placeholder="ປ້ອນລາຍລະອຽດ"
                onChange={handleChange}
                value={values?.detail}
              ></textarea>
            </div>
          </div>
          <div className="form-group mt-2">
            <label>ຮູບພາບ (ເລືອກຫຼາຍຮູບພ້ອມກັນ) {valiDate()}</label>
            {/* <input
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
            /> */}
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                type="file"
                name="docFile"
                value={values.docFile}
                onChange={handleUploadDocFile}
                placeholder="ເລືອກຮູບ"
                error={errors.docFile}
                multiple
              />
              <div className="text-danger">{errors.docFile}</div>
            </FormControl>
          </div>
          <div className="form-group mb-2">
            <label>ຟາຍທີ່ອັບໂຫລດແລ້ວ</label>
            <div>
              <div className="col-md-12">
                {getFileNames.length === 0 ? (
                  <>
                    {newArray &&
                      newArray.map((item, index) => (
                        <>
                          <div className="row mb-0 border-bottom" key={index}>
                            <div className="col-md-6">
                              <h4>{item}</h4>
                            </div>
                          </div>
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
                        </>
                      ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => handleSubmit()}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
