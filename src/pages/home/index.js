import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import { QUERY_ROOM } from "./apollo";
import male from "../../img/male.png";
import { Image } from "react-bootstrap";
import { aws_url_employee_Image, currency, loadingData } from "../../helper";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import OtherMoney from "./OtherMoney";
import { OTHER } from "../../routes/app";
export default function Home() {
  const { history } = useReactRouter();
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [total, setTotal] = useState(0);
  const [getPayrollSummary, setDataRoom] = useState([]);
  const [fetchItem, { data: setNoticeConfirm, loading: loadingTotal }] =
    useLazyQuery(QUERY_ROOM, {
      fetchPolicy: "cache-and-network",
    });
  const [fetchAnsItem, { data: DataRoom, loading: loading }] = useLazyQuery(
    QUERY_ROOM,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
        },
        limit: 1,
        orderBy: "createdAt_DESC",
      },
    });
  }, []);

  useEffect(() => {
    fetchItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          confirmStatus: "UNCONFIRMED",
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [userData]);

  useEffect(() => {
    setDataRoom(DataRoom?.rooms?.data[0]);
  }, [DataRoom]);

  useEffect(() => {
    if (setNoticeConfirm) {
      setTotal(setNoticeConfirm?.rooms?.data?.length);
    }
  }, [setNoticeConfirm]);
  return (
    <>
      <div
        id="appCapsule"
        style={{
          backgroundColor: "#f54f02",
          marginBottom: 0,
          paddingBottom: 0,
        }}
      >
        <div className="appHeader text-light border-0 text-right">
          <div style={{ flex: 1 }} className="text-left"></div>
          ໜ້າຫຼັກ
          <div
            className="text-white pageTitle text-center text-nowrap pr-0"
            style={{ flex: 1 }}
          >
            <a
              className="mr-3 float-right"
              onClick={(e) => history.push(`${OTHER}`)}
            >
              <i className="icon-bell" style={{ fontSize: 20 }} />
              {loadingTotal ? (
                <span style={{ position: "absolute", right: 10, top: 10 }}>
                  {loadingData(10)}
                </span>
              ) : total > 0 ? (
                <span className="badge badge-success mr-1 p-2">
                  <small>{total ? total : 0}</small>
                </span>
              ) : null}
            </a>
          </div>
        </div>
        <div className="body-content body-content-lg ">
          <div className="container">
            <div
              className="add-card section-to-header mb-30"
              style={{ marginTop: -140 }}
            >
              <div className="add-card-inner">
                <div className="add-card-item add-card-info">
                  <p>ຍອດລວມທັງຫມົດ</p>
                  {loading ? (
                    loadingData(25)
                  ) : (
                    <>
                      <h3>
                        {" "}
                        {getPayrollSummary
                          ? currency(getPayrollSummary?.basicSalary)
                          : 0}
                      </h3>
                    </>
                  )}
                </div>
                <div className="add-card-item add-balance">
                  <a href="javascript:void(0)" className="p-1">
                    <i className="fa-solid fa-kip-sign fs-3" />
                  </a>
                </div>
              </div>
            </div>
            <div className="option-section mb-15">
              <div className="row gx-2">
                <div className="col-6 pb-15">
                  <div className="option-card option-card-violet">
                    <a
                      href="javascript:void(0)"
                      data-bs-toggle="modal"
                      data-bs-target="#withdraw"
                    >
                      <p>ລາຍຮັບແຂກເຂົ້າທັງຫມົດ</p>
                      <div className="option-card-icon">
                        {loading ? (
                          loadingData(25)
                        ) : (
                          <>
                            <h3>
                              {getPayrollSummary
                                ? currency(
                                    getPayrollSummary?.extraIncome +
                                      getPayrollSummary?.positionSalary
                                  )
                                : 0}{" "}
                              ກີບ
                            </h3>
                          </>
                        )}
                      </div>
                    </a>
                  </div>
                </div>
                <div className="col-6 pb-15">
                  <div className="option-card option-card-blue">
                    <a href="javascript:void(0)">
                      <p>ລາຍຮັບການຈອງທັງຫມົດ</p>
                      <div className="option-card-icon">
                        {loading ? (
                          loadingData(25)
                        ) : (
                          <>
                            <h3>
                              {getPayrollSummary
                                ? currency(
                                    getPayrollSummary?.deductionExpense +
                                      getPayrollSummary?.InsuranceExpense +
                                      getPayrollSummary?.taxIncome
                                  )
                                : 0}{" "}
                              ກີບ
                            </h3>
                          </>
                        )}
                      </div>
                    </a>
                  </div>
                </div>
                <OtherMoney />
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
