import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { QUERY_PAYROLL_SUMMARY, UPDATE } from "./apollo";
import {
  currency,
  getStaffLogin,
  getYearCustom,
  loadingData,
  messageError,
  messageSuccess,
  messageWarning,
  notiflixConfirm, _month
} from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import DetailItem from "./DetailItem";
import { DETAIL_MONEY, HOME_PAGE } from "../../routes/app";
import NoData from "../../helper/components/NoData";
import moment from "moment";
export default function History() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const queryParams = new URLSearchParams(location?.search);
  const [reloadData, setReloadData] = useState(false);
  const [getDataDetail, setGetDataDetail] = useState();
//state month adn year
  const [getYearLook] = useState(getYearCustom());
  const currentMonth = moment(new Date()).format("MM");
  const currentYear = moment(new Date()).format("YYYY");
  const [getYear, setGetYear] = useState(currentYear);
  const [getMoth, setGetMonth] = useState(currentMonth);
  const [_pushMoth, setMoth] = useState();
  const [_pushYear, setYear] = useState();
  const [upDateConfirm] = useMutation(UPDATE);
// call Data
  const [fetchAnsItem, { data: dataPayrollSummary, loading }]
    = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
      fetchPolicy: "cache-and-network",
    });
  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          confirmStatus: "UNCONFIRMED",
          forMonth: parseInt(_pushMoth) ? parseInt(_pushMoth) : undefined,
          forYear: parseInt(_pushYear) ? parseInt(_pushYear) : undefined,
        },
        orderBy: "createdAt_DESC",
      },
    });
  }, [reloadData,_pushMoth,_pushYear]);
  
  const _conFirm = async (_id) => {
    notiflixConfirm("ຕ້ອງການຢືນຢັນຖືກຕ້ອງແທ້ ຫຼື ບໍ່?", async () => {
      try {
        const { data: updateData } = await upDateConfirm({
          variables: {
            data: {
              confirmStatus: "CONFIRMED",
            },
            where: {
              _id: _id,
            },
          },
        });
        if (updateData) {
          messageSuccess("ຢືນຢັນເງິນເດືອນສຳເລັດ");
          setReloadData(!reloadData);
        }
      } catch (error) {
        messageWarning("ຢືນຢັນບໍ່ສຳເລັດ");
        console.log(error);
      }
    });
  };
  function _pushMothAndYear() {
    setYear(getYear);
    setMoth(getMoth);
  }

  return (
    <div style={{ marginTop: -80 }}>
      <div id="appCapsule">
        <div className="justify-content-md-center">
          <div className="appHeader text-light border-0">
            <div style={{ flex: 1 }} className="text-center">
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
          <div className="section mt-4" style={{ marginTop: -100 }}>
            <div className="input-group">
              <select
                className="form-control bg-white"
                onChange={(e) => setGetMonth(e.target.value)}
              >
                {_month?.map((item, index) => (
                  <option
                    key={index}
                    selected={item.id === currentMonth ? true : false}
                    value={item?.id}
                  >
                    {item?.month}
                  </option>
                ))}
              </select>
              <select
                className="form-control bg-white"
                onChange={(e) => setGetYear(e.target.value)}
              >
                {getYearLook?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-lg btn-primary"
                onClick={() => _pushMothAndYear()}
              >
                <i className="icon-search1 me-1" /> ຄົ້ນຫາ
              </button>
            </div>
          </div>
          <div className="section  mb-2 mt-5">
            <div className="transactions">
              {dataPayrollSummary?.payrollSummaries?.total > 0 ? (
                <div className="listView">
                  {dataPayrollSummary &&
                    dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                      <>
                        <a href="javascript:void(0)"
                          className="item pr-0 ">
                          <div className="detail col-md-10"
                            onClick={() => history.push(`${DETAIL_MONEY}/${data?._id}`)}
                          >
                            <i className="fa-solid fa-hand-holding-dollar fa-2x" />
                            <div className="ml-2">
                              <strong>ປີ/ເດືອນ:{" "}{data?.forYear ? data?.forYear : "-"}/{data?.forMonth ? data?.forMonth : "-"}</strong>
                              <b className="text-black">ລວມເງິນ:{" "}
                                {data?.finalIncome ? currency(data?.finalIncome) : 0} </b>
                            </div>
                          </div>
                          <div className="right">
                            <button
                              className="btn btn-primary btn-sm action-button"
                              onClick={(e) => { _conFirm(data?._id) }}
                            >
                              <i className="icon-check-circle mr-1 fa-2x" /> ຢືນຢັນ
                            </button>
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
    </div>
  );
}
