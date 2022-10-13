import React, { useRef, useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import moment from "moment";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  formateDateSlash,
  houseStatus,
  getStaffLogin,
} from "../../../helper";
function Export({ _Data }) {
  const jsonObj = getStaffLogin();
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
    incomeKIP: _.sumBy(_Data?.extraExpenses?.data, "incomeKIP"),
    expenseKIP: _.sumBy(_Data?.extraExpenses?.data, "expenseKIP"),
    endBalanceKIP: _.sumBy(_Data?.extraExpenses?.data, "endBalanceKIP"),
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

      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        size="xl"
      >
        <Modal.Header>
          ພີມລາຍລາຍງານ
          <a
            href="javaScript:void(0)"
            className="pull-right ms-2  float-end"
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-2">
          <Row>
            <div className="col-md-12 ">
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
                    ຊື່ກິດຈະການ:{" "}
                    {_Data?.extraExpenses?.data[0]?.house?.houseName},
                    <br />
                    ໂທ: {_Data?.extraExpenses?.data[0]?.house?.contactPhone}
                  </td>
                  <td colSpan={6} className="text-end text-black">
                    ວັນທີ:{formateDateSlash(today)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <h3 className="text-center">ລາຍງານລາຍຮັບ ແລະ ລາຍຈ່າຍ</h3>
                    <span className="text-center text-black">
                      ພີມໂດຍ: {userInfo?.firstName ? userInfo?.firstName : ""}{" "}
                      {userInfo?.lastName ? userInfo?.lastName : ""}
                    </span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f54f02", color: "white" }}>
                  <td className="border text-nowrap">ລຳດັບ</td>
                  <td className="border text-nowrap">ພະນັກງານ</td>
                  <td className="border text-nowrap">ລົງວັນທີ່</td>
                  <td className="border text-nowrap">ເນື້ອໃນລາຍການ</td>
                  <td className="text-end border text-nowrap"> ລາຍຮັບ</td>
                  <td className="text-end border text-nowrap">ລາຍຈ່າຍ</td>
                  <td className="text-end border text-nowrap">ອານຸມັດໂດຍ</td>
                </tr>
              </thead>
              <tbody>
                {_Data &&
                  _Data?.extraExpenses?.data?.map((data, index) => (
                    <tr
                      key={index}
                      className={
                        data?.confirmStatus === "CONFIRMED"
                          ? "table-success"
                          : ""
                      }
                    >
                      <td className="text-nowrap text-center border text-black">
                        {index + 1}
                      </td>
                      <td className="text-nowrap border text-black">
                        {data?.StaffFullName}
                      </td>
                      <td className="text-nowrap border text-black text-center">
                        {data?.createdAt
                          ? formatDateDash(data?.accountantDate)
                          : "-"}
                      </td>

                      <td className=" border  text-black">
                        {data?.detail ? data?.detail : "-"}
                      </td>
                      <td className="text-nowrap border text-end text-black">
                        {currency(data?.incomeKIP ? data?.incomeKIP : 0)} ກີບ
                      </td>
                      <td className="text-nowrap border text-end text-black">
                        {currency(data?.expenseKIP ? data?.expenseKIP : 0)} ກີບ
                      </td>
                      <td className="text-nowrap border text-center text-black">
                        <span>
                          {data?.confirmBy?.firstName
                            ? data?.confirmBy?.firstName
                            : "" + " " + data?.confirmBy?.lastName
                            ? data?.confirmBy?.lastName
                            : ""}
                        </span>
                        {data?.confirmDate ? (
                          <>
                            <br />
                            {data?.confirmDate
                              ? formatDateDash(data?.confirmDate)
                              : ""}
                          </>
                        ) : (
                          "ຍັງບໍທັນອານຸມັດ"
                        )}
                      </td>
                    </tr>
                  ))}
                <tr style={{ backgroundColor: "#fafafa" }}>
                  <td colSpan={4} className="border">
                    <h3 className="text-center">ລວມ:</h3>
                  </td>
                  <td className="border text-end">
                    <h3>
                      {SumMoney?.incomeKIP ? currency(SumMoney?.incomeKIP) : 0}
                    </h3>
                  </td>
                  <td className="border text-end">
                    <h3>
                      {SumMoney?.expenseKIP
                        ? currency(SumMoney?.expenseKIP)
                        : 0}
                    </h3>
                  </td>
                  <td className="border text-end">
                    <h3>
                      {currency(
                        parseInt(SumMoney?.incomeKIP) +
                          parseInt(SumMoney?.expenseKIP)
                      )}
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className=" text-center p-4">
                    <h4 className="text-center">ເຊັນຜູ້ກວດສອບ/ອານຸມັດ</h4>
                  </td>
                  <td className=" text-center p-4" colSpan={4}>
                    <h4>ພະນັກງານ</h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}
export default Export;
