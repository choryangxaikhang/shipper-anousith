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
          <table className="table  table-sm text-black">
            <tbody>
              {dataPayrollSummary &&
                dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                  <>
                    <tr>
                      <td>ປີ/ເດືອນ </td>
                      <td className="text-end p-1">
                        {data?.forYear ? data?.forYear : "-"}/
                        {data?.forMonth ? data?.forMonth : "-"}

                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນເດືອນພື້ນຖານ </td>
                      <td className="text-end p-1">
                        {data?.basicSalary ? currency(data?.basicSalary) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນຕຳແຫນ່ງ </td>
                      <td className="text-end p-1">
                        {data?.positionSalary ? currency(data?.positionSalary) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນອາກອນ </td>
                      <td className="text-end p-1">
                        {data?.taxIncome ? currency(data?.taxIncome) : 0}
                      </td>
                    </tr>
                    <tr
                      onClick={() => setGetDataDetailExtra(data?._id)}
                    >
                      <td> ເງິນເພີ່ມ</td>
                      <td className="text-end p-1">
                        {data?.extraIncome ? currency(data?.extraIncome) : 0}
                      </td>
                    </tr>
                    <tr
                      onClick={() => setDetailOt(data?._id)}
                    >
                      <td>ເງິນໂອທີ </td>
                      <td className="text-end p-1">
                        {data?.otIncome ? currency(data?.otIncome) : 0}

                      </td>
                    </tr>
                    <tr
                      onClick={() => setDetailIBonus(data?._id)}
                    >
                      <td>ເງິນໂບນັດ </td>
                      <td className="text-end p-1">
                        {data?.bonusIncome ? currency(data?.bonusIncome) : 0}
                      </td>
                    </tr>
                    <tr
                      onClick={() => setDetailDiLigent(data?._id)}
                    >
                      <td> ເງິນຂະຫຍັນ </td>
                      <td className="text-end p-1">
                        {data?.diligentIncome ? currency(data?.diligentIncome) : 0}
                      </td>
                    </tr>
                    <tr
                      onClick={() => setDetailDeduction(data?._id)}
                    >
                      <td> ເງິນຫັກ </td>
                      <td className="text-end p-1">
                        {data?.deductionExpense ? currency(data?.deductionExpense) : 0}
                      </td>
                    </tr>
                    <tr
                      onClick={() => setDetailBorrow(data?._id)}
                    >
                      <td>ເງິນເບິກລ່ວງຫນ້າ </td>
                      <td className="text-end p-1">
                        {data?.borrowExpense ? currency(data?.borrowExpense) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນປະກັນສັງຄົມ </td>
                      <td className="text-end p-1">
                        {data?.InsuranceExpense ? currency(data?.InsuranceExpense) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td><b>ຍອດເງິນທີ່ຈະໄດ້ຮັບ</b></td>
                      <td className="text-end p-1 fs-5">
                        {data?.finalIncome ? currency(data?.finalIncome) : 0}
                      </td>
                    </tr>
                  </>
                )
                )}
            </tbody>
          </table>
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








