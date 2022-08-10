import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import male from "../../img/male.png";
import { Image } from "react-bootstrap";
import {
  aws_url_employee_Image,
  currency,
  loadingData
} from "../../helper";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import OtherMoney from "./OtherMoney";
import { HISTORY } from "../../routes/app";
export default function Home() {
  const { history } = useReactRouter();
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [total, setTotal] = useState(0);
  const [getPayrollSummary, setDataPayrollSummary] = useState([]);
  const [
    fetchItem,
    { data: setNoticeConfirm, loading: loadingTotal },
  ] = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
    fetchPolicy: "cache-and-network",
  });
  const [fetchAnsItem, { data: dataPayrollSummary, loading: loading }]
    = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
      fetchPolicy: "cache-and-network",
    });
  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          // forMonth:
          // forYeara:
        },
        limit:1,
        orderBy: "createdAt_DESC",
      },
    });
  }, []);

  useEffect(() => {
    fetchItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          confirmStatus: "UNCONFIRMED"
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [userData]);

  useEffect(() => {
    setDataPayrollSummary(dataPayrollSummary?.payrollSummaries?.data[0]);
  }, [dataPayrollSummary]);

  useEffect(() => {
    if (setNoticeConfirm) {
      setTotal(setNoticeConfirm?.payrollSummaries?.data?.length);
    }
  }, [setNoticeConfirm]);
  return (
    <>
      <body>
        <div
          id="appCapsule"
          style={{
            backgroundColor: "#eb6572",
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          <div className="appHeader text-light border-0 text-right">
            <div style={{ flex: 1 }} className="text-left">
            </div>
            ໜ້າຫຼັກ
            <div
              className="text-white pageTitle text-center text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <a className="mr-3 float-right"
                  onClick={(e)=>history.push(`${HISTORY}/confirm`)}
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
          <div className="body-content body-content-lg mt-5">
            <div className="container">
              <div className="add-card section-to-header mb-30">
                <div className="add-card-inner">
                  <div className="add-card-item add-card-info">
                    <p>ເງິນເດືອນພື້ນຖານ</p>
                    {loading ? loadingData(25) :
                      (<>
                        <h3> {getPayrollSummary ?
                          currency(getPayrollSummary?.basicSalary) : 0}{" "}ກີບ</h3>
                      </>)
                    }
                  </div>
                  <div
                    className="add-card-item add-balance"
                  >
                    <a href="javascript:void(0)" className="p-1">
                      {/* <QRCode value="54655464889" size={50} /> */}
                      {getPayrollSummary?.profileImage ? (
                        <Image
                          className="img-zoom-hover"
                          src={
                            `${aws_url_employee_Image}${getPayrollSummary?.profileImage}`
                          }
                          style={{
                            height: 40,
                            width: 40,
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <>
                          <Image
                            className="img-zoom-hover"
                            src={
                              male
                            }
                            style={{
                              height: 40,
                              width: 40,
                              cursor: "pointer",
                            }}
                          />
                        </>)
                      }<br />
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
                        <div className="option-card-icon">
                          {loading ? loadingData(25) :
                            (<>
                              <h3>{getPayrollSummary ? currency(getPayrollSummary?.extraIncome) : 0}{" "}ກີບ</h3>
                            </>)
                          }
                        </div>
                        <p>ເງິນເພີ່ມ</p>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 pb-15">
                    <div className="option-card option-card-blue">
                      <a href="javascript:void(0)">
                        <div className="option-card-icon">
                          {loading ? loadingData(25) :
                            (<>
                              <h3>{getPayrollSummary ? currency(getPayrollSummary?.deductionExpense) : 0}{" "}ກີບ</h3>

                            </>)
                          }
                        </div>
                        <p>ເງິນຫັກ</p>
                      </a>
                    </div>
                  </div>
                  <div className="col-12 pb-15">
                    <div className="option-card option-card-red">
                      <a
                        href="javascript:void(0)"
                        data-bs-toggle="modal"
                        data-bs-target="#exchange"
                      >
                        <div className="option-card-icon">
                          {loading ? loadingData(25) :
                            (<>
                              <h3>{getPayrollSummary ? currency(getPayrollSummary?.finalIncome) : 0} {" "}ກີບ</h3>
                            </>)
                          }
                        </div>
                        <p>ເງິນໄດ້ຮັບສຸດທິ</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <OtherMoney />
            </div>
          </div>
          <BottomNav />
        </div>
      </body>
    </>
  );
}
