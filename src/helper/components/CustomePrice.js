import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { currency } from "..";
import { BRANCHES } from "./apollo";

export default function CustomPrices({
  style,
  className,
  defaultValue,
  size,
  onChange,
  onClick,
  defaultPrice
}) {
  const inputSize =
    size === "lg bg-white"
      ? "form-control-lg"
      : size === "sm bg-white"
      ? "form-control-sm bg-white"
      : "form-control-md bg-white";
  const [searchValue, set] = useState();
  const [show, setShow] = useState(false);

  // console.log({defaultPrice})
  const data = [
    { value: 0, title: "ກຳນົດເອງ", price: 7000 },
    { value: 1, title: "ລົດຈັກ WAVE100", price: 250000 },
    { value: 2, title: "ລົດຈັກ CLICK-I", price: 300000 },
    { value: 3, title: "ລົດຈັກ FINO", price: 300000 },
    { value: 4, title: "ລົດຈັກ SCOOPY", price: 300000 },
    { value: 5, title: "ລົດຈັກ PCX", price: 400000 },
    { value: 6, title: "ລົດຈັກ Big Bike", price: 600000 },
    { value: 7, title: "ລົດໄຟຟ້າ", price: 200000 },
    { value: 8, title: "ລົດຖີບ (ນ້ອຍ)", price: 60000 },
    { value: 9, title: "ລົດຖີບ (ກາງ)", price: 80000 },
    { value: 10, title: "ລົດຖີບ (ໃຫຍ່)", price: 100000 },
    { value: 1, title: "ເອກະສານສະບັບ Copy", price: 15000 },
    // { value: 12, title: "ເອກະສານສະບັບແທ້", price: 25000 },
    { value: 13, title: "ໂຊຟາ (ນ້ອຍ)", price: 150000 },
    { value: 14, title: "ໂຊຟາ (ໃຫຍ່)", price: 200000 },
    { value: 15, title: "ເສື່ອນອນ (ນ້ອຍ)", price: 120000 },
    { value: 16, title: "ເສື່ອນອນ (ໃຫຍ່)", price: 160000 },
  ];

  const handleClick = (item) => {
    if (onClick) {
      onClick(item);
    }
    setShow(false);
  };

  return (
    <React.Fragment>
      <input
        type={"button"}
        className={`form-control text-left ${inputSize} ${className}`}
        style={{ opacity: defaultValue ? 1 : 0.3 }}
        value={defaultValue ? defaultValue : "ເລືອກພັດສະດຸ..."}
        onClick={() => setShow(true)}
      />
      <Modal
        show={show}
        centered
        style={style}
        className={className}
        onHide={() => setShow(false)}
      >
        <Modal.Header>
          <Modal.Title className="col-md-12 text-center">
            ເລືອກປະເພດພັດສະດຸ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="mt-2">
            {data?.map((data, index) => (
              <div
                className="d-flex "
                key={index}
                onClick={() => handleClick(data)}
              >
                <table className="table">
                  <tr>
                    <td className="text-left fs-6 text-black">
                      <i class="fa-solid fa-gift text-danger mr-2"></i>
                      {data?.title}
                    </td>
                    <td className="text-right fs-6 text-black">
                      {" "}
                      {data?.price ? currency(data?.price) : 0}
                    </td>
                  </tr>
                </table>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
