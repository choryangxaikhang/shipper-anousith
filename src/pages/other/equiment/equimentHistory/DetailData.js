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
  formateDateSlash,
  getLocalHouse,
} from "../../../../helper";
import { QUERY_EQUIMENT_OUT } from "./apollo";
import { getStaffLogin } from "../../../../helper";
import "./utils/index.css";
function DetailData({ billNo, getId }) {
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  const inputRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => inputRef.current,
  });
  let today = moment().format("YYYY-MM-DD");
  const [show, setShow] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [listData, setDataList] = useState();

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);

  const [queryOut, { data: setData, loading }] = useLazyQuery(
    QUERY_EQUIMENT_OUT,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const SumMoney = {
    outTotal: _.sumBy(listData?.data, "outTotal"),
    finalPrice: _.sumBy(listData?.data, "finalPrice"),
  };


  useEffect(() => {
    queryOut({
      variables: {
        where: {
          createdBy: userInfo?._id,
          billEquiment: getId,
          house: setLocalHouse?._id,
          status: "CLOSE",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse, getId]);
  useEffect(() => {
    setDataList(setData?.equimentOuts);
  }, [setData]);

  return (
    <React.Fragment>
      <button
        className="btn btn-light"
        onClick={(e) => {
          setShow(true);
        }}
      >
        <i className="fas fa-list me-1" />
        ລາຍລະອຽດ
      </button>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ລາຍງານບິນເບີກເຄື່ອງ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div className="p-1 customDiv">
          <Row>
            <div className="col-md-12 ">
              <button
                onClick={handlePrint}
                type="button"
                className="btn btn-dark me-2 float-start mt-2"
              >
                <i className="icon-print mr-1"></i> ພິມລາຍງານ
              </button>
              <a
                className="float-end mt-2 ms-3 btn btn-danger rounded"
                style={{ textDecoration: "none", marginTop: -10 }}
                onClick={() => setShow(false)}
              >
                <i className="icon-x fa-2x text-white" />
              </a>
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
                    ຊື່ກິດຈະການ: {listData?.data[0]?.house?.houseName}
                    <br />
                    ໂທ: {listData?.data[0]?.house?.contactPhone}
                  </td>
                  <td className="text-end text-black mt-2">
                    ວັນທີ:{formateDateSlash(today)}
                    <br />
                    ບິນເລກທີ: {billNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan={8}>
                    <h3 className="text-center">
                      <u className="fw-bold">ລາຍການເບີກຊັບສິນ</u>
                      <br />[ {listData?.data[0]?.billEquiment?.details} ]
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
                      {currency(data?.finalPrice ? data?.finalPrice : 0)}
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
                    <h3>
                      {SumMoney?.finalPrice
                        ? currency(SumMoney?.finalPrice)
                        : 0}
                    </h3>
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
        </div>
      </Modal>
    </React.Fragment>
  );
}
export default DetailData;
