import React, { useRef, useState, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { useLazyQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import moment from "moment";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  formatDateTime,
  formateDateSlash,
  houseStatus,
  messageError,
  messageSuccess,
} from "../../../../helper";
import Notiflix from "notiflix";
import { UPDATE_EQUIMENT_OUT } from "./apollo";
import { getStaffLogin } from "../../../../helper";
function Export({ _data }) {
  const jsonObj = getStaffLogin();
  const { history, location, match } = useReactRouter();
  const queryParams = new URLSearchParams(location.search);
  const userInfo = jsonObj?.data;
  const inputRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => inputRef.current,
  });
  let today = moment().format("YYYY-MM-DD");
  const [show, setShow] = useState(false);
  const [listData, setData] = useState("");
  const [list, setDataList] = useState("");

  const SumMoney = {
    outTotal: _.sumBy(_data?.equimentOuts?.data, "outTotal"),
    finalPrice: _.sumBy(_data?.equimentOuts?.data, "finalPrice"),
  };


  useEffect(() => {
    if (!show) {
      return;
    }
    setData(_data?.equimentOuts);
    setDataList(_data?.equimentOuts?.data[0]);
  }, [_data, show]);

  return (
    <React.Fragment>
      <button
        className="col-6  btn-primary mt-2 ms-3"
        onClick={(e) => {
          setShow(true);
        }}
      >
        <b className="text-white">
          <i className="fas fa-print me-1 pt-1" />
          ພີມໃບເບິກ
        </b>
      </button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="primary">ພີມລາຍການທັງໝົດ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                width: "100%",
                height: "100%",
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
                    {_data?.equimentOuts?.data[0]?.house?.houseName}
                    <br />
                    ໂທ: {_data?.equimentOuts?.data[0]?.house?.contactPhone}
                  </td>
                  <td className="text-end text-black mt-2">
                    ວັນທີ:{formateDateSlash(today)}
                    <br />
                    ບິນເລກທີ: {list?.billEquiment?.billNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <h3 className="text-center">
                      <u className="fw-bold">ລາຍການເບີກຊັບສິນ</u>
                      <br />[ {list?.billEquiment?.details} ]
                    </h3>
                    <span className="text-center text-black">
                      ພີມໂດຍ: {userInfo?.firstName ? userInfo?.firstName : ""}{" "}
                      {userInfo?.lastName ? userInfo?.lastName : ""}
                    </span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f54f02", color: "white" }}>
                  <td className="border text-nowrap">ລຳດັບ</td>
                  <td className="border text-center">ເບີກວັນທີ່</td>
                  <td className="border text-nowrap">ລາຍການ</td>
                  <td className="border text-nowrap">ຄຳອະທິບາຍ</td>
                  <td className="text-end text-nowrap">ຈຳນວນ</td>
                  <td className="text-end text-nowrap">ລາຄາ/ອັນ</td>
                  <td className="text-end text-nowrap">ລວມ</td>
                </tr>
              </thead>
              <tbody>
                {listData?.data?.map((data, index) => (
                  <tr key={index}>
                    <td className="text-start border text-black">
                      {index + 1}
                    </td>
                    <td className="border text-black text-center">
                      {data?.createdAt ? formatDateDash(data?.createdAt) : "-"}
                    </td>

                    <td className=" border  text-black">
                      {data?.equmentID?.title ? data?.equmentID?.title : "-"}
                    </td>
                    <td className=" border  text-black">
                      {data?.details ? data?.details : "-"}
                    </td>
                    <td className="text-nowrap border text-end text-black">
                      {currency(data?.outTotal ? data?.outTotal : 0)}
                    </td>
                    <td className="text-nowrap border text-end text-black">
                      {currency(data?.price ? data?.price : 0)}
                    </td>
                    <td className="text-nowrap border text-end text-black">
                      {currency(
                        parseInt(data?.outTotal ? data?.outTotal : 0) *
                          parseInt(data?.price ? data?.price : 0)
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
                      {SumMoney?.outTotal ? currency(SumMoney?.outTotal) : 0}
                    </h3>
                  </td>
                  <td className="border text-end" colSpan={2}>
                    <h3>{SumMoney?.finalPrice ? currency(SumMoney?.finalPrice) : 0}</h3>
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className=" text-center p-4">
                    <h4 className="text-center">ເຊັນຜູ້ກວດສອບ</h4>
                  </td>
                  <td className=" text-center p-4" colSpan={3}>
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
