/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CHECK_OUTS} from "./apollo";
import { currency, formatDate, loadingData } from "../../helper";
import BottomNav from "../../layouts/BottomNav";

export default function HistoryServices({ history }) {
    const data = localStorage.getItem("data");
    const datas = JSON.parse(data);
  const [reloadData, setReloadData] = useState(false);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(100);
  const [searchValue, setSearchValue] = useState("");
  const [dataCheckOuts, setDataCheckout] = useState([]);
  const [getData,setGetData] = useState([]);

  const [checkOuts, { data: checkOutData, loading }] = useLazyQuery(CHECK_OUTS, {
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    checkOuts({
      variables: {
        where: {
          _id: searchValue ? searchValue : undefined,
          // customer: datas?._id? parseInt(datas?._id):null,
          // status:String('COMPLETED'),
        },
        // skip: 1000,
        limit: limit,
      },
    });
    if (checkOutData) {
      setDataCheckout(checkOutData?.checkOuts?.data);
      setTotal(checkOutData?.checkOuts?.total);
    }
  }, [limit, searchValue, reloadData, checkOutData]);



  const _onSearch = (e) => {
    let value = e?.target?.value;
    if (!value) value = undefined;
    setSearchValue(value);
  };
  const _showDetails = (data) => {
    setGetData(data);
    
  }
  return (
    <>
      <div id="appCapsule">
        <div className="justify-content-md-center">
          <div className="appHeader text-light border-0">
            <div style={{ flex: 1 }} className="text-left">
              <button
                className="btn text-white mr-2"
                onClick={() => history.goBack()}
              >
                <i className="icon-x fs-4" />
              </button>
            </div>
            ການເຄື່ອນໄຫວ
            <div
              className="text-white pageTitle text-right text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <button
                className="btn text-white mr-0"
                onClick={() => setReloadData(!reloadData)}
              >
                {loading ? loadingData(23) : <i className="icon-cycle fs-4" />}
              </button>
            </div>
          </div>
          {/* //==========================================================================  Menu */}
          <div className="extraHeader">
            <ul className="nav nav-tabs style1" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#pilled"
                  role="tab"
                  onClick={() => history.push(`/history`)}
                >
                  ປະຫວັດການຈອງ
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#lined"
                  role="tab"
                >
                  ປະຫວັດການໃຊ້ບໍລິການ
                </a>
              </li>
            </ul>
          </div>

          {/* //========================================================================== */}
          <div
            className="modal fade action-sheet"
            id={"DialogBlockButton"}
            tabIndex={1}
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div
                className="modal-content"
                style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">ລາຍລະອຽດຫ້ອງ</h5>
                </div>
                <div className="modal-body">
                  <ul className="action-button-list">
                    <li>
                      <a className="btn btn-list">
                        <span>ຊື່ຫ້ອງ</span>
                        <span className="text-primary">
                          {getData?.room?.title_lao
                            ? getData?.room?.title_lao
                            : ""}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="btn btn-list">
                        <span>ລາຄາຄັ້ງຄືນ</span>
                        <span className="text-primary">
                          {getData?.room?.priceFull
                            ? currency(getData?.room?.priceFull) + " ກີບ"
                            : ""}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="btn btn-list">
                        <span>ລາຄາຊົ່ວຄາວ</span>
                        <span className="text-primary">
                          {getData?.room?.priceHalf
                            ? currency(getData?.room?.priceHalf) + " ກີບ"
                            : ""}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="btn btn-list">
                        <span>ປະເພດການຈອງ</span>
                        <span className="text-primary">
                          {getData?.checkOutType === "HALF" ? "ຈອງຊົ່ວຄາວ" : ""}
                          {getData?.checkOutType === "FULL" ? "ຈອງຄັ້ງຄືນ" : ""}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="btn btn-list">
                        <span>ເວລາຈອງ</span>
                        <span className="text-primary">
                          {getData?.checkOutTime ? getData?.checkOutTime : ""}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a className="btn btn-list">
                        <span>ວັນທີຈອງ</span>
                        <span className="text-primary">
                          {getData?.checkOutDate
                            ? formatDate(getData?.checkOutDate)
                            : ""}
                        </span>
                      </a>
                    </li>
                    <li className="action-divider" />
                    <li className="w-100 text-center">
                      <a
                        href="javascript:void(0)"
                        className="btn btn-list text-danger w-100 text-center"
                        data-dismiss="modal"
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        <center>ປິດ</center>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* //========================================================================== */}
          <div
            className="section mt-4"
            // style={{ backgroundColor: "#958d9e" }}
          >
            <div className="form-group basic">
              <input
                type="search"
                className="form-control form-control-lg mb-2"
                onChange={(e) => _onSearch(e)}
                placeholder="ຄົ້ນຫາ"
              />
            </div>
            <div className="section-heading">
              <h4>ທັງໝົດ {loading ? 0 : total ? total : 0} ລາຍການ</h4>
              <small className="text-danger" onClick={() => setLimit(total)}>
                ເບິ່ງທັງໝົດ
              </small>
            </div>
          </div>
          <div className="section mt-2 mb-2">
            {dataCheckOuts &&
              dataCheckOuts?.map((item, index) => (
                <ul className="listview image-listview mb-2" key={index}>
                  <li>
                    <a href="app-transactions.html" className="item">
                      <div className="icon-boxs bg-primary">
                        <i className="icon-sun" />
                      </div>
                      <a
                        className="in"
                        data-toggle="modal"
                        data-target="#DialogBlockButton"
                        onClick={() => _showDetails(item)}
                      >
                        ເຄີຍຈອງຫ້ອງ:{" "}
                        {item?.room?.title_lao ? item?.room?.title_lao : "_"}
                      </a>
                    </a>
                  </li>
                </ul>
              ))}

            <div>
              <button
                type="button"
                className="btn btn-block btn-primary btn-lg rounded mt-1"
                onClick={() => setLimit(limit + 10)}
              >
                ເບິ່ງເພີ່ມເຕີມ
              </button>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
