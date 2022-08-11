/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import userEvent from "@testing-library/user-event";
export default function OtherMoney() {
  const { history } = useReactRouter();
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [getPayrollSummary, setDataPayrollSummary] = useState([]);
  const [dataNote, setDataNote] = useState(0)
  const [dataInsuranceExpense, setInsuranceExpense] = useState(0)
  const [dataTaxIncome, setTaxIncome] = useState(0)
  const [fetchAnsItem, { data: dataPayrollSummary, loading: loading }]
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

  useEffect(() => {
    setDataNote(getPayrollSummary?.basicSalary / getPayrollSummary?.positionSalary)
    setInsuranceExpense(getPayrollSummary?.basicSalary / getPayrollSummary?.InsuranceExpense)
     setTaxIncome(getPayrollSummary?.basicSalary / getPayrollSummary?.taxIncome)
  }, [getPayrollSummary])

  return (
    <>
      <div className="saving-goals-section pb-15">
        <div className="progress-card progress-card-red mb-15">
          <div className="progress-card-info">
            <div style={{ width: 50, height: 50 }}>
              <CircularProgressbar value={dataNote ? dataNote.toFixed(2) : 0}
                text={`${dataNote ? dataNote.toFixed(2) : 0}%`}
                styles={buildStyles({
                  textColor: "red",
                  pathColor: "red",
                  trailColor: "#ebe4e6"
                })}
              />
            </div>
            <div className="progress-primary-text ms-2">
              <h3>ເງິນຕຳແຫນ່ງ</h3>
            </div>
          </div>
          <div className="progress-card-amount">
            {loading ? loadingData(25) :
              (<>
                {getPayrollSummary ? currency(getPayrollSummary?.positionSalary) : 0}{" "}ກີບ

              </>)
            }
          </div>
        </div>

        <div className="progress-card progress-card-blue mb-15">
          <div className="progress-card-info">
            <div className="circular-progress" data-note={25}>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar value={dataTaxIncome ? dataTaxIncome : 0}
                  text={`${dataTaxIncome ? dataTaxIncome.toFixed(2) : 0}%`} />
              </div>
            </div>
            <div className="progress-info-text">
              <h3>ເງິນອາກອນ</h3>
            </div>
          </div>
          <div className="progress-card-amount">
            {loading ? loadingData(25) :
              (<>
                {getPayrollSummary ? currency(getPayrollSummary?.taxIncome) : 0}{" "}ກີບ

              </>)
            }
          </div>
        </div>
        <div className="progress-card progress-card-green mb-15">
          <div className="progress-card-info">
            <div className="circular-progress" data-note={75}>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar value={dataInsuranceExpense ? dataInsuranceExpense.toFixed(2) : 0}
                  text={`${dataInsuranceExpense ? dataInsuranceExpense.toFixed(2) : 0}%`}
                  styles={buildStyles({
                    textColor: "black",
                    pathColor: "#52ba5e",
                    trailColor: "#ebe4e6"
                  })}
                />
              </div>
            </div>
            <div className="progress-info-text">
              <h3>ເງິນປະກັນສັງຄົມ</h3>
            </div>
          </div>
          <div className="progress-card-amount">
            {loading ? loadingData(25) :
              (<>
                {getPayrollSummary ? currency(getPayrollSummary?.InsuranceExpense) : 0}{" "}ກີບ

              </>)
            }
          </div>
        </div>
      </div>
    </>
  );
}

