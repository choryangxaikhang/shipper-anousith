import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { formatDateDash, startOfMonth } from "..";
import { AppContext } from "../../App";

export default function ModalDate() {
  const { dateState, dateDispatch } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(startOfMonth());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const _localDate = localStorage.getItem("LOCAL_DATE");
    if (_localDate) {
      dateDispatch({ payload: JSON.parse(_localDate) });
    }
  }, []);

  return (
    <React.Fragment>
      <button className="btn text-white" onClick={() => setShow(true)}>
        <i className="fa fa-calendar-alt" style={{ fontSize: 22 }} />
      </button>

      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">ເລືອກວັນທີ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>ວັນທີເລີ່ມຕົ້ນ</label>
          <Form.Control
            type="date"
            size="lg"
            onChange={(e) => setStartDate(e.target.value)}
            defaultValue={formatDateDash(dateState?.startDate)}
          />
          <label className="mt-2">ວັນທີສຸດທ້າຍ</label>
          <Form.Control
            type="date"
            size="lg"
            onChange={(e) => setEndDate(e.target.value)}
            defaultValue={formatDateDash(dateState?.endDate)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="btn-block btn-lg"
            onClick={() => {
              const _date = { startDate: startDate, endDate: endDate };
              dateDispatch({
                payload: _date,
              });
              localStorage.setItem("LOCAL_DATE", JSON.stringify(_date));
              setShow(false);
            }}
          >
            <i className="icon-check-circle mr-1" />
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
