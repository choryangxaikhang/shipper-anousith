import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  aws_url_images,
  currency,
  formatDateDash,
  loadingData,
  paiStatus,
} from "../../../helper";
import placeholder from "../../../img/placeholder.png";
import { QUERY_BOOKING } from "./apollo";
import TypeHouse from "./TypeHouse";
import "./utils/index.css";
export default function DetailRoom({ _id, onHide }) {
  const [show, setShow] = useState(false);
  const [fetchData, { data: setData, loading }] = useLazyQuery(QUERY_BOOKING, {
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
        animation={true}
        show={show}
        classNameName="modal action-sheet"
        tabindex="-1"
        role="dialog"
      >
        <Modal.Header style={{ marginTop: -20 }}>
          <Modal.Title>ຂໍ້ມູນຫ້ອງ</Modal.Title>
        </Modal.Header>
        <Modal.Body classNameName="p-2  me-2">
          <div classNameName="text-center">{loading && loadingData(25)}</div>
          {setData?.bookings?.total > 0 ? (
            <>
              {setData?.bookings?.data?.map((data, index) => (
                <>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ຫ້ອງ</span>
                    <span classNameName="text-black text-end">
                      {data?.room?.title_lao}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ປະເພດກິດຈະການ</span>
                    <TypeHouse getId={data?.house?._id} />
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ຊື່ກິດຈະການ</span>
                    <span classNameName="text-black text-end">
                      {data?.house?.houseName}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ຊື່ລູກຄ້າ</span>
                    <span classNameName="text-black text-end">
                      {data?.customer?.fullName}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ເວລາຈອງ</span>
                    <span classNameName="text-black text-end">
                      {data?.bookTime}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ວັນທີຈອງ</span>
                    <span classNameName="text-black text-end">
                      {formatDateDash(data?.bookDate)}
                    </span>
                    <br />
                  </div>

                  {data?.bookingType === "FULL" ? (
                    <>
                      <div classNameName=" bill-item-list pt-2" id="border">
                        <span>ຈຳນວນມື້</span>
                        <span classNameName="text-black text-end">
                          {currency(data?.inTime)}
                        </span>
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div classNameName=" bill-item-list pt-2" id="border">
                        <span>ຊົ່ວໂມພັກ</span>
                        <span classNameName="text-black text-end">
                          {currency(data?.inTime)}
                        </span>
                        <br />
                      </div>
                    </>
                  )}
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ພັກຄ້າງຄືນ</span>
                    <span classNameName="text-black text-end">
                      {currency(data?.fullPriceTotal)}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ພັກຊົ່ວຄາວ</span>
                    <span classNameName="text-black text-end">
                      {currency(data?.halfPriceTotal)}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <span>ຊຳລະ</span>
                    <span classNameName="text-black text-end">
                      {paiStatus(data?.paidStatus)}
                    </span>
                    <br />
                  </div>
                  <div classNameName=" bill-item-list pt-2" id="border">
                    <img
                      src={
                        data?.images
                          ? aws_url_images + data?.images
                          : placeholder
                      }
                      classNameName="w-100"
                    />
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              <p classNameName="text-danger">ບໍ່ມີຂໍ້ມູນ</p>
            </>
          )}
        </Modal.Body>
        <button
          classNameName="btn text-white me-1 border-top btn-primary"
          onClick={(e) => {
            setShow(false);
            if (onHide) onHide(e);
          }}
        >
          <i classNameName="icon-close mr-1 text-white" />
          ປິດ
        </button>
      </Modal>
    </>
  );
}
