import React, { useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import Imglogo from "../../../../img/anousith.png";
import { TAB_MENU_LIST } from "../../../../routes/app";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import {
  chargeOnShop,
  formatDateTime,
  currency,
  detectPhoneNumber,
} from "../../../../helper";
import { LIST_SHIPPER_ITEM } from "../../apollo";

export default function DetailDataList() {
  const { history, match } = useReactRouter();
  const ID = parseInt(match?.params?._id);
  const [_item, setResult] = useState();
  const [fetchData, { data: result }] = useLazyQuery(LIST_SHIPPER_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          _id: ID,
        },
      },
    });
    setResult(result?.items?.data);
  }, [result]);

  const message = "ສະບາຍດີ";

  return (
    <>
      <div className="appHeader text-light border-0 mr-0">
        <div style={{ flex: 1 }} className="text-left">
          <button
            className="btn text-white"
            onClick={() => history.push(`${TAB_MENU_LIST}/1`)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        <b className="text-white">ລາຍລະອຽດ</b>
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="container-min">
        <div className="card">
          <div className="col-12">
            <div style={{ paddingBottom: "10px" }} />
            <div className="listed-detail mt-5">
              <img
                src={Imglogo}
                alt="logo"
                className="logo p-2"
                style={{
                  width: 120,
                  height: 60,
                }}
              />
            </div>
            <ul className="listview flush transparent simple-listview no-space mt-1">
              {_item &&
                _item?.map((item) => (
                  <>
                    <li>
                      <strong>ລະຫັດພັດສະດຸ</strong>
                      <span>{item?.trackingId}</span>
                    </li>
                    <li>
                      <strong>ວັນທີ່ສ້າງ</strong>
                      <span>{formatDateTime(item?.createdDate) || " "}</span>
                    </li>
                    <li>
                      <strong>ວັນທີ່ສົ່ງສຳເລັດ</strong>
                      <span>
                        {formatDateTime(item?.deliveryCompletedDate) || " "}
                      </span>
                    </li>
                    <li>
                      <strong>ສາຂາຕົ້ນທາງ</strong>
                      <span>{item?.originBranch?.title || " "}</span>
                    </li>
                    <li>
                      <strong>ສາຂາປາຍທາງ</strong>
                      <span>{item?.destBranch?.title || " "}</span>
                    </li>
                    <li>
                      <span>
                        <i className="fas fa-user" />
                        ID: {item?.customer?.id_list || " "}
                      </span>{" "}
                      |
                      <span>
                        <a
                          className="text-link"
                          target="_blank"
                          href={`https://wa.me/${detectPhoneNumber(
                            item?.customer?.contact_info
                          )}?text=${message?.replace(
                            /<br\s*[\/]?>/gi,
                            " "
                          )} trackingID:${item?.trackingId}`}
                        >
                          <i className="fas fa-phone" />{" "}
                          {item?.customer?.contact_info || " "}
                        </a>
                      </span>
                    </li>
                    <li>
                      <span>
                        <i className="fas fa-user" />
                        ຊື່ຜູ້ຮັບ: {item?.receiverName || " "}{" "}
                      </span>{" "}
                      |
                      <span>
                        <a
                          className="text-link"
                          target="_blank"
                          href={`https://wa.me/${detectPhoneNumber(
                            item?.receiverPhone
                          )}?text=${message?.replace(
                            /<br\s*[\/]?>/gi,
                            " "
                          )} trackingID:${item?.trackingId}`}
                        >
                          <i className="fas fa-phone" />{" "}
                          {item?.receiverPhone || " "}
                        </a>
                      </span>
                    </li>
                    <li>
                      <strong>ຂະໜາດ: {item?.width || " "}</strong> |
                      <strong>ນ້ຳໜັກ:{item?.weight || " "}</strong>
                    </li>
                    <li>
                      <strong>ຄ່າບໍລິການ:</strong>
                      <h3 className="m-0">
                        {currency(item?.realDeliveryPrice || 0)} ກີບ
                      </h3>{" "}
                      |<span>{chargeOnShop(item?.chargeOnShop)}</span>
                    </li>
                    <li>
                      <strong>ເງິນ COD: </strong>
                      <h3 className="m-0">
                        {currency(item?.itemValueKIP || 0)} ກີບ
                      </h3>{" "}
                      |
                      <h3 className="m-0">
                        {currency(item?.itemValueTHB || 0)} ບາດ
                      </h3>{" "}
                      |
                      <h3 className="m-0">
                        {currency(item?.itemValueUSD || 0)} ໂດລາ
                      </h3>
                    </li>
                    <li>
                      <strong>ລວມທັງໝົດ: </strong>
                      <h3>
                        {currency(
                          item?.itemValueKIP + item?.realDeliveryPrice || 0
                        )}{" "}
                        ກີບ
                      </h3>
                    </li>
                  </>
                ))}
            </ul>
          </div>
        </div>
        <h3 className="text-center mt-3">ຂອບໃຈທີ່ໃຊ້ບໍລິການ </h3>
      </div>
    </>
  );
}
