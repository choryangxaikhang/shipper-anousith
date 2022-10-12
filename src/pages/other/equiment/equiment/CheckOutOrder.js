// import { useLazyQuery } from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import {
  currency,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  loadingScreen,
  messageError,
  messageSuccess,
  messageWarning,
  toDay,
} from "../../../../helper";

import {
  CREATE_ORDER_OUT,
  EDIT_EQUIMENT,
  QUERY_BILL,
  QUERY_EQUIMENT,
} from "./apollo";
import Notiflix from "notiflix";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
export default function CheckOutOrder({ getBillId, getData, onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;
  const [listEquimentType, setListEquimentType] = useState("");
  const [show, setShow] = useState(false);
  const [createData] = useMutation(CREATE_ORDER_OUT);
  const [editEq] = useMutation(EDIT_EQUIMENT);
  const [house, setHouse] = useState({});
  const [today, setToday] = useState(toDay());
  const [listPice, serPrice] = useState(0);
  const [getTotal, setTotal] = useState();
  const [listBill, setBillNo] = useState();

  const [inputTotal, setInputTotal] = useState();

  const [queryBill, { data: setDataBill, loading: loadingBill }] = useLazyQuery(
    QUERY_BILL,
    { fetchPolicy: "cache-and-network" }
  );
  const [queryStockId, { data: setDataId, loading: loadingId }] = useLazyQuery(
    QUERY_EQUIMENT,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);

  useEffect(() => {
    if (getBillId === 1) {
      return;
    }
    queryBill({
      variables: {
        where: {
          _id: getBillId,
        },
        orderBy: "createdAt_DESC",
        limit: 1,
      },
    });
  }, [getBillId]);
  useEffect(() => {
    setBillNo(setDataBill?.billEquiment?.data[0]);
  }, [setDataBill]);

  const finalTotal = parseInt(getTotal) - parseInt(inputTotal);
  const finalPrice = parseInt(inputTotal) * parseInt(listPice);

  const {
    handleChange,
    errors,
    values,
    handleSubmit,
    setFieldValue,
    resetForm,
    isDisabled,
  } = useFormik({
    initialValues: {
      outTotal: parseInt(0),
      price: "",
      details: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (!inputTotal) {
        errors.outTotal = "ກະລຸນາປ້ອນຈຳນວນ";
      }
      if (inputTotal <= 0) {
        errors.outTotal = "ກະລຸນາປ້ອນຈຳນວນເບີກຕ້ອງຫລາຍກວ່າ 0";
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (getTotal < inputTotal) {
        return messageWarning("ຊັບສິກບໍພຽງພໍທີ່ຈະເບິກ❗");
      }
      if (listBill?.status === "FULL") {
        return messageWarning("ບິນນີ້ບໍມີໃນລະບົບ ກະລຸນາສ້າງບິນເບີກກ່ອນ");
      }
      loadingScreen();
      try {
        const { data: updated } = await createData({
          variables: {
            data: {
              outTotal: parseInt(inputTotal),
              price: parseInt(listPice),
              status: "GETIN",
              house: house?._id,
              details: values?.details,
              finalPrice: parseInt(finalPrice),
              billEquiment: getBillId,
              equmentID: getData?._id,
            },
          },
        });
        if (updated) {
          Notiflix.Loading.remove();
          messageSuccess("ບັນທືກສຳເລັດ");
          updateEqTotal();
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          setShow(false);
          setInputTotal("");
          onSuccess();
        } else {
          Notiflix.Loading.remove();
          messageError("ບັນທຶກບໍ່ສຳເລັດ");
        }
      } catch (error) {
        console.log(error);
        Notiflix.Loading.remove();
        messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
      }
    },
  });
  // update ຈຳນວນຊັບສິນ
  const updateEqTotal = async () => {
    try {
      const { data: _update } = await editEq({
        variables: {
          data: {
            total: parseInt(finalTotal),
          },
          where: {
            _id: getData?._id,
          },
        },
      });
      if (_update) {
      } else {
        messageError("ອັບເດດບໍ່ສຳເລັດ");
      }
    } catch (error) {
      Notiflix.Loading.remove();
      messageError("ມີຂໍ້ຜິດພາດເກີດຂື້ນ");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!show) {
      return;
    }
    setFieldValue("title", getData?.title ? getData?.title : "", false);
    serPrice(getData?.price ? getData?.price : 0);
    setTotal(getData?.total ? getData?.total : 0);
  }, [show]);

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg text-success"
        onClick={() => setShow(true)}
      >
        <i className="fa fa-cart-plus me-1" /> ເບີກຊັບສິນ
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ເບີກຊັບສິນ{" "}
          <b className="fs-4">
            ເລກບິນ: {setDataBill?.billEquiment?.data[0]?.billNo}
          </b>
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຊື່ຊັບສິນ:</InputAdornment>
                }
                type="text"
                name="title"
                value={values?.title}
                disabled={true}
                style={{ backgroundColor: "#edece8" }}
              />
            </FormControl>
            <span className="text-danger">{errors.title}</span>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຍອດຄົງເຫລືອ:</InputAdornment>
                }
                type="text"
                name="total"
                value={currency(getTotal)}
                style={{ backgroundColor: "#edece8" }}
              />
            </FormControl>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ລາຄາ/ອັນ:</InputAdornment>
                }
                type="text"
                placeholder="..."
                value={currency(listPice)}
                style={{ backgroundColor: "#edece8" }}
              />
            </FormControl>
          </div>{" "}
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຈຳນວນເບີກ:</InputAdornment>
                }
                type="number"
                placeholder="..."
                onWheel={(e) => e.target.blur()}
                name="outTotal"
                value={inputTotal}
                onChange={(e) => {
                  setInputTotal(e.target.value);
                }}
                error={errors.outTotal}
              />
              <div className="text-danger">{errors.outTotal}</div>
            </FormControl>
          </div>
          <div className="form-group mb-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ລວມຍອດເບີກ:</InputAdornment>
                }
                type="text"
                value={currency(finalPrice ? finalPrice : 0)}
                style={{ backgroundColor: "#edece8" }}
              />
            </FormControl>
          </div>
          <div className="form-group mb-1">
            <label>ຄຳອະທິບາຍ</label>
            <textarea
              type="text"
              row={3}
              name="details"
              onChange={handleChange}
              placeholder="..."
              className="form-control form-control-lg"
            ></textarea>
          </div>
        </div>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => handleSubmit()}
            disabled={isDisabled}
          >
            <i className="icon-save" style={{ marginRight: 3 }} />
            ບັນທຶກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
