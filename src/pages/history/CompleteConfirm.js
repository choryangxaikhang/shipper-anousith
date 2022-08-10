/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import { currency, formatDate, getStaffLogin, loadingData } from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import DetailItem from "./DetailItem";
import { HOME_PAGE } from "../../routes/app";
import NoData from "../../helper/components/NoData";
export default function CompleteConfirm() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const queryParams = new URLSearchParams(location?.search);
  const [getDataDetail, setGetDataDetail] = useState();
  const data = localStorage.getItem("data");
  const datas = JSON.parse(data);
  const [reloadData, setReloadData] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [fetchAnsItem, { data: dataPayrollSummary, loading }] =
    useLazyQuery(QUERY_PAYROLL_SUMMARY, {
      fetchPolicy: "cache-and-network",
    });

  console.log({ userData })

  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          // approveStatus:"TRUE",
          confirmStatus: "CONFIRMED"
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [reloadData]);

  const _onSearch = (e) => {
    let value = e?.target?.value;
    if (!value) value = undefined;
    setSearchValue(value);
  };
  return (
    <div style={{ marginTop: -80, backgroundColor: "white" }}>
      <div id="appCapsule">
        <div className="justify-content-md-center">
          <div className="appHeader text-light border-0">
            <div style={{ flex: 1 }} className="text-left">
              <button
                className="btn text-white mr-2"
                onClick={() => history.push(HOME_PAGE)}
              >
                <i className="icon-x fs-4" />
              </button>
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
            <div className="form-group basic">
              <input
                type="search"
                className="form-control form-control-lg mb-2"
                onChange={(e) => _onSearch(e)}
                placeholder="ຄົ້ນຫາ"
              />
            </div>
          </div>
          <div className="section  mb-2">
            <div className="transactions">
              {dataPayrollSummary?.payrollSummaries?.total > 0 ? (
                <div className="listView">
                  {dataPayrollSummary &&
                    dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                      <>
                        <a href="javascript:void(0)" className="item pr-0"
                          onClick={() => setGetDataDetail(data?._id)}
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
