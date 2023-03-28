/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import image from "../../../img/Nodata.png"
import {
  detectPhoneNumber,
  formatDateDash,
  getStaffLogin,
  ItemStatus,
  ShipperStatus,
  startMonth,
  StatusDelivery,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import { LIST_ITEM_DELIVERY, QUERY_LIST_ITEM } from "../apollo";
import { DETAIL_DATA_LIST } from "../../../routes/app";
import whatsapp from "../../../icon/whatsapp.svg";


export default function ItemCancel() {
  const { history, location, match } = useReactRouter();
  const userState = getStaffLogin();
  const [reloadData, setReloadData] = useState(false);
  const [startDateValue, setStartDateValue] = useState(startMonth());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchValue, setValue] = useState()
  const [_item, setResult] = useState();
  const [dataItem, setResultItem] = useState();

  const [fetchData, { data: result, }] = useLazyQuery(QUERY_LIST_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  const [fetchDeliVery, { data: resultDelivery, }] = useLazyQuery(LIST_ITEM_DELIVERY, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          customer: searchValue ? parseInt(searchValue) : undefined,
          shipper: userState?._id,
          canceledDateBetween: [startDateValue, endDateValue],
          status: "CANCELED"
        },
        orderBy: "DESC",
        limit: 0,
      },
    });

    fetchDeliVery({
      variables: {
        where: {
          shipper: userState?._id,
          dateBetween: [startDateValue, endDateValue],
        },
        orderBy: "DESC",
        limit: 0,
      },
    });
  }, [ startDateValue, endDateValue, reloadData]);

  useEffect(() => {
    const _results = resultDelivery?.itemDeliveryLogs?.data;
    if (searchValue) {
      const filter = _results?.filter((obj) => {
        if (obj?.item?.trackingId?.includes(searchValue)) {
          return obj;
        }
      });
      setResultItem(filter);
    } else {
      setResultItem(_results);
    }
  }, [result, searchValue]);

  useEffect(() => {
    setResult(result?.pickupOfItems?.data);
  }, [result]);

  const total = result?.pickupOfItems?.total || 0;
  const totalItem = resultDelivery?.itemDeliveryLogs?.total || 0;
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
            <p className="title mt-1">ຈຳນວນ {total + totalItem} ລາຍການ</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="section">
          <div className="transactions ">
            {_item && _item?.map((item) => (
              <a href="#" className="item">
                <div className="detail">
                  <div className="align-top">
                    <i className="fa-solid fa-cart-arrow-down fa-2x mr-1" />
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
                    <p>ວັນທີ່: {formatDateDash(item?.canceledDate || " ")}</p>
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

            {dataItem?.map((item) => (
              <a href="#" className="item">
                <div className="detail">
                  <div className="align-top"
                  >
                    <i className="fa-solid fa-cart-arrow-down fa-2x mr-1"
                      onClick={() => history.push(`${DETAIL_DATA_LIST}/${item?.item?._id} `)}
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
