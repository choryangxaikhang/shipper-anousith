import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { currency, loadingData } from "../../helper";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import "./utils/index.css";
export default function DetailItem({ _id, onHide }) {
  const [show, setShow] = useState(false);
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

      setShow(true);
    }
  }, [_id]);
  return (
    <>
      <Modal
        onHide={(e) => {
          setShow(false);
          if (onHide) onHide(e);
        }}
        show={show}
        className="modal action-sheet"
        tabindex="-1"
        role="dialog"
      >
        <Modal.Header>
          <Modal.Title>ລາຍລະອຽດ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2  mr-4">
          <div className="text-center">{loading && loadingData(25)}</div>
          <table className="table  table-sm text-black">
            <tbody>
              {dataPayrollSummary &&
                dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                  <>
                    <tr>
                      <td>ເດືອນ </td>
                      <td className="text-end">
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
        </Modal.Body>
        <button
          className="btn text-black me-1 border-top"
          onClick={(e) => {
            setShow(false);
            if (onHide) onHide(e);
          }}
        >
          <i className="icon-close mr-1 text-primary" />
          ປິດ
        </button>
      </Modal>
    </>
  );
}
