import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { formatDateDash, startOfMonth } from "..";
import { AppContext } from "../../App";
import District from "./District";
import Provinces from "./Province";

export default function ModalAddress({ data }) {
  const { dateState, dateDispatch } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [provinceData, setProvinceData] = useState({});
  const [districtData, setDistrictData] = useState({});

  useEffect(() => {
    const _localDate = localStorage.getItem("LOCAL_DATE");
    if (_localDate) {
      dateDispatch({ payload: JSON.parse(_localDate) });
    }
  }, []);
const _obj = { province: provinceData, district: districtData };
  return (
    <React.Fragment>
      <button className="btn text-white mr-0" onClick={() => setShow(true)}>
        <i className="icon-location fs-4" />
      </button>

      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">ເລືອກທີ່ຢູ່</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>ແຂວງ</label>
          <Provinces
            size={"lg"}
            getData={(data) => {
              setProvinceData(data);
              setDistrictData({});
            }}
            defaultValue={provinceData?.provinceName}
          />
          <label className="mt-2">ເມືອງ</label>
          <District
            size={"lg"}
            getData={(data) => {
              setDistrictData(data);
            }}
            where={{ province: provinceData?._id }}
            defaultValue={districtData?.title}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="btn-block btn-lg rounded"
            onClick={() => {
              data(_obj)
              setShow(false);
            }}
          >
          <i className="icon-search1 mr-1"/>  ຄົ້ນຫາ
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
