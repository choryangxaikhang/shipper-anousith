/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import Imglogo from "../../img/logo-bg.png";
import cover1 from "../../img/cover.jpeg";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import {
  aws_url_image,
  currency,
  formatDateTime,
  loadingData,
} from "../../helper";
import BookingNow from "../../components/BookingNow";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
export default function OtherMoney() {
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
        <div className="saving-goals-section pb-15">
          <div className="progress-card progress-card-red mb-15">
            <div className="progress-card-info">
              <div className="circular-progress" data-note="50.85">
                <svg width={55} height={55} className="circle-svg">
                  <circle
                    cx={28}
                    cy={27}
                    r={25}
                    className="circle-progress circle-progress-path"
                  />
                  <circle
                    cx={28}
                    cy={27}
                    r={25}
                    className="circle-progress circle-progress-fill"
                  />
                </svg>
                <div className="percent">
                  <span className="percent-int">0</span>%
                </div>
              </div>
              <div className="progress-info-text">
                <h3>ເງິນຕຳແຫນ່ງ</h3>
              </div>
            </div>
            <div className="progress-card-amount">
              {getPayrollSummary ? currency(getPayrollSummary?.positionSalary) : 0}{" "}ກີບ
            </div>
          </div>
          <div className="progress-card progress-card-blue mb-15">
            <div className="progress-card-info">
              <div className="circular-progress" data-note={25}>
                <svg width={55} height={55} className="circle-svg">
                  <circle
                    cx={28}
                    cy={27}
                    r={25}
                    className="circle-progress circle-progress-path"
                  />
                  <circle
                    cx={28}
                    cy={27}
                    r={25}
                    className="circle-progress circle-progress-fill"
                  />
                </svg>
                <div className="percent">
                  <span className="percent-int">0</span>%
                </div>
              </div>
              <div className="progress-info-text">
                <h3>ເງິນອາກອນ</h3>
                <p>Living</p>
              </div>
            </div>
            <div className="progress-card-amount">
              {getPayrollSummary ? currency(getPayrollSummary?.taxIncome) : 0}{" "}ກີບ
            </div>
          </div>
          <div className="progress-card progress-card-green mb-15">
            <div className="progress-card-info">
              <div className="circular-progress" data-note={75}>
                <svg width={55} height={55} className="circle-svg">
                  <circle
                    cx={28}
                    cy={27}
                    r={25}
                    className="circle-progress circle-progress-path"
                  />
                  <circle
                    cx={28}
                    cy={27}
                    r={25}
                    className="circle-progress circle-progress-fill"
                  />
                </svg>
                <div className="percent">
                  <span className="percent-int">0</span>%
                </div>
              </div>
              <div className="progress-info-text">
                <h3>ເງິນປະກັນສັງຄົມ</h3>
                <p>Lifestyle</p>
              </div>
            </div>
            <div className="progress-card-amount">
              {getPayrollSummary ? currency(getPayrollSummary?.InsuranceExpense) : 0}{" "}ກີບ
            </div>
          </div>
      </div>
    </>
  );
}
