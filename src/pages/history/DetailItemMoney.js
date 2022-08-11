import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Modal, Button } from "react-bootstrap";
import { currency, getStaffLogin, loadingData } from "../../helper";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import "./utils/index.css";
import { HISTORY } from "../../routes/app";
import DetailExtra from "./DetaileExtra";
import DetailOt from "./DetailOt";
import DetailIBonus from "./DetailIBonus";
import DetailDiLigent from "./DetailDiLigent";
import DetailDeduction from "./DetailDeduction";
import DetailBorrow from "./DetailBorrow";
export default function DetailItemMoney() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const _id = match?.params?._id;
  const [reloadData, setReloadData] = useState(false);
  const [getDataDetailExtra, setGetDataDetailExtra] = useState();
  const [detailOt, setDetailOt] = useState();
  const [detailIBonus, setDetailIBonus] = useState();
  const [detailDiLigent, setDetailDiLigent] = useState();
  const [detailDeduction, setDetailDeduction] = useState();
  const [detailBorrow, setDetailBorrow] = useState();
  const [fetchData, { data: dataPayrollSummary, loading }] = useLazyQuery(
    QUERY_PAYROLL_SUMMARY,
    {
      fetchPolicy: "network-only",
    }
  );
  useEffect(() => {
    if (_id) {
      fetchData({
        variables: {
          where: {
            _id: _id,
          },
        },
      });
    }
  }, [_id, reloadData]);
  return (
    <>
      <div id="appCapsule">
        <div className="justify-content-md-center"></div>
        <div className="appHeader text-light border-0">
          <div style={{ flex: 1 }} className="text-left">
            <button
              className="btn text-white mr-2"
              onClick={() => history.push(`${HISTORY}/confirm`)}
            >
              <i className="icon-x fs-4" />
            </button>
          </div>
          ລາຍລະອຽດເງິນເດືອນ
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
        <div className="p-2  mr-4">
          <div className="text-center">{loading && loadingData(25)}</div>
          {dataPayrollSummary &&
            dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
              <>
                <div className="container-fluid ml-1 mr-5">
                  <div className="table-responsive">
                    <div className="border-bottom mb-3">
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ປີ/ເດືອນ</span>
                        <span className="text-black text-right user-select-all">
                          {data?.forYear ? data?.forYear : "-"}/
                          {data?.forMonth ? data?.forMonth : "-"}
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ເງິນເດືອນພື້ນຖານ</span>
                        <span className="text-black">
                          {data?.basicSalary ? currency(data?.basicSalary) : 0}
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ເງິນຕຳແຫນ່ງ</span>
                        <span className="text-black">
                          {data?.positionSalary ? currency(data?.positionSalary) : 0}
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ເງິນອາກອນ</span>
                        <span className="text-black">
                          {data?.taxIncome ? currency(data?.taxIncome) : 0}
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border"
                        onClick={() => setGetDataDetailExtra(data?._id)}
                      >
                        <span>ເງິນເພີ່ມ</span>
                        <span className="text-black">
                          {data?.extraIncome ? currency(data?.extraIncome) : 0}
                          <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border"
                        onClick={() => setDetailOt(data?._id)}
                      >
                        <span>ເງິນໂອທີ </span>
                        <span className="text-black">
                          {data?.otIncome ? currency(data?.otIncome) : 0}
                          <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border"
                        onClick={() => setDetailIBonus(data?._id)}
                      >
                        <span>ເງິນໂບນັດ</span>
                        <span className="text-black">
                          {data?.bonusIncome ? currency(data?.bonusIncome) : 0}
                          <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border"
                        onClick={() => setDetailDiLigent(data?._id)}
                      >
                        <span>ເງິນຂະຫຍັນ </span>
                        <span className="text-black">
                          {data?.diligentIncome ? currency(data?.diligentIncome) : 0}
                          <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border"
                        onClick={() => setDetailDeduction(data?._id)}
                      >
                        <span>ເງິນຫັກ</span>
                        <span className="text-black">
                          {data?.deductionExpense ? currency(data?.deductionExpense) : 0}
                          <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border"
                        onClick={() => setDetailBorrow(data?._id)} s
                      >
                        <span>
                          ເງິນເບິກລ່ວງຫນ້າ </span>
                        <span className="text-black">
                          {data?.borrowExpense ? currency(data?.borrowExpense) : 0}
                          <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ເງິນປະກັນສັງຄົມ</span>
                        <span className="text-black">
                          {data?.InsuranceExpense ? currency(data?.InsuranceExpense) : 0}
                        </span>
                      </div>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ຍອດເງິນທີ່ຈະໄດ້ຮັບ</span>
                        <span className="text-success fs-5">
                          {data?.finalIncome ? currency(data?.finalIncome) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
            )}
        </div>
        <DetailExtra _id={getDataDetailExtra} onHide={() => setGetDataDetailExtra()} />
        <DetailOt _id={detailOt} onHide={() => setDetailOt()} />
        <DetailIBonus _id={detailIBonus} onHide={() => setDetailIBonus()} />
        <DetailDiLigent _id={detailDiLigent} onHide={() => setDetailDiLigent()} />
        <DetailDeduction _id={detailDeduction} onHide={() => setDetailDeduction()} />
        <DetailBorrow _id={detailBorrow} onHide={() => setDetailBorrow()} />
      </div>
    </>
  );
}








