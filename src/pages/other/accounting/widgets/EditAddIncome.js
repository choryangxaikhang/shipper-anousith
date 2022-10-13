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
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  toDayDash,
  valiDate,
} from "../../../../helper";
import { CREATE_EXPENSES, UPDATE_EXTRA_EXPENSE } from "../apollo";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../../../helper/s3Client";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SelectIncomeType from "../../../../helper/components/SelectIncomeType";
export default function EditAddIncome({ getData, onSuccess }) {
  const [show, setShow] = useState(false);
  const [upDateExtra] = useMutation(UPDATE_EXTRA_EXPENSE);
  const [userData, setUserData] = useState({});
  const [startDate, setStartDate] = useState(toDayDash());
  const getUser = userData?.firstName + " " + userData?.lastName;
  const [getTypeIncome, setTypIncome] = useState();
  // state price
  const [inputPrice, setInputPrice] = useState();

  useEffect(() => {
    const local = getStaffLogin();
    setUserData(local?.data);
  }, []);
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [localHouse, setLocalHouse] = useState("");
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
  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    resetForm,
    setFieldValue,
    submitCount,
  } = useFormik({
    initialValues: {
      detail: "",
      incomeKIP: "",
      extraType: "INCOME",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (inputPrice <= 0) {
        errors.incomeKIP = "ກະລູນາປ້ອນຈຳນວນເງິນ ຕ້ອງຫລາຍກວ່າ 0";
      }
      if (!getTypeIncome?.id_income)
        errors.incomeType = "ກະລູນາເລືອກປະເພດລາຍຮັບ";
      return errors;
    },
    onSubmit: async (values) => {
      loadingScreen();
      try {
        const { data: _create } = await upDateExtra({
          variables: {
            data: {
              incomeKIP: parseInt(inputPrice),
              accountantDate: String(startDate),
              fileUpload: String(imageName),
              StaffFullName: String(getUser),
              house: String(localHouse),
              detail: String(values.detail),
              extraType: "INCOME",
              incomeType: String(getTypeIncome?.id_income),
            },
            where: {
              id_list: parseInt(getData?.id_list),
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
        console.log(error);
        setShow(false);
      }
    },
  });

  useEffect(() => {
    if (!show) {
      return;
    }
    setTypIncome(getData?.incomeType);
    setFieldValue(
      "accountantDate",
      getData?.accountantDate ? getData?.accountantDate : "",
      false
    );
    setFieldValue("detail", getData?.detail ? getData?.detail : "", false);
    setInputPrice(getData?.incomeKIP ? getData?.incomeKIP : 0);
  }, [getData, show]);

  return (
    <>
      <button className=" btn btn-sm" onClick={() => setShow(true)}>
        <i className="fas fa-edit" />
      </button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <h3>ຟອມແກ້ໄຂລົງລາຍຮັບ</h3>
          <a
            className="pull-right float-end "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <div className="form-row  mt-1">
            <div className="col-md-12">
              <TextField
                label=" "
                variant="outlined"
                name="fileUpload"
                onChange={handleUpload}
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                sx={{
                  m: 0,
                  width: "100%",
                  backgroundColor: "#ffff",
                }}
              />
              <i className="text-danger">{errors.fileUpload}</i>
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12 mt-1">
              <SelectIncomeType
                style={{ minWidth: 200 }}
                value={getTypeIncome?.id_income}
                onChange={(obj) => {
                  if (obj?.id_income) {
                    setTypIncome(obj);
                  }
                }}
              />
              <div className="text-danger">{errors.incomeType}</div>
            </div>
          </div>
          <div className="form-row  mt-1">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      ຈຳນວນເງິນ:{" "}
                    </InputAdornment>
                  }
                  type="number"
                  placeholder="ລາຍຮັບ"
                  onWheel={(e) => e.target.blur()}
                  value={inputPrice}
                  name="incomeKIP"
                  onChange={(e) => {
                    setInputPrice(e.target.value);
                  }}
                />
              </FormControl>
              <div className="text-danger">{errors.incomeKIP}</div>
            </div>
          </div>
          <div className="form-row  mt-1">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">ວັນທີ່: </InputAdornment>
                  }
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
            </div>
          </div>
          <div className="form-row  mt-1">
            <label className="text-black ">ລາຍລະອຽດ</label>
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
          </div>
        </div>
        <Modal.Footer className="border-top">
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
    </>
  );
}
