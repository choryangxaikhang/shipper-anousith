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

import { EDIT_EQUIMENT_STOCK, QUERY_EQUIMENT } from "./apollo";
import Notiflix from "notiflix";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SelectEquiment from "../../../../helper/components/SelectEquiment";
import { EDIT_EQUIMENT } from "../equiment/apollo";

export default function EditData({ onSuccess, _data }) {
  const data = getStaffLogin();
  const userInfo = data?.data;
  const [listEquiment, setListEquiment] = useState("");
  const [show, setShow] = useState(false);
  const [updateData] = useMutation(EDIT_EQUIMENT_STOCK);
  const [house, setHouse] = useState({});
  const [today, setToday] = useState(toDay());
  const [listData, setListData] = useState();
  const [inputTotal, setInputTotal] = useState(0);
  const [toTalDefault, setTotalDefault] = useState(0);
  const [editEquiment] = useMutation(EDIT_EQUIMENT);

  const [fetchData, { data: setData, loading }] = useLazyQuery(QUERY_EQUIMENT, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    setHouse(getLocalHouse());
  }, []);
  useEffect(() => {
    if (!listEquiment?._id) {
      return;
    }
    fetchData({
      variables: {
        where: {
          _id: listEquiment?._id,
          house: house?._id,
        },
        limit: 1,
      },
    });
  }, [listEquiment]);

  useEffect(() => {
    setListData(setData?.equiments?.data[0]);
  }, [setData]);

  // query total
  const getTotal = listData?.total ? listData?.total : 0;
  // delete default
  const toToDefault = parseInt(getTotal) - parseInt(toTalDefault);
  // plus total
  const getFinalTotal = parseInt(toToDefault) + parseInt(inputTotal);

  const { handleChange, errors, values, handleSubmit, isDisabled } = useFormik({
    initialValues: {
      inTotal: "",
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (inputTotal <= 0)
        errors.inTotal = "ປ້ອນຈຳນວນຊັບສິນນຳເຂົ້າຕ້ອງຫລາຍກວ່າ 0";
      return errors;
    },
    onSubmit: async (values) => {
      if (!listEquiment?._id) return messageWarning("ກະລຸນາເລືອກຊື່ຊັບສິນ");
      loadingScreen();
      try {
        const { data: updated } = await updateData({
          variables: {
            data: {
              inTotal: parseInt(inputTotal),
              equmentID: String(listEquiment?._id),
              house: house?._id,
            },
            where: {
              _id: _data?._id,
            },
          },
        });
        if (updated) {
          Notiflix.Loading.remove();
          messageSuccess("ແກ້ໄຂສຳເລັດ");
          updateEquiment();
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
          setListEquiment("");
          setShow(false);
          onSuccess();
        } else {
          Notiflix.Loading.remove();
          messageError("ແກ້ໄຂບໍ່ສຳເລັດ");
        }
      } catch (error) {
        console.log(error);
        Notiflix.Loading.remove();
        messageError("ການເພີ່ມຂໍ້ມູນຜິດພາດ");
      }
    },
  });
  // update totl equiment
  const updateEquiment = async () => {
    try {
      const { data: _deleteData } = await editEquiment({
        variables: {
          data: {
            total: parseInt(getFinalTotal),
          },
          where: {
            _id: listEquiment?._id,
          },
        },
      });
      setInputTotal("");
      console.log("======success=====");
    } catch (error) {
      Notiflix.Loading.remove();
      console.log(error);
    }
  };

  useEffect(() => {
    if (!show) {
      return;
    }
    setListEquiment(_data?.equmentID);
    setTotalDefault(_data?.inTotal);
    setInputTotal(_data?.inTotal);
  }, [_data, show]);

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-sm"
        onClick={() => setShow(true)}
      >
        <i className="fas fa-edit" />
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ນຳຊັບສິນເຂົ້າ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <div className="form-group mb-3">
            <SelectEquiment
              style={{ minWidth: "100%" }}
              value={listEquiment?._id}
              onChange={(obj) => {
                if (obj?._id) {
                  setListEquiment(obj);
                }
              }}
              disabled = {true}
            />
          </div>
          <div className="form-group " style={{ marginTop: 50 }}>
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຈຳນວນ:</InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="number"
                placeholder="..."
                name="inputTotal"
                value={inputTotal}
                onChange={(e) => {
                  setInputTotal(e.target.value);
                }}
                error={errors.inTotal}
              />
            </FormControl>
            <span className="text-danger">{errors.inTotal}</span>
          </div>
          <div className="form-group mt-1">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">ຍອງທີ່ເຫລືອ:</InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="text"
                disabled={true}
                value={currency(listData?.total ? listData?.total : 0)}
                sx={{
                  m: 0,
                  width: "100%",
                  backgroundColor: "#edf0ee",
                }}
              />
            </FormControl>
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
