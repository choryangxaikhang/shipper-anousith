import React, { useContext, useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { AppContext } from "../App";
import { aws_url_image, currency, TOKEN } from "../helper";
import male from "../img/male.png";
import female from "../img/female.png";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";

import { SUM_CONSOLIDATE_LIST } from "./gql";
import Notiflix, { Loading } from "notiflix";

export default function Sidebar({ show = false, onHide, history, location }) {
  const { userState } = useContext(AppContext);
  const userData = userState?.data;

  const containerClick = (e) => {
    const hashClass = e.target.closest(".sidebar-container");
    if (!hashClass && onHide) onHide();
  };

  const handleClick = (path) => {
    if (onHide) onHide();
    history.push(path);
  };

  const [fetchItems, { data: setData, loading: loadingConsolidateList }] =
    useLazyQuery(SUM_CONSOLIDATE_LIST, {
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    fetchItems({
      variables: {
        where: {
          Customer_Id: parseInt(userData?.id_list),
          isBalanceTransfer: 0,
          isCustomerConfirmed: 1,
        },
      },
    });
  }, []);
  const sumMoney = {
    IncomingBalanceInKip: _.sumBy(
      setData?.consolidateLists?.data,
      "IncomingBalanceInKip"
    ),
    IncomingBalanceInBaht: _.sumBy(
      setData?.consolidateLists?.data,
      "IncomingBalanceInBaht"
    ),
    IncomingBalanceInDollar: _.sumBy(
      setData?.consolidateLists?.data,
      "IncomingBalanceInDollar"
    ),
    AmountOfItem: _.sumBy(setData?.consolidateLists?.data, "AmountOfItem"),
  };

  return (
    <div
      id="sidebar-menu"
      className={`sidebar-menu ${show ? "slide-show-sidebar" : null}`}
      onClick={containerClick}
    >
      <div className="sidebar-container p-0">
        <div className="profileBox pt-2 pb-2">
          <div className="image-wrapper">
            <img
              src={
                userData?.image
                  ? aws_url_image + userData?.profile_img
                  : userData?.gender === "MALE"
                  ? male
                  : female
              }
              alt="image"
              className="imaged  w36"
            />
          </div>
          <div className="in">
            <strong>{userData?.fullName}</strong>
            <div className="text-muted">ID:{userData?.id_list}</div>
          </div>
          <div
            className="btn  btn-icon sidebar-close"
            data-dismiss="modal"
          >
            <ion-icon name="close-outline" />
          </div>
        </div>
        <div className="sidebar-balance">
          <div className="listview-title">ຍອດ COD ທີ່ຈະໄດ້ຮັບ</div>
          <div className="in">
            <span className="text-white">
              ຈຳນວນ {currency(sumMoney?.AmountOfItem)} ອໍເດີ່
            </span>
            <h3 className="amount">
              ມູນຄ່າ {currency(sumMoney?.IncomingBalanceInKip)} LAK
            </h3>
            <h3 className="amount">
              ມູນຄ່າ {currency(sumMoney?.IncomingBalanceInBaht)} THB
            </h3>
            <h3 className="amount">
              ມູນຄ່າ {currency(sumMoney?.IncomingBalanceInDollar)} USD
            </h3>
          </div>
        </div>
        <div className="listview-title mt-1">ປະຫວັດການເຄື່ອນໄຫວ</div>
        <ul className="listview flush transparent no-line image-listview">
          <li>
            <a
              href="javaScript:void(0)"
              onClick={() => history.push(`/history/list`)}
              className="item"
            >
              <div className="icon-boxs bg-primary">
                <i className="icon-restore" style={{ fontSize: 25 }} />
              </div>
              <div className="in">ປະຫວັດການຝາກພັດສະດຸ</div>
            </a>
          </li>
          <li>
            <a
              href="javaScript:void(0)"
              className="item"
              onClick={() => history.push(`/management_cod/history_Cod`)}
            >
              <div className="icon-boxs bg-primary">
                <i className="icon-local_atm" style={{ fontSize: 25 }} />
              </div>
              <div className="in">ປະຫວັດການຢືນຢັນ COD</div>
            </a>
          </li>
          <li>
            <a
              href="javaScript:void(0)"
              className="item"
              onClick={() => history.push(`/tracking_bill/0`)}
            >
              <div className="icon-boxs bg-primary">
                <i className="icon-receipt" style={{ fontSize: 25 }} />
              </div>
              <div className="in">ບິນຝາກເຄື່ອງທັງໝົດ</div>
            </a>
          </li>
          <li>
            <a
              href="javaScript:void(0)"
              className="item"
              onClick={() => history.push(`/readme`)}
            >
              <div className="icon-boxs bg-primary">
                {/* <i class="fa-solid fa-comment-dots" style={{ fontSize: 20 }}></i> */}
                <i className="fa-solid fa-book"></i>
              </div>
              <div className="in">ຄູ່ມືການໃຊ້ງານແອັບ</div>
            </a>
          </li>
          <li>
            <a
              href="javaScript:void(0)"
              className="item border-top"
              onClick={() => history.push(`/report_bug`)}
            >
              <div className="icon-boxs bg-primary">
                <i class="fa-solid fa-comment-dots" style={{ fontSize: 20 }}></i>
              </div>
              <div className="in">ຮ້ອງຮຽນບັນຫາ</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}