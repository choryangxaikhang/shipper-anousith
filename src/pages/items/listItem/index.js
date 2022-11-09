/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
  detectPhoneNumber,
  formatDateDash,
  ItemStatus,
  startMonth,
  ShipperStatus,
  getStaffLogin,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";
import { useLazyQuery } from "@apollo/client";
import { LIST_SHIPPER_ITEM, QUERY_LIST_ITEM } from "../apollo";
import { DETAIL_DATA_LIST } from "../../../routes/app";
import image from "../../../img/Nodata.png"

export default function DataListItem() {
  const { history, location, match } = useReactRouter();
  const [reloadData, setReloadData] = useState(false);
  const [startDateValue, setStartDateValue] = useState(startMonth());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchValue, setValue] = useState()
  const [_item, setResult] = useState();
  const [_pickupItem, setPickup] = useState();
  const userState = getStaffLogin();


  const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  const [fetchPickupOfItem, { data: resultPickup, }] = useLazyQuery(QUERY_LIST_ITEM, {
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          // shipper: userState?._id,
          trackingId: searchValue ? searchValue : undefined,
          deliveryCompletedDateBetween: [startDateValue, endDateValue],
          // itemStatus: "COMPLETED"
        },
      },
    });
    fetchPickupOfItem({
      variables: {
        where: {
          // shipper: userState?._id,
          status: "RECEIVED",
          receivedDateBetween: [startDateValue, endDateValue]
        },
      },
    });
  }, [searchValue, startDateValue, endDateValue, reloadData]);

  useEffect(() => {
    setResult(result?.items?.data);
    setPickup(resultPickup?.pickupOfItems?.data);
  }, [result, resultPickup])

  const total = result?.items?.total;
  const totalPickup = resultPickup?.pickupOfItems?.total;
  const message = "ສະບາຍດີ"

  return (
    <>
      <div className=" body-content-lg" style={{ marginTop: 50 }}>
        <div className="option-section">
          <div className="col-12">
            <div className="listed-detail">
              <div className="row">
                <div className="col-6 mb-1">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={formatDateDash(startDateValue)}
                    onChange={(e) => {
                      setStartDateValue(e.target.value);
                    }}
                  />
                </div>
                <div className="col-6 mb-1">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={formatDateDash(endDateValue)}
                    onChange={(e) => {
                      setEndDateValue(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <span className="btn btn-secondary">
                <i className="icon-search" />
              </span>
              <input
                type="search"
                className="form-control form-control-sm"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                placeholder="tracking" />
            </div>
            <p className="title mt-1">ຈຳນວນ {total + totalPickup || 0} ລາຍການ</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="section">
          <div className="transactions ">
            {_pickupItem && _pickupItem?.map((item) => (
              <a href="#" className="item">
                <div className="detail">
                  <div className="align-top" style={{ textAlign: 'left' }}>
                    <i className="fa-solid fa-triangle-exclamation fa-2x mr-1"
                    // onClick={() => history.push(`${DETAIL_ITEMS}/${item?._id} `)}
                    />
                  </div>

                  <div >
                    <strong>ID: {item?.customer?.id_list}</strong>
                    <p>ຊື່: {item?.customer?.full_name}</p>
                    <p>
                      <a className="text-link" target="_blank"
                        href={`https://wa.me/${detectPhoneNumber(item?.customer?.contact_info
                        )}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
                        <i className="fas fa-phone" />
                        {item?.customer?.contact_info}
                      </a>
                    </p>
                    <p>ຈຳນວນ: {item?.amount}</p>
                    <p>ວັນທີ່: {formatDateDash(item?.receivedDate || " ")}</p>
                    <>
                      <small className="text-success">
                        {ShipperStatus(item?.status)}
                      </small>
                    </>
                  </div>
                </div>
                <div className="right border">
                  <img
                    className="img-xl rounded-circle"
                    src={
                      item?.signature?.length
                        ? item?.signature[item?.signature?.length - 1]?.image
                        : image
                    }
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "40%",
                      border: "2px solid de0a0af2",
                    }}
                  />
                </div>
              </a>
            ))}

            {_item && _item?.map((item) => (
              <a href="#" className="item">
                <div className="detail">
                  <div className="align-top"
                  >
                    <i className="fa-solid fa-cart-arrow-down fa-2x mr-1 text-dark"
                      onClick={() => history.push(`${DETAIL_DATA_LIST}/${item?._id} `)}
                    />
                  </div>

                  <div className="text-nowrap">
                    {/* <strong>{item?.trackingId}</strong> */}
                    <strong>ID: {item?.customer?.id_list}</strong>
                    <strong>TK: {item?.trackingId}</strong>
                    <p>ຊື່: {item?.receiverName}</p>
                    <p>
                      <a className="text-link" target="_blank"
                        href={`https://wa.me/${detectPhoneNumber(item?.receiverPhone
                        )}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
                        <img style={{ width: 20 }} src={whatsapp} alt="" />{item?.receiverPhone}
                      </a>
                    </p>

                    <>
                      {item?.itemStatus === "COMPLETED" ? (
                        <small className="text-success">
                          {ItemStatus(item?.itemStatus)}
                        </small>
                      ) : (
                        <small className="text-danger">
                          {ItemStatus(item?.itemStatus)}
                        </small>
                      )}
                    </>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
