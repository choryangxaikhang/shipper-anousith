// // import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import { getStaffLogin, messageError, messageSuccess, messageWarning } from "../../../helper";
import { CREATE_SIGNATURE, UPDATE_LIST_ITEM } from "../apollo";
import { useFormik } from "formik";
import "../index.css";
import SignatureCanvas from "react-signature-canvas";
export default function InsertAmount({ getData, loadData, data }) {
  //form state
  const [show, setShow] = useState(false);
  const [sigCanvas, setSigCanvas] = useState(null);
  const [totalAmount, setTotalAmount] = useState(data?.amount);
  const [updateListItem] = useMutation(UPDATE_LIST_ITEM);
  const [createSignature] = useMutation(CREATE_SIGNATURE);
  console.log(totalAmount);

  const { handleChange, errors, values, handleSubmit, resetForm } = useFormik({
    initialValues: {
      amount: 0,
    },
    enableReinitialize: false,
    validate: (values) => {
      const errors = {};
      if (totalAmount <= 0) {
        errors.amount = "ຈຳນວນຕ້ອງຫຼາຍກວ່າ 0";
      }
      if(sigCanvas?.isEmpty()) errors.sigCanvas = messageWarning("ເຊັນເພື່ອເປັນຫຼັກຖານ");

      return errors;
    },
    onSubmit: async (values) => {
    
      try {
        const { data: inputData } = await createSignature({
          variables: {
            data: {
              pickup: parseInt(data?._id),
              image: sigCanvas.toDataURL(),
            },
          },
        });

        await updateListItem({
          variables: {
            data: {
              amount: totalAmount,
              status: "RECEIVED",
              isSignature: 1,
            },
            where: {
              _id: parseInt(data?._id),
            },
          },
        });

        if (inputData) {
          messageSuccess("ດຳເນີນການສຳເລັດ");
          getData(!loadData);
          sigCanvas.clear();
          setTimeout(() => {
            resetForm({ values: "" });
            window.scrollTo(0, 0);
          }, 100);
          setShow(!show);
        } else {
          messageError("ດຳເນີນບໍ່ສຳເລັດ");
        }
      } catch (error) {
        console.log(error);
        messageError("ດຳເນີນບໍ່ສຳເລັດ");
      }
    },
  });

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-success right rounded btn-xs me-2"
        onClick={() => setShow(true)}
      >
        <i className="fa-solid fa-circle-check mr-1 left" /> ຢືນຢັນ
      </button>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        backdrop="static"
        size="lx"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 text-danger">
            <i className="icon-sliders text-danger" /> ID:{" "}
            {data?.customer?.id_list}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>ຈຳນວນພັດສະດຸ </label>
              <input
                type="number"
                name="amount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className={
                  errors.amount
                    ? "form-control mb-3 is-invalid"
                    : "form-control mb-3 invalid"
                }
                placeholder="0"
              />
              <i className="text-danger">{errors?.amount}</i>
            </div>
            <div className="form-group">
              <label className="align-top">ລາຍເຊັນ </label>
              <SignatureCanvas
                canvasProps={{
                  width: 300,
                  height: 200,
                  className: errors.sigCanvas
                    ? "sigCanvas border w-100 is-invalid"
                    : "sigCanvas border w-100 invalid",
                }}
                ref={(ref) => setSigCanvas(ref)}
                penColor="blue"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-success rounded btn-lg mr-2"
              onClick={handleSubmit}
            >
              <i className="fa-solid fa-circle-check mr-1 fs-2" />
              ຢືນຢັນ
            </button>
            <button
              type="button"
              className="btn btn-danger rounded btn-lg"
              onClick={() => {
                sigCanvas.clear();
              }}
            >
              <i className="fa-solid fa-close mr-1 fs-2" />
              ຍົກເລິກ
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
