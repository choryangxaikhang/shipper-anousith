import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  currency,
  formatDateDash,
  loadingData,
  paiStatus,
} from "../../../../helper";
import TypeHouse from "../../booking/TypeHouse";
import { QUERY_REPORT_BOOKING } from "./apollo";
import "./utils/index.css";
export default function DetailRoom({ _id, onHide }) {
  const [show, setShow] = useState(false);
  const [fetchData, { data: setData, loading }] = useLazyQuery(QUERY_REPORT_BOOKING, {
    fetchPolicy: "network-only",
  });
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
        role="dialog"
      >
        <Modal.Header style={{ marginTop: -20 }}>
          <Modal.Title>ຂໍ້ມູນຫ້ອງ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2  mr-4">
          <div className="text-center">{loading && loadingData(25)}</div>
          {setData?.bookings?.total > 0 ? (
            <>
              {setData?.bookings?.data?.map((data, index) => (
                <>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ຫ້ອງ</span>
                    <span className="text-black text-end">
                      {data?.room?.title_lao}
                    </span>
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ປະເພດກິດຈະການ</span>
                    <TypeHouse getId={data?.house?._id} />
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ຊື່ກິດຈະການ</span>
                    <span className="text-black text-end">
                      {data?.house?.houseName}
                    </span>
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ຊື່ລູກຄ້າ</span>
                    <span className="text-black text-end">
                      {data?.customer?.fullName}
                    </span>
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ເວລາຈອງ</span>
                    <span className="text-black text-end">
                      {data?.bookTime}
                    </span>
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ວັນທີຈອງ</span>
                    <span className="text-black text-end">
                      {formatDateDash(data?.bookDate)}
                    </span>
                    <br />
                  </div>

                  {data?.bookingType === "FULL" ? (
                    <>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ຈຳນວນມື້</span>
                        <span className="text-black text-end">
                          {currency(data?.inTime)}
                        </span>
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className=" bill-item-list pt-2" id="border">
                        <span>ຊົ່ວໂມພັກ</span>
                        <span className="text-black text-end">
                          {currency(data?.inTime ? data?.inTime : 0)}
                        </span>
                        <br />
                      </div>
                    </>
                  )}
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ພັກຄ້າງຄືນ</span>
                    <span className="text-black text-end">
                      {currency(data?.fullPriceTotal ? data?.fullPriceTotal : 0)}
                    </span>
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ພັກຊົ່ວຄາວ</span>
                    <span className="text-black text-end">
                      {currency(data?.halfPriceTotal ? data?.halfPriceTotal : 0)}
                    </span>
                    <br />
                  </div>
                  <div className=" bill-item-list pt-2" id="border">
                    <span>ຊຳລະ</span>
                    <span className="text-black text-end">
                      {paiStatus(data?.paidStatus)}
                    </span>
                    <br />
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              <p className="text-danger">ບໍ່ມີຂໍ້ມູນ</p>
            </>
          )}
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
