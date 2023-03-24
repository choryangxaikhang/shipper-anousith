/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
  currency,
  detectPhoneNumber,
  formatDateDash,
  getStaffLogin,
  ItemStatus,
  toDayDash,
} from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";
import { useLazyQuery } from "@apollo/client";
import { DETAIL_ITEMS_COMPLETED } from "../../../routes/app";
import { LIST_SHIPPER_ITEM } from "../../home/apollo";
import _ from "lodash";
import SumCommission from "./SumCommission";

export default function ItemCompleted() {
  const { history, location, match } = useReactRouter();
  const [reloadData, setReloadData] = useState(false);
  const [startDateValue, setStartDateValue] = useState(toDayDash());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [searchValue, setValue] = useState();
  const [_item, setResult] = useState();
  const userState = getStaffLogin();

  const [fetchData, { data: result }] = useLazyQuery(LIST_SHIPPER_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          shipper: userState?._id,
          trackingId: searchValue ? searchValue : undefined,
          deliveryCompletedDateBetween: [startDateValue, endDateValue],
          itemStatus: "COMPLETED",
        },
        orderBy: "DESC",
        limit: 0,
      },
    });
  }, [searchValue, startDateValue, endDateValue, reloadData]);

  useEffect(() => {
    setResult(result?.items?.data);
  }, [result]);

  const total = result?.items?.total;
  const message = "ສະບາຍດີ";

  const _itemValueKIP = _.sumBy(_item, "itemValueKIP");
  const _itemValueTHB = _.sumBy(_item, "itemValueTHB");
  const _itemValueUSD = _.sumBy(_item, "itemValueUSD");
  const _deliveryPrice = _.sumBy(_item, "realDeliveryPrice");

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
                placeholder="tracking"
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
                      <i
                        className="fa-solid fa-cart-arrow-down fa-2x mr-1"
                        onClick={() =>
                          history.push(
                            `${DETAIL_ITEMS_COMPLETED}/${item?._id} `
                          )
                        }
                      />
                    </div>
                    <div className="text-nowrap">
                      <strong>TK: {item?.trackingId}</strong>
                      <strong>
                        ຈາກ ID: {item?.customer?.id_list}
                        {" /"}
                        {item?.customer?.full_name}
                      </strong>
                      <strong>ຜູ້ຮັບ: {item?.receiverName}</strong>
                      <p>
                        <a
                          className="text-link"
                          target="_blank"
                          href={`https://wa.me/${detectPhoneNumber(
                            item?.receiverPhone
                          )}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}
                        >
                          <img style={{ width: 20 }} src={whatsapp} alt="" />
                          {item?.receiverPhone}
                        </a>
                      </p>
                      <p>
                        ວັນທີ່: {formatDateDash(item?.deliveryCompletedDate)}
                      </p>
                      <p>
                        {item?.itemStatus === "COMPLETED" ? (
                          <small className="text-success">
                            {ItemStatus(item?.itemStatus)}
                          </small>
                        ) : (
                          <small className="text-danger">
                            {ItemStatus(item?.itemStatus)}
                          </small>
                        )}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
          </div>
          <h3 className="mt-2">ລາຍງານລວມ</h3>
          <div>ເງິນເກັບໄດ້ຈິງ: {currency(_itemValueKIP || 0)} ​ KIP</div>
          <div>ເງິນເກັບໄດ້ຈິງ: {currency(_itemValueTHB || 0)} THB</div>
          <div>ເງິນເກັບໄດ້ຈິງ: {currency(_itemValueUSD || 0)} USD</div>
          <div>ຄ່າບໍລິການ: {currency(_deliveryPrice || 0)}</div>
          <hr className="m-1" />
          <SumCommission startDate={startDateValue} endDate={endDateValue} />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
