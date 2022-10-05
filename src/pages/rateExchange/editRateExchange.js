import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import {
  messageError,
  messageSuccess,
  messageWarning,
  valiDate,
  getStaffLogin,
} from "../../helper";
import { UPDATE_RATE_EXCHANGE } from "./apollo";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import "./utils/index.css";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

export default function EditRateExChange({ dataValue, onSuccess }) {
  const data = getStaffLogin();
  const userInfo = data?.data;

  const [show, setShow] = useState(false);
  const [updateRateExchange] = useMutation(UPDATE_RATE_EXCHANGE);
  const handleClose = () => setShow(false);
  const [house, setHouse] = useState(dataValue?.house);
  return (
    <Formik
      initialValues={{
        laoKIP: dataValue?.laoKIP,
        laoTHB: dataValue?.laoTHB,
        laoUSD: dataValue?.laoUSD,
      }}
      enableReinitialize={true}
      validate={(values) => {
        const errors = {};

        if (!values.laoKIP) {
          errors.laoKIP = "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນເງິນກີບ";
        }
        if (!values.laoTHB) {
          errors.laoTHB = "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນເງິນກີບ-ບາດ";
        }
        if (!values.laoUSD) {
          errors.laoUSD = "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນເງິນກີບ-ໂດລາ";
        }

        if (!house?._id) errors.house = "ກະລຸນາເລືອກຫ້ອງ";

        return errors;
      }}
      onSubmit={async (values) => {
        try {
          let _updateRateExchange = await updateRateExchange({
            variables: {
              data: {
                laoKIP: parseFloat(values.laoKIP),
                laoTHB: parseFloat(values.laoTHB),
                laoUSD: parseFloat(values.laoUSD),
                house: house?._id,
              },
              where: {
                _id: parseInt(dataValue?._id),
              },
            },
          });

          if (_updateRateExchange) {
            messageSuccess("ແກ້ໄຂຂໍ້ມູນສຳເລັດ");
            onSuccess();
            setShow(false);
          } else {
            messageError("ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ");
          }
        } catch (error) {
          console.log(error);
          messageError("ແກ້ໄຂຂໍ້ມູນຜິດພາດ");
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, isDisabled }) => (
        <React.Fragment>
          <button
            type="button"
            className="btn btn-lg"
            onClick={() => setShow(true)}
          >
            <i className="fas fa-edit " />
          </button>
          <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            animation={false}
            backdrop="static"
            size="xl"
            className="container-div"
          >
            <Modal.Header className="text-black">
              ແກ້ໄຂອັດຕາແລກປ່ຽນ
              <a
                className="pull-right ms-2 "
                style={{ textDecoration: "none", marginTop: -10 }}
                onClick={() => setShow(false)}
              >
                <i className="icon-x fa-2x text-danger" />
              </a>
            </Modal.Header>
            <Modal.Body>
              <div className="row bg-color">
                <div className=" col-md-12">
                  <div className="form-group mb-3">
                    <label>ເລືອກກິດຈະການ {valiDate()}</label>
                    <SelectLocalHouse
                      style={{ width: "100%" }}
                      value={house?._id}
                      onChange={(obj) => {
                        if (obj?._id) {
                          setHouse(obj);
                        }
                      }}
                      ownerId={userInfo?._id}
                    />
                    <span className="text-danger">{errors.house}</span>
                  </div>
                  <div className="form-group mb-1">
                    <FormControl fullWidth sx={{ m: 0 }}>
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <i className="fa-sharp fa-solid fa-kip-sign" />
                          </InputAdornment>
                        }
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        name="laoKIP"
                        placeholder="ປ້ອນລະຫັດຈອງ"
                        value={values.laoKIP}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <span className="text-danger">{errors.laoKIP}</span>
                  </div>
                  <div className="form-group mb-1">
                    <FormControl fullWidth sx={{ m: 0 }}>
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <i className="fa-sharp fa-solid fa-bitcoin-sign" />
                          </InputAdornment>
                        }
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        name="laoTHB"
                        placeholder="ກີບ-ບາດ"
                        value={values.laoTHB}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <span className="text-danger">{errors.laoTHB}</span>
                  </div>
                  <div className="form-group">
                    <FormControl fullWidth sx={{ m: 0 }}>
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <i className="fa-sharp fa-solid fa-dollar-sign" />
                          </InputAdornment>
                        }
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        name="laoUSD"
                        placeholder="ກີບ-ໂດລາ"
                        value={values.laoUSD}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <span className="text-danger">{errors.laoUSD}</span>
                  </div>
                </div>
              </div>
            </Modal.Body>
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
      )}
    </Formik>
  );
}
