import React, { useRef, useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import "./utils/index.css"
import moment from "moment";
import logo from "../../../img/icon-app.png";
import { USER_KEY } from "../../../Routes/app";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  formatDateTime,
  formateDateSlash,
  houseStatus,
} from "../../../helper";
function Export({ _Data }) {
  const jsonObj = JSON.parse(localStorage.getItem(USER_KEY));
  const userInfo = jsonObj?.data;
  const inputRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => inputRef.current,
  });
  let today = moment().format("YYYY-MM-DD");
  const [show, setShow] = useState(false);
  const { history, location, match } = useReactRouter();
  const queryParams = new URLSearchParams(location.search);

  return (
    <React.Fragment>
      <div className="col-md-12 mb-1">
        <button
          type="button"
          className="btn btn-dark float-right mb-1"
          width="10px"
          onClick={() => setShow(true)}
        >
          <i className="fas fa-print" />
        </button>
      </div>

      <Modal show={show} onHide={() => setShow(false)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className="primary modal-container custom-map-modal">
            ພີມລາຍການທັງໝົດ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-container">
          <Row>
            <div className="col-md-12 ">

              <a
                href="javaScript:void(0)"
                className="pull-right ms-2 "
                style={{ textDecoration: "none" }}
                onClick={() => setShow(false)}
              >
                <i className="icon-x fa-2x text-danger" />
              </a>
              <button
                onClick={handlePrint}
                type="button"
                className="btn btn-dark me-2 float-start"
              >
                <i className="icon-print mr-1"></i> ພິມລາຍງານ
              </button>
            </div>
          </Row>
          <div style={{ paddingBottom: "10px" }} />
          <div className="table-responsive">
            <table
              className="table-sm"
              border="0"
              style={{
                marginTop: 20,
                width: "100%",
                fontFamily: "Phetsarath OT",
                backgroundColor: "#ffffff",
              }}
              ref={inputRef}
            >
              <thead>
                <tr>
                  <td colSpan={3} style={{ textAlign: "left", color: "black" }}>
                    <img
                      src={logo}
                      style={{
                        width: 80,
                        marginBottom: 1,
                        marginTop: 20,
                      }}
                      alt=""
                      id="table-to-xls"
                    />
                    <br />
                    ບໍລິສັດ: ບິດເຮົາສ໌ ເຕັກໂນໂລຊີ ຈຳກັດ
                    <br />
                    ໂທ:
                  </td>
                  <td colSpan={6} className="text-end text-black">
                    ວັນທີ:{formateDateSlash(today)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <h3 className="text-center">
                      ລາຍງານຍອດສະຫລຸບ
                    </h3>
                    <span className="text-center text-black">
                      ພີມໂດຍ: {userInfo?.firstName ? userInfo?.firstName : ""}{" "}
                      {userInfo?.lastName ? userInfo?.lastName : ""}
                    </span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f54f02", color: "white" }}>
                  <td className="textCenter text-nowrap">
                    ລວມຍອດຄັ້ງຈອງ
                  </td>
                  <td className="textCenter text-nowrap">ລວມຍອດເງິນຈອງ</td>
                  <td className="textCenter text-nowrap">ລວມຍອດເງິນຊົ່ວຄາວ</td>
                  <td className="textCenter text-nowrap">
                    ລວມຍອດເງິນຄ້າງຄືນ
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td className="text-nowrap text-center border text-black">
                    {currency(_Data?.summaryBookingTotal?.bookingTotal ?
                      _Data?.summaryBookingTotal?.bookingTotal : 0)}
                  </td>
                  <td className="text-nowrap border text-black text-center">
                    {currency(_Data?.summaryBookingTotal?.feeBookingAmount ?
                      _Data?.summaryBookingTotal?.feeBookingAmount : 0)}
                  </td>
                  <td className="text-nowrap border text-end text-black"
                  >
                    {currency(_Data?.summaryBookingTotal?.halfPriceTotal ?
                      _Data?.summaryBookingTotal?.halfPriceTotal : 0)}{" "}
                    ກີບ
                  </td>
                  <td className="text-nowrap border text-end text-black"
                  >
                     {currency(_Data?.summaryBookingTotal?.fullPriceTotal ?
                      _Data?.summaryBookingTotal?.fullPriceTotal : 0)}{" "}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <td colSpan={1} className=" text-center p-4">
                    <h4 className="text-center">ເຊັນຜູ້ຈຳການ</h4>
                  </td>
                  <td className=" text-end p-4" colSpan={3}>
                    <h4>ພະນັກງານ</h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
export default Export;
