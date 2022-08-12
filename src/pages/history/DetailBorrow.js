import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { currency, loadingData } from "../../helper";
import { QUERY_BORROW } from "./apollo";
import "./utils/index.css";
export default function DetailBorrow({ _id, onHide }) {
  const [show, setShow] = useState(false);
  const [fetchData, { data: dataBorrow, loading }] = useLazyQuery(
    QUERY_BORROW,
    {
      fetchPolicy: "network-only",
    }
  );
  useEffect(() => {
    if (_id) {
      fetchData({
        variables: {
          where: {
            summaryID: _id,
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
          <Modal.Title>ລາຍລະອຽດເງິນເບິກລ່ວງຫນ້າ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2  mr-4">
          <div className="text-center">{loading && loadingData(25)}</div>

          {dataBorrow?.BorrowOfPayrolls.total > 0 ? (
            <>
              {dataBorrow &&
                dataBorrow?.BorrowOfPayrolls?.data?.map((data, index) => (
                  <>
                    <p className="border-bottom">
                      <b>{index + 1}.</b>{" "}
                      {data?.note ? data?.note : "-"}
                    </p>
                  </>
                )
                )}</>

          ) : (<>
            <p className="text-danger">
              ບໍມີເງິນເບີກລ່ວງຫນ້າ!
            </p>
          </>)
          }

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
