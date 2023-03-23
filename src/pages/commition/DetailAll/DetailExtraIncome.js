import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { currency, loadingData } from "../../../helper";
import { QUERY_EXTRA } from "../../home/apollo";
export default function DetailExtraIncome({ _id, onHide }) {
  const [show, setShow] = useState(false);
  const [fetchData, { data: dataBonus, loading }] = useLazyQuery(QUERY_EXTRA, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (_id) {
      fetchData({
        variables: {
          where: {
            summaryID: parseInt(_id),
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
        <Modal.Header style={{ marginTop: -20 }}>
          <Modal.Title>ລາຍລະອຽດເງິນເພິ່ມ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2  mr-4">
          <div className="text-center">{loading && loadingData(25)}</div>
          {dataBonus?.extraIncomePayroll?.data?.map((data, index) => (
            <>
              <p className="border-bottom" key={index}>
                <b>{index + 1}.</b> {data?.note ? data?.note : "-"}{" "}
                {data?.amountOf ? currency(data?.amountOf) : ""} ກີບ
              </p>
            </>
          ))}
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
