import Notiflix, { Loading } from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { s3Client } from "../../../helper/s3Client";
import {
  currency,
  getLocalBranch,
  getLocalHouse,
  getStaffLogin,
  messageError,
  messageSuccess,
  messageWarning,
  toDayDash,
} from "../../../helper";
import _ from "lodash";
import male from "../../../img/other.png";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { CREATE_EXPENSES } from "../apollo";
import ExpressType from "../../../helper/components/ExpressTypes";
import { TextField } from "@mui/material";
export default function Expenses({ getData, onSuccess }) {
  const [show, setShow] = useState(false);
  const [createIncome] = useMutation(CREATE_EXPENSES);
  const [userData, setUserData] = useState({});
  const [localBranch, setLocalBranch] = useState("");
  const [startDate, setStartDate] = useState(toDayDash());
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [getTypeExpress, setTypExpress] = useState({});
  const getUser = userData?.firstName + " " + userData?.lastName;
  const [localHouse, setLocalHouse] = useState("")
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    const local = getStaffLogin();
    setUserData(local?.data);
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
      messageWarning("ການອັບໂຫຼດເອກະສານບໍ່ສຳເລັດ");
    }
  };

  const { handleChange, errors, values, handleSubmit, resetForm, submitCount } =
    useFormik({
      initialValues: {
        detail: "",
        expenseKIP: "",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!values.expenseKIP) {
          errors.expenseKIP = "ກະລູນາປ້ອນຈຳນວນເງິນ";
        }
        if (!values.detail) {
          errors.detail = "ກະລູນາປ້ອນລາຍລະອຽດ";
        }
        if (!imageName) errors.fileUpload = "ກະລູນາເລືອກບິນຈ່າຍກ່ອນ";
        if (!getTypeExpress?.id_expense) errors.expenseType = ("ກະລູນາເລືອກປະເພດລາຍຈ່າຍ");
        return errors;
      },
      onSubmit: async (values) => {
        Loading.dots();
        try {
          const { data: _create } = await createIncome({
            variables: {
              data: {
                accountantDate: String(startDate),
                fileUpload: String(imageName),
                StaffFullName: String(getUser),
                house: String(localHouse),
                detail: String(values.detail),
                extraType: "EXPENSE",
                expenseKIP: parseInt(values.expenseKIP),
                expenseType: String(getTypeExpress?.id_expense)
              },
            },
          });
          if (_create) {
            Notiflix.Loading.remove();
            messageSuccess("ລົງລາຍຈ່າຍສຳເລັດແລ້ວ");
            onSuccess();
            setImageName("");
            setTimeout(() => {
              resetForm({ values: "" });
              window.scrollTo(0, 0);
            }, 100);
            setShow(false);
          } else {
            messageError("ລົງລາຍຈ່າຍບໍສຳເລັດ");
            onSuccess();
          }
        } catch (error) {
          messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
          onSuccess();
        }
      },
    });

  const sumMoney = {
    endBalanceKIP: _.sumBy(getData?.extraExpenses?.data, "endBalanceKIP"),
  };

  const _data = getData?.extraExpenses?.data[0]?.endBalanceKIP;
  return (
    <>
      <button
        className="btn btn-warning btn-block text-nowrap shadow-none"
        onClick={() => setShow(true)}
      >
        <i className="fa-brands fa-amazon-pay"></i> ລົງລາຍຈ່າຍ
      </button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <h3>ຟອມລົງລາຍຈ່າຍ</h3>
        </Modal.Header>
        <Modal.Body className="container">
          <div className="col-md-12">
            <div className="form-group mb-3">
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
              <div className="text-danger mt-1 fs-5">{errors.fileUpload}</div>
            </div>
          </div>
          <div className="col-md-12 mt-3">
            <ExpressType
              size={"lg"}
              getData={(data) => {
                setTypExpress(data);
              }}
              defaultValue={getTypeExpress?.expenseTitle}
              className={errors.expenseType ? "is-invalid" : ""}
            />
            <div className="text-danger fs-5">{errors.expenseType}</div>
          </div>
          <div className="row mt-1">
            <div className="col-md-6">
              <div className="form-row mt-2">
                <div className="col-md-12 card mt-3 p-2"
                  style={{ height: "52px" }}
                >
                  ຍອດຄົງເຫຼືອ:
                  <b className="fs-4 d-inline">{currency(_data)}</b>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-row mt-3">
                <div className="col-md-12">
                  <TextField
                    label="ລາຍຈ່າຍ" variant="outlined"
                    type="number"
                    name="expenseKIP"
                    onWheel={(e) => e.target.blur()}
                    value={values?.expenseKIP}
                    onChange={handleChange}
                    sx={{
                      m: 0, width: '100%', backgroundColor: "#ffff"
                    }}
                    errors={errors.expenseKIP}
                  />
                  <div className="text-danger fs-5">{errors.expenseKIP}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-row mt-3">
            <div className="col-md-12">
              <TextField
                label="ວັນທີ່ຈ່າຍ" variant="outlined"
                type="date"
                onWheel={(e) => e.target.blur()}
                name="accountantDate"
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
                className={
                  errors.detail
                    ? "form-control text-back  is-invalid"
                    : "form-control text-back  invalid"
                }
                placeholder="..."
                onChange={handleChange}
                value={values?.detail}
              ></textarea>
              <div className="text-danger fs-5">{errors.detail}</div>
            </div>
            <div className="col-md-12 mt-3">
              <TextField
                label="ພະນັກງານ" variant="outlined"
                defaultValue={getUser}
                sx={{
                  m: 0, width: '100%', backgroundColor: "#ffff"
                }}
                disabled={true}
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
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
