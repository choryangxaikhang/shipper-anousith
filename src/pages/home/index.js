/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import {
  currency
} from "../../helper";
import BookingNow from "../../components/BookingNow";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import OtherMoney from "./OtherMoney";
import ListMoney from "./ListMonay";

export default function Home() {
  const { history } = useReactRouter();
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [getPayrollSummary, setDataPayrollSummary] = useState([]);
  const [fetchAnsItem, { data: dataPayrollSummary, loading }]
    = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
      fetchPolicy: "cache-and-network",
    });
  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, []);
  useEffect(() => {
    setDataPayrollSummary(dataPayrollSummary?.payrollSummaries?.data[0]);
  }, [dataPayrollSummary]);
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
              {/* <a className="ml-3">
                <i className="icon-search1" style={{ fontSize: 20 }} />
              </a> */}
            </div>
            ໜ້າຫຼັກ
            <div
              className="text-white pageTitle text-center text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <a className="mr-3 float-right">
                <i className="icon-bell" style={{ fontSize: 20 }} />
              </a>
            </div>
          </div>
          <div className="body-content body-content-lg mt-5">
            <div className="container">
              <div className="add-card section-to-header mb-30">
                <div className="add-card-inner">
                  <div className="add-card-item add-card-info">
                    <p>ເງິນເດືອນພື້ນຖານ</p>
                    <h3>{getPayrollSummary ? currency(getPayrollSummary?.basicSalary): 0}{" "}ກີບ</h3>
                  </div>
                  <div
                    className="add-card-item add-balance"
                  >
                    <a href="javascript:void(0)" className="p-1">
                      <QRCode value="54655464889" size={50} />
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
                          <h3>{getPayrollSummary ? currency(getPayrollSummary?.extraIncome) : 0}{" "}ກີບ</h3>
                        </div>
                        <p>ເງິນເພີ່ມ</p>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 pb-15">
                    <div className="option-card option-card-blue">
                      <a href="javascript:void(0)">
                        <div className="option-card-icon">
                          <h3>{getPayrollSummary ? currency(getPayrollSummary?.deductionExpense) : 0}{" "}ກີບ</h3>
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
                          <h3>{getPayrollSummary ? currency(getPayrollSummary?.finalIncome) : 0} {" "}ກີບ</h3>
                        </div>
                        <p>ເງິນໄດ້ຮັບສຸດທິ</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <OtherMoney />
              <ListMoney />
            </div>
          </div>
          <BottomNav />
        </div>
      </body>
    </>
  );
}
