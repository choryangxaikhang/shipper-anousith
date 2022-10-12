import React, { useRef, useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import "./utils/index.css"
import moment from "moment";
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

  // sumBy packagePriceKIP
  const SumMoney = {
    incomeKIP: _.sumBy(_Data?.accountingSummaries?.data, "incomeKIP"),
    expenseKIP: _.sumBy(_Data?.accountingSummaries?.data, "expenseKIP"),
    endBalanceKIP: _.sumBy(_Data?.accountingSummaries?.data, "endBalanceKIP"),
  };

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
                  <td colSpan={6} style={{ textAlign: "left", color: "black" }}>
                    <img
                      // src={logo}
                      style={{
                        width: 150,
                        marginBottom: 1,
                        marginTop: 20,
                      }}
                      alt=""
                      id="table-to-xls"
                    />
                    <br />
                    ຊື່ກິດຈະການ: {_Data?.accountingSummaries?.data[0]?.house?.houseName}, {" "}
                    {houseStatus(_Data?.accountingSummaries?.data[0]?.house?.type)}
                    <br />
                    ໂທ: {_Data?.accountingSummaries?.data[0]?.house?.contactPhone}
                  </td>
                  <td colSpan={6} className="text-end text-black">
                      ວັນທີ:{formateDateSlash(today)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <h3 className="text-center">
                    ລາຍງານສະຫລຸບລາຍຮັບ ແລະ ລາຍຈ່າຍ
                    </h3>
                    <span className="text-center text-black">
                      ພີມໂດຍ: {userInfo?.firstName ? userInfo?.firstName : ""}{" "}
                      {userInfo?.lastName ? userInfo?.lastName : ""}
                    </span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f54f02", color: "white" }}>
                  <td className="textCenter text-nowrap">
                    ລຳດັບ
                  </td>
                  <td className="textCenter text-nowrap">
                    ພະນັກງານ
                  </td>
                  <td className="textCenter text-nowrap text-center">ລົງວັນທີ່</td>
                  <td className="textCenter text-nowrap">ເນື້ອໃນລາຍການ</td>
                  <td className="textCenter text-nowrap">
                    {" "}
                    ລາຍຮັບ
                  </td>
                  <td className="textCenter text-nowrap">
                    ລາຍຈ່າຍ
                  </td>
                  <td className="textCenter text-nowrap">
                    ຍອດຄົງເຫຼືອ
                  </td>
                </tr>
              </thead>
              <tbody>
                {_Data &&
                  _Data?.accountingSummaries?.data?.map(
                    (data, index) => (
                      <tr
                        key={index}
                        className={
                          data?.confirmStatus === "CONFIRMED"
                            ? "table-success"
                            : ""
                        }
                      >
                        <td className="text-nowrap text-center border text-black">{index + 1}</td>
                        <td className="text-nowrap border text-black">
                          {data?.createdBy?.firstName ? data?.createdBy?.firstName : "-" +
                            "" +
                            data?.createdBy?.lastName ? data?.createdBy?.lastName : "-"}
                        </td>
                        <td className="text-nowrap border text-black text-center">
                          {data?.accountingDate
                            ? formatDateDash(data?.accountingDate)
                            : "-"}
                        </td>

                        <td className=" border  text-black">{data?.detail ? data?.detail : "-"}</td>
                        <td className="text-nowrap border text-end text-black"
                        >
                          {currency(
                            data?.incomeKIP ? data?.incomeKIP : 0
                          )}{" "}
                          ກີບ
                        </td>
                        <td className="text-nowrap border text-end text-black"
                        >
                          {currency(
                            data?.expenseKIP ? data?.expenseKIP : 0
                          )}{" "}
                          ກີບ
                        </td>
                        <td className="text-nowrap border text-end text-black"
                        >
                          {currency(
                            data?.endBalanceKIP
                              ? data?.endBalanceKIP
                              : 0
                          )}{" "}
                          ກີບ
                        </td>
                      </tr>
                    )
                  )}
                <tr style={{ backgroundColor: "#fafafa" }}>
                  <td colSpan={4} className="border">
                    <h3 className="text-center">ລວມ:</h3>
                  </td>
                  <td className="border text-end">
                    <h3>{SumMoney?.incomeKIP ? currency(SumMoney?.incomeKIP) : 0}</h3>
                  </td>
                  <td className="border text-end"><h3>{SumMoney?.expenseKIP ? currency(SumMoney?.expenseKIP) : 0}</h3></td>
                  <td className="border text-end"><h3>{SumMoney?.endBalanceKIP ? currency(SumMoney?.endBalanceKIP) : 0}</h3></td>

                </tr>
                <tr>
                  <td colSpan={2} className=" text-center p-4">
                    <h4 className="text-center">ເຊັນເຈົ້າຂອງກິດຈະການ</h4>
                  </td>
                  <td className=" text-end p-4" colSpan={4}>
                    <h4>ເຊັນພະນັກງານ</h4>
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
