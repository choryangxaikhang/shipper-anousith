/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
  detectPhoneNumber,
  formatDateDash,
  ItemStatus,
  startMonth,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";
import { useLazyQuery } from "@apollo/client";
import { QUERY_LIST_ITEM } from "../apollo";
import { DETAIL_ITEMS_COMPLETED } from "../../../routes/app";

export default function ItemCompleted() {
  const { history, location, match } = useReactRouter();
  const [reloadData, setReloadData] = useState(false);
  const [startDateValue, setStartDateValue] = useState(startMonth());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchValue, setValue] = useState()
  const [_item, setResult] = useState();

  const [fetchData, { data: result, }] = useLazyQuery(QUERY_LIST_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          trackingId: searchValue ? searchValue : undefined,
          deliveryCompletedDateBetween: [startDateValue, endDateValue],
          itemStatus: "COMPLETED"
        },
      },
    })
  }, [searchValue, startDateValue, endDateValue, reloadData]);

  useEffect(() => {
    setResult(result?.items?.data);
  }, [result])

  const total = result?.items?.total;
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
            {_item && _item?.map((item) => (
              <a href="#" className="item">
                <div className="detail">
                  <div className="align-top"
                  >
                    <i className="fa-solid fa-cart-arrow-down fa-2x mr-1"
                      onClick={() => history.push(`${DETAIL_ITEMS_COMPLETED}/${item?._id} `)}
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
