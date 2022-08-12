/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import { currency, formatDate, getStaffLogin, getYearCustom, loadingData, _month } from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import DetailItem from "./DetailItem";
import NoData from "../../helper/components/NoData";
import { DETAIL_MONEY } from "../../routes/app";
import moment from "moment";
export default function CompleteConfirm() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const queryParams = new URLSearchParams(location?.search);
  const [getDataDetail, setGetDataDetail] = useState();
  const [reloadData, setReloadData] = useState(false);
//state month adn year
  const [getYearLook] = useState(getYearCustom());
  const currentMonth = moment(new Date()).format("MM");
  const currentYear = moment(new Date()).format("YYYY");
  const [getYear, setGetYear] = useState(currentYear);
  const [getMoth, setGetMonth] = useState(currentMonth);
  const [_pushMoth, setMoth] = useState();
  const [_pushYear, setYear] = useState();
// callData
  const [fetchAnsItem, { data: dataPayrollSummary, loading }] =
    useLazyQuery(QUERY_PAYROLL_SUMMARY, {
      fetchPolicy: "cache-and-network",
    });
  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          // approveStatus:"TRUE",
          forMonth: parseInt(_pushMoth) ? parseInt(_pushMoth) : undefined,
          forYear: parseInt(_pushYear) ? parseInt(_pushYear) : undefined,
          confirmStatus: "CONFIRMED"
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [reloadData,_pushMoth,_pushYear]);

  function _pushMothAndYear() {
    setYear(getYear);
    setMoth(getMoth);
  }

  return (
    <div style={{ marginTop: -80, backgroundColor: "white" }}>
      <div id="appCapsule">
        <div className="justify-content-md-center">
          <div className="appHeader text-light border-0">
            <div style={{ flex: 1 }} className="text-center">
            </div>
            ລາຍການຢືນຢັນສຳເລັດແລ້ວ
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

          <div className="section mt-4" style={{ marginTop: -100 }}>
            <div className="input-group">
              <select
                className="form-control bg-white"
                onChange={(e) => setGetMonth(e.target.value)}
              >
                {_month?.map((selectMoth, index) => (
                  <option
                    key={index}
                    selected={selectMoth.id === currentMonth ? true : false}
                    value={selectMoth?.id}
                  >
                    {selectMoth?.month}
                  </option>
                ))}
              </select>
              <select
                className="form-control bg-white"
                onChange={(e) => setGetYear(e.target.value)}
              >
                {getYearLook?.map((selectYear, index) => (
                  <option key={index} value={selectYear}>
                    {selectYear}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => _pushMothAndYear()}
              >
                <i className="icon-search1" /> ຄົ້ນຫາ
              </button>
            </div>
          </div>
          <div className="section  mb-2 mt-3">
            <div className="transactions">
              {dataPayrollSummary?.payrollSummaries?.total > 0 ? (
                <div className="listView">
                  {dataPayrollSummary &&
                    dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                      <>
                        <a href="javascript:void(0)" className="item pr-0"
                          onClick={() => history.push(`${DETAIL_MONEY}/${data?._id}`)}
                        >
                          <div className="detail col-md-6 text-start">
                            <strong>ປີ/ເດືອນ:{" "}{data?.forYear ? data?.forYear : "-"}/{data?.forMonth ? data?.forMonth : "-"}
                            </strong>
                          </div>
                          <div className="right col-md-2 text-success text-end me-1">
                            <i className="icon-check-circle mr-1 " />
                            {data?.finalIncome ? currency(data?.finalIncome) : 0}{" "} KIP
                          </div>
                        </a>
                      </>
                    ))}
                </div>
              ) : (
                <NoData loading={loading} />
              )}
            </div>
            <DetailItem _id={getDataDetail} onHide={() => setGetDataDetail()} />
          </div>
          <BottomNav />
        </div>
      </div>
    </div >
  );
}
