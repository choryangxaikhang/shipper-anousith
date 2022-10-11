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

import { ADD_EQUIMENT_STOCK, QUERY_EQUIMENT } from "./apollo";
import Notiflix from "notiflix";
import { TextField } from "@mui/material";
import SelectEquimentType from "../../../../helper/components/SelectEquimentType";
import SelectEquiment from "../../../../helper/components/SelectEquiment";
import { EDIT_EQUIMENT } from "../equiment/apollo";

export default function AddData({ onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;
  const [listEquiment, setListEquiment] = useState("");
  const [show, setShow] = useState(false);
  const [addStock] = useMutation(ADD_EQUIMENT_STOCK);
  const [house, setHouse] = useState({});
  const [today, setToday] = useState(toDay());
  const [listData, setListData] = useState();
  const [inputTotal, setInputTotal] = useState(0);
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

  // insert
  const getTotal = listData?.total ? listData?.total : 0;
  // update
  const getFinalTotal = parseInt(getTotal) + parseInt(inputTotal);
  const { handleChange, errors, values, handleSubmit, resetForm, isDisabled } =
    useFormik({
      initialValues: {
        inTotal: "",
      },
      enableReinitialize: false,
      validate: (values) => {
        const errors = {};
        if (!inputTotal) errors.inTotal = "ກະລຸນາປ້ອນຈຳນວນຊັບສິນ";
        return errors;
      },
      onSubmit: async (values) => {
        if (!listEquiment?._id) return messageWarning("ກະລຸນາເລືອກຫມວດຊັບສິນ");
        loadingScreen();
        try {
          const { data: updated } = await addStock({
            variables: {
              data: {
                inTotal: parseInt(inputTotal),
                equmentID: String(listEquiment?._id),
                house: house?._id,
              },
            },
          });
          if (updated) {
            Notiflix.Loading.remove();
            messageSuccess("ບັນທືກສຳເລັດ");
            updateEquiment();
            setTimeout(() => {
              setInputTotal("")
              window.scrollTo(0, 0);
            }, 100);
            setShow(false);
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
      console.log("======success=====");
    } catch (error) {
      Notiflix.Loading.remove();
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn  btn-lg btn-block"
        onClick={() => setShow(true)}
      >
        <i className="icon-plus-circle me-1" /> ນຳຊັບສິນເຂົ້າ
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
              style={{ minWidth: 200, position: "fixed" }}
              value={listEquiment?._id}
              onChange={(obj) => {
                if (obj?._id) {
                  setListEquiment(obj);
                }
              }}
            />
          </div>
          <div className="form-group " style={{ marginTop: 50 }}>
            <TextField
              label="ຈຳນວນ"
              variant="outlined"
              type="number"
              name="inTotal"
              onWheel={(e) => e.target.blur()}
              value={inputTotal}
              onChange={(e) => {
                setInputTotal(e.target.value);
              }}
              sx={{
                m: 0,
                width: "100%",
                backgroundColor: "#ffff",
              }}
              error={errors.inTotal}
            />
            <span className="text-danger">{errors.inTotal}</span>
          </div>
          <div className="form-group mt-1">
            <TextField
              label="ຍອງທີ່ເຫລືອ"
              variant="outlined"
              type="number"
              disabled={true}
              onWheel={(e) => e.target.blur()}
              value={currency(listData?.total)}
              sx={{
                m: 0,
                width: "100%",
                backgroundColor: "#edf0ee",
              }}
            />
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
