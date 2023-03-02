/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
  detectPhoneNumber,
  formatDateDash,
  ItemStatus,
  startMonth,
  getStaffLogin,
  StatusDelivery,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";
import { useLazyQuery } from "@apollo/client";
import { LIST_ITEM_DELIVERY } from "../apollo";
import { DETAIL_ITEMS_COMPLETED } from "../../../routes/app";

export default function ItemCancel() {
  const { history, location, match } = useReactRouter();
  const [reloadData, setReloadData] = useState(false);
  const [startDateValue, setStartDateValue] = useState(startMonth());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchValue, setValue] = useState()
  const [_item, setResult] = useState();
  const userState = getStaffLogin();

  const [fetchData, { data: result, }] = useLazyQuery(LIST_ITEM_DELIVERY, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          shipper: userState?._id,
          trackingId: searchValue ? searchValue : undefined,
          dateBetween: [startDateValue, endDateValue],
        },
      },
    })
  }, [searchValue, startDateValue, endDateValue, reloadData]);

  useEffect(() => {
    setResult(result?.itemDeliveryLogs?.data);
  }, [result])

  const total = result?.itemDeliveryLogs?.total;
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

            <p className="title mt-1">ຈຳນວນ {total || 0} ລາຍການ</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="section">
          <div className="transactions ">
            {_item?.map((item) => (
              <a href="#" className="item">
                <div className="detail">
                  <div className="align-top"
                  >
                    <i className="fa-solid fa-cart-arrow-down fa-2x mr-1"
                      onClick={() => history.push(`${DETAIL_ITEMS_COMPLETED}/${item?._id} `)}
                    />
                  </div>
                  <div className="text-nowrap">

                    <strong>TK: {item?.item?.trackingId}</strong>
                    <p>ຊື່ເຄື່ອງ: {item?.item?.itemName}</p>
                    <p>
                      <a className="text-link" target="_blank"
                        href={`https://wa.me/${detectPhoneNumber(item?.item?.receiverPhone
                        )}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
                        <img style={{ width: 20 }} src={whatsapp} alt="" />{item?.item?.receiverPhone}
                      </a>
                    </p>
                    <p>ວັນທີ່: {formatDateDash(item?.createdDate)}</p>
                    <small className="text-danger">
                      {StatusDelivery(item?.status)}
                    </small>
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
