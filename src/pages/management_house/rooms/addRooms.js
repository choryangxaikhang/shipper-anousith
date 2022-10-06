import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import Notiflix, { Loading } from "notiflix";
import "./utils/index.css";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import {
  getLocalHouse,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
} from "../../../helper";
import { CREATE_ROOM } from "./apollo";
import TypeRoom from "../../../helper/components/typeRoom";
import { s3Client } from "../../../helper/s3Client";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SearchTypeRoom from "../../../helper/components/SearchTypeRoom";
import { useInternalState } from "@apollo/client/react/hooks/useQuery";
import SelectLocalHouse from "../../../helper/components/SelectLocalHouse";
export default function AddRooms({ onSuccess, loadData, className }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [typeDataRoom, setTypeDataRoom] = useState({});
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [createRoom] = useMutation(CREATE_ROOM);
  const [getDocFiless, setDocFiless] = useState([]);
  const [getFileNames, setFileNames] = useState([]);
  const [status, setStatus] = useState(false);
  const userState = getStaffLogin();
  const userData = userState?.data;
  const [getHouse, setHouse] = useState("");
  useEffect(() => {
    setHouse(getLocalHouse())
  }, []);
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
  const removeArray = (index) => {
    getDocFiless.splice(index, 1);
    setDocFiless(getDocFiless);

    getFileNames.splice(index, 1);
    setFileNames(getFileNames);
    setStatus(!status);
  };
  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {
      title_lao: "",
      title_eng: "",
      priceHalf: 0,
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
      if (getDocFiless.length < 1) {
        errors.docFile = "ກະລຸນາເລືອກຮູບກ່ອນ";
      }
      if (!getHouse?._id) errors.house = "ເລືອກກິດຈະການ";
      if (!typeDataRoom?._id) errors.typeRoom = "ກະລູນາເລືອກປະເພດຫ້ອງ";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      loadingScreen();
      console.log("values", values);
      console.log("imageName", imageName);
      // return
      try {
        const { data: updated } = await createRoom({
          variables: {
            data: {
              title_lao: String(values?.title_lao),
              title_eng: String(values?.title_eng),
              priceHalf: parseInt(values?.priceHalf),
              priceFull: parseInt(values?.priceFull),
              detail: String(values?.detail),
              house: String(getHouse?._id),
              typeRoom: String(typeDataRoom?._id),
              coverImage: getDocFiless ? String(getDocFiless.join(",")) : "",
              images: String(imageName),
            },
          },
        });
        if (updated) {
          Notiflix.Loading.remove();
          messageSuccess("ການດຳເນີນງານສຳເລັດ");
          onSuccess(loadData === true ? false : true);
          setFile("");
          setFileNames("");
          setDocFiless("");
          resetForm();
          setShow(false);
        } else {
          Notiflix.Loading.remove();
          messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
      }
    },
  });

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg btn-block"
        onClick={() => setShow(true)}
      >
        <i className="icon-plus-circle me-1" /> ເພີ່ມຫ້ອງ
      </button>
      <Modal show={show} size="xl">
        <Modal.Header>
          ເລືອກປະເພດຫ້ອງ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body>
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
                      // style={{ width: 300, height: 250 }}
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
            <div className="col-md-6">
              <div className="form-group mb-2">
                <SearchTypeRoom
                  style={{ height: "100%", backgroundColor: "red" }}
                  value={typeDataRoom?._id}
                  onChange={(obj) => {
                    setTypeDataRoom(obj);
                  }}
                />
                <div className="text-danger">{errors.typeRoom}</div>
              </div>
            </div>
            <div className="col-md-6">
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
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      ພາສາອັງກິດ:
                    </InputAdornment>
                  }
                  onWheel={(e) => e.target.blur()}
                  type="text"
                  name="title_eng"
                  placeholder="..."
                  value={values.title_eng}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.title_eng}</div>
              </FormControl>
            </div>
          </div>

          <div className="form-row mt-3">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">ຄ້າງຄືນ:</InputAdornment>
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
            </div>
          </div>
          <div className="form-row mt-3">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">ຊົ່ວຄາວ:</InputAdornment>
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

          <div className="form-row mt-3">
            <label className="text-black">ລາຍລະອຽດ</label>
            <div className="col-md-12">
              <textarea
                rows={3}
                style={{ color: "black" }}
                name="detail"
                className="form-control form-control-lg"
                placeholder="..."
                onChange={handleChange}
                value={values?.detail}
              ></textarea>
            </div>
          </div>
          <div className="form-group mt-2">
            <label>ຮູບພາບ (ເລືອກຫຼາຍຮູບພ້ອມກັນ) {valiDate()}</label>
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
          <hr />
          <div className="form-group mb-2">
            <label>ຟາຍທີ່ອັບໂຫລດແລ້ວ</label>
            <hr />
            <div>
              <div className="col-md-12">
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
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => handleSubmit()}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
