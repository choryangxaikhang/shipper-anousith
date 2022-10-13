import Notiflix, { Loading } from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  currency,
  getLocalHouse,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  toDayDash,
} from "../../../../helper";
import _ from "lodash";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { CREATE_EXPENSES, QUERY_EXTRA_EXPENSE } from "../apollo";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SelectExpressTypes from "../../../../helper/components/SelectExpressTypes";
import { s3Client } from "../../../../helper/s3Client";
export default function Expenses({ getData, onSuccess }) {
  const [show, setShow] = useState(false);
  const [createIncome] = useMutation(CREATE_EXPENSES);
  const [userData, setUserData] = useState({});
  const [startDate, setStartDate] = useState(toDayDash());
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState(null);
  const [getTypeExpress, setTypExpress] = useState({});
  const getUser = userData?.firstName + " " + userData?.lastName;
  const [localHouse, setLocalHouse] = useState("");
  const [fetchData, { data: extraExpenseData, loading }] = useLazyQuery(
    QUERY_EXTRA_EXPENSE,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    const local = getStaffLogin();
    setUserData(local?.data);
  }, []);

  useEffect(() => {
    if (!show) {
      return;
    }
    fetchData({
      variables: {
        where: {
          house: localHouse,
        },
        limit: 1,
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse,show]);

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
        if (!getTypeExpress?.id_expense)
          errors.expenseType = "ກະລູນາເລືອກປະເພດລາຍຈ່າຍ";
        return errors;
      },
      onSubmit: async (values) => {
        loadingScreen();
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
                expenseType: String(getTypeExpress?.id_expense),
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
            setTypExpress("");
            setShow(false);
          } else {
            messageError("ລົງລາຍຈ່າຍບໍສຳເລັດ");
            onSuccess();
          }
        } catch (error) {
          messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
          console.log(error);
          onSuccess();
        }
      },
    });

  return (
    <>
      <div
        className="bg-primary col-6 btn btn-block p-2 rounded"
        onClick={() => setShow(true)}
        style={{ marginTop: -1 }}
      >
        <i className="fa-brands fa-amazon-pay"></i> ລົງລາຍຈ່າຍ
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header>
          <h3>ຟອມລົງລາຍຈ່າຍ</h3>
          <a
            className="pull-right float-end "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <div className="form-row">
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
            </div>
          </div>
          <div className="form-row mt-1">
            <div className="col-md-12">
              <SelectExpressTypes
                style={{ minWidth: 200 }}
                value={getTypeExpress?.id_expense}
                onChange={(obj) => {
                  if (obj?.id_expense) {
                    setTypExpress(obj);
                  }
                }}
              />
              <div className="text-danger">{errors.expenseType}</div>
            </div>
          </div>

          <div className="form-row mt-1">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      ຍອດຄົງເຫຼືອ:{" "}
                    </InputAdornment>
                  }
                  type="text"
                  placeholder="ລາຍຈ່າຍ"
                  name="accountantDate"
                  value={currency(
                    extraExpenseData?.extraExpenses?.data[0]?.endBalanceKIP
                  )}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <div className="text-danger">{errors.expenseKIP}</div>
            </div>
          </div>

          <div className="form-row mt-1">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      ຈຳນວນເງິນ:{" "}
                    </InputAdornment>
                  }
                  type="number"
                  placeholder="ລາຍຈ່າຍ"
                  onWheel={(e) => e.target.blur()}
                  value={values?.expenseKIP}
                  name="expenseKIP"
                  onChange={handleChange}
                />
              </FormControl>
              <div className="text-danger">{errors.expenseKIP}</div>
            </div>
          </div>
          <div className="form-row mt-1">
            <div className="col-md-12">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">ວັນທີ່: </InputAdornment>
                  }
                  type="date"
                  placeholder="ລາຍຈ່າຍ"
                  name="accountantDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
            </div>
            <label className="text-black mt-1">ລາຍລະອຽດ</label>
            <div className="col-md-12">
              <textarea
                rows={3}
                name="detail"
                className={"form-control form-control-lg"}
                placeholder="..."
                onChange={handleChange}
                value={values?.detail}
              ></textarea>
              <div className="text-danger">{errors.detail}</div>
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
