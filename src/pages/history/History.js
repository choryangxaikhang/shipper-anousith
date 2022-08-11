import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { QUERY_PAYROLL_SUMMARY, UPDATE } from "./apollo";
import { currency, formatDate, getStaffLogin, loadingData, messageError, messageSuccess, messageWarning, notiflixConfirm } from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import DetailItem from "./DetailItem";
import { DETAIL_MONEY, HOME_PAGE } from "../../routes/app";
import NoData from "../../helper/components/NoData";
export default function History() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const queryParams = new URLSearchParams(location?.search);
  const data = localStorage.getItem("data");
  const datas = JSON.parse(data);
  const [reloadData, setReloadData] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [getDataDetail, setGetDataDetail] = useState();
  const [upDateConfirm] = useMutation(UPDATE);
  const [fetchAnsItem, { data: dataPayrollSummary, loading }]
    = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
      fetchPolicy: "cache-and-network",
    });
  useEffect(() => {
    fetchAnsItem({
      variables: {
        where: {
          empID: parseInt(userData?._id),
          confirmStatus: "UNCONFIRMED"
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
  const _conFirm = async (_id) => {
    console.log({ _id })
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
  return (
    <div style={{ marginTop: -80}}>
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
                        <a href="javascript:void(0)"
                        // style={{backgroundColor: "#ebece6" }}
                          className="item pr-0 ">
                          <div className="detail col-md-10"
                            // onClick={() => setGetDataDetail(data?._id)}
                            onClick={(e) => history.push(`${DETAIL_MONEY}/${data?._id}`)}
                          >
                            <i className="fa-solid fa-hand-holding-dollar fa-2x"/>
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
