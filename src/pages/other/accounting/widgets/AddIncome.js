import Notiflix, { Loading } from "notiflix";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  currency,
  formatDateTime,
  getLocalHouse,
  getLocalProvince,
  getStaffLogin,
  messageError,
  messageSuccess,
  messageWarning,
  toDayDash,
  valiDate,
} from "../../../helper";
import { CREATE_EXPENSES } from "../apollo";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../../helper/s3Client";
import { TextField } from "@mui/material";
import InComeType from "../../../helper/components/InComeType";
export default function AddIncome({ onSuccess }) {
  const [show, setShow] = useState(false);
  const componentRef = useRef(null);
  const [createIncome] = useMutation(CREATE_EXPENSES);
  const [userData, setUserData] = useState({});
  const [localBranch, setLocalBranch] = useState("");
  const [startDate, setStartDate] = useState(toDayDash());
  const getUser = userData?.firstName + " " + userData?.lastName;
  const [getTypeIncome, setTypIncome] = useState({});
  useEffect(() => {
    const local = getStaffLogin();
    setUserData(local?.data);
  }, []);
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [localHouse, setLocalHouse] = useState("")
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  const handleUpload = async (event) => {
    const imageName = uuidv4() + "." + event.target.files[0].type.split("/")[1];
    const _file = event.target.files[0];
    setFile(_file);
    const res = await s3Client.uploadFile(_file, imageName);
    if (res?.location) {
      setFile(_file);
      setImageName(imageName);
      messageSuccess("ອັບໂຫຼດເອກະສານສຳເລັດແລ້ວ");
    } else {
      setFile(null);
      setImageName("");
      messageWarning("ອັບໂຫຼດເອກະສານບໍ່ສຳເລັດ");
    }
  };

  const { handleChange, errors, values, handleSubmit, resetForm, submitCount } =
    useFormik({
      initialValues: {
        detail: "",
        incomeKIP: "",
        extraType: "INCOME",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.incomeKIP) {
          errors.incomeKIP = "ກະລູນາປ້ອນຈຳນວນເງິນ";
        }
        if(!getTypeIncome?.id_income) errors.incomeType =("ກະລູນາເລືອກປະເພດລາຍຮັບ");
        return errors;
      },
      onSubmit: async (values) => {
        Loading.dots();
        try {
          const { data: _create } = await createIncome({
            variables: {
              data: {
                incomeKIP: parseInt(values.incomeKIP),
                accountantDate: String(startDate),
                fileUpload: String(imageName),
                StaffFullName: String(getUser),
                house: String(localHouse),
                detail: String(values.detail),
                extraType: "INCOME",
                incomeType: String(getTypeIncome?.id_income)
              },
            },
          });
          if (_create) {
            Notiflix.Loading.remove();
            messageSuccess("ລົງລາຍຮັບສຳເລັດແລ້ວ");
            onSuccess();
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
            setShow(false);
          } else {
            Notiflix.Loading.remove();
            messageError("ລົງລາຍຮັບບໍສຳເລັດ");
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
            onSuccess();
          }
        } catch (error) {
          Notiflix.Loading.remove();
          messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          onSuccess();
        }
      },
    });

  return (
    <>
      <button
        className="btn btn-success btn-block me-1 text-nowrap shadow-none"
        onClick={() => setShow(true)}
      >
        <i class="fa-solid fa-hand-holding-dollar"></i> ລົງລາຍຮັບ
      </button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <h3>ຟອມລົງລາຍຮັບ</h3>
        </Modal.Header>
        <Modal.Body className="container">
          <div className="col-md-12">
            <div className="form-group">
              <TextField
                label=" " variant="outlined"
                name="fileUpload"
                onChange={handleUpload}
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                sx={{
                  m: 0, width: '100%', backgroundColor: "#ffff"
                }}
              />
              <i className="text-danger">{errors.fileUpload}</i>
            </div>

          </div>

          <div className="form-row">
            <div className="col-md-12 ms-1 mt-3">
              <InComeType
                size={"lg"}
                getData={(data) => {
                  setTypIncome(data);
                }}
                defaultValue={getTypeIncome?.incomeTitle}
              />
              <div className="text-danger fs-5">{errors.incomeType}</div>
            </div>
          </div>
          <div className="form-row  mt-3">
            <div className="col-md-12 ms-1">
              <TextField
                label="ລາຍຮັບ" variant="outlined"
                type="number"
                name="incomeKIP"
                onWheel={(e) => e.target.blur()}
                value={values?.incomeKIP}
                onChange={handleChange}
                sx={{
                  m: 0, width: '100%', backgroundColor: "#ffff"
                }}
                error={errors.incomeKIP}
              />
              <div className="text-danger fs-5">{errors.incomeKIP}</div>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <TextField
              label="ວັນທີ່" variant="outlined"
              name="accountantDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{
                m: 0, width: '100%', backgroundColor: "#ffff"
              }}
            />
          </div>
          <label className="text-black mt-2">ລາຍລະອຽດ</label>
          <div className="col-md-12">
            <textarea
              rows={3}
              name="detail"
              className="form-control form-control-lg text-black"
              placeholder="..."
              onChange={handleChange}
              value={values?.detail}
            ></textarea>
          </div>
          <div className="col-md-12 mt-3">
            <TextField
              label="ພະນັກງານ" variant="outlined"
              name="accountantDate"
              type="text"
              defaultValue={getUser}
              disabled={true}
              sx={{
                m: 0, width: '100%', backgroundColor: "#ffff"
              }}
            />
          </div>

          <hr className="text-danger" />
          <div className="col-md-md-2 mt-3 text-end">
            <button
              className="btn btn-primary ms-2"
              onClick={() => handleSubmit()}
            >
              <i className="fas fa-save me-1" />
              ບັນທຶກ
            </button>
            <button
              className="btn btn-light ms-2"
              onClick={() => setShow(false)}
            >
              <i class="fa-solid fa-rectangle-xmark me-1" />
              ຍົກເລີກ
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
