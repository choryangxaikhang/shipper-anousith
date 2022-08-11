import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Modal, Button } from "react-bootstrap";
import { currency, getStaffLogin, loadingData } from "../../helper";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import "./utils/index.css";
import {HISTORY } from "../../routes/app";
export default function DetailItemMoney() {
  const { match, history, location } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const _id = match?.params?._id;
  const [reloadData, setReloadData] = useState(false);
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
  }, [_id,reloadData]);
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
                      <td className="text-end">
                        {data?.forYear ? data?.forYear : "-"}/
                        {data?.forMonth ? data?.forMonth : "-"}

                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນເດືອນພື້ນຖານ </td>
                      <td className="text-end">
                        {data?.basicSalary ? currency(data?.basicSalary) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນຕຳແຫນ່ງ </td>
                      <td className="text-end">
                        {data?.positionSalary ? currency(data?.positionSalary) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນອາກອນ </td>
                      <td className="text-end">
                        {data?.taxIncome ? currency(data?.taxIncome) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນເພີ່ມ </td>
                      <td className="text-end">
                        {data?.extraIncome ? currency(data?.extraIncome) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນໂອທີ </td>
                      <td className="text-end">
                        {data?.otIncome ? currency(data?.otIncome) : 0}

                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນໂບນັດ </td>
                      <td className="text-end">
                        {data?.bonusIncome ? currency(data?.bonusIncome) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນຂະຫຍັນ </td>
                      <td className="text-end">
                        {data?.diligentIncome ? currency(data?.diligentIncome) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນຫັກ </td>
                      <td className="text-end">
                        {data?.deductionExpense ? currency(data?.deductionExpense) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>ເງິນເບິກລ່ວງຫນ້າ </td>
                      <td className="text-end">
                        {data?.borrowExpense ? currency(data?.borrowExpense) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td> ເງິນປະກັນສັງຄົມ </td>
                      <td className="text-end">
                        {data?.InsuranceExpense ? currency(data?.InsuranceExpense) : 0}
                      </td>
                    </tr>
                    <tr>
                      <td><b>ຍອດເງິນທີ່ຈະໄດ້ຮັບ</b></td>
                      <td className="text-end fs-5">
                        {data?.finalIncome ? currency(data?.finalIncome) : 0}
                      </td>
                    </tr>
                  </>
                )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
