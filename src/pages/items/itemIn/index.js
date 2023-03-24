/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import {
  detectPhoneNumber,
  formatDateDash,
  getStaffLogin,
  ShipperStatus,
  toDayDash,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import image from "../../../img/Nodata.png";
import { useLazyQuery } from "@apollo/client";
import { QUERY_LIST_ITEM } from "../apollo";

export default function ItemIn() {
  const [reloadData, setReloadData] = useState(false);
  const [_item, setResult] = useState();
  const [searchValue, setValue] = useState();
  const userState = getStaffLogin();
  const [startDateValue, setStartDateValue] = useState(toDayDash());
  const [endDateValue, setEndDateValue] = useState(new Date());

  const [fetchData, { data: result }] = useLazyQuery(QUERY_LIST_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          status: "RECEIVED",
          customer: searchValue ? parseInt(searchValue) : undefined,
          shipper: userState?._id,
          receivedDateBetween: [startDateValue, endDateValue],
        },
        orderBy: "DESC",
        limit: 0,
      },
    });
  }, [searchValue, startDateValue, endDateValue, reloadData]);

  useEffect(() => {
    if (result) {
      setResult(result?.pickupOfItems?.data);
    }
  }, [result]);

  const total = result?.pickupOfItems?.total;
  const message = "ສະບາຍດີ";

  return (
    <>
      <div className=" body-content-lg" style={{ marginTop: 60 }}>
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
              <button type="button" className="btn btn-dark">
                <i className="icon-search1" />
              </button>
              <input
                type="search"
                className="form-control form-control-sm"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                placeholder="ID..."
              />
            </div>
            <p className="title mt-1">ຈຳນວນ {total || 0} ລາຍການ</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="section">
          <div className="transactions ">
            {_item &&
              _item?.map((item) => (
                <a href="#" className="item">
                  <div className="detail">
                    <div className="align-top">
                      <i className="fa-solid fa-cart-arrow-down fa-2x mr-1" />
                    </div>
                    <div>
                      <strong>ID: {item?.customer?.id_list}</strong>
                      <p>ຊື່: {item?.customer?.full_name}</p>
                      <p>
                        <a
                          className="text-link"
                          target="_blank"
                          href={`https://wa.me/${detectPhoneNumber(
                            item?.customer?.contact_info
                          )}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}
                        >
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
                // 	) : null}
                // </>
              ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
