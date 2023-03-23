import React, { useState } from "react";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import Imglogo from "../../img/logo.png";
import { getStaffLogin, loadingData } from "../../helper";
import {
  COMMISSION_SHIPER,
  ITEM_DELIVERING,
  SHIPPER_CONFIRM,
  TAB_MENU_COMPLETED,
  TAB_MENU_ITEM_IN,
} from "../../routes/app";
import {
  LIST_SHIPPER_CONFIRMED,
  LIST_SHIPPER_ITEM,
  QUERY_PAYROLL_SUMMARY,
} from "./apollo";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
export default function Home() {
  const { history } = useReactRouter();
  const [reloadData, setReLoadData] = useState(false);
  const userInfo = getStaffLogin();

  const [fetchPayroll, { data: resultPayroll }] = useLazyQuery(
    QUERY_PAYROLL_SUMMARY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [fetchData, { data: result }] = useLazyQuery(LIST_SHIPPER_CONFIRMED, {
    fetchPolicy: "cache-and-network",
  });
  const [fetchItem, { data: DataItem }] = useLazyQuery(LIST_SHIPPER_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          shipper: userInfo?._id,
          status: "DEPARTURE",
        },
      },
    });

    fetchItem({
      variables: {
        where: {
          shipper: userInfo?._id,
          itemStatus: "ASSIGNED_SHIPPER",
        },
      },
    });

    fetchPayroll({
      variables: {
        where: {
          empID: parseInt(userInfo?._id),
          confirmStatus: "UNCONFIRMED",
        },
        orderBy: "DESC",
        limit: 1,
      },
    });
  }, [result, reloadData, DataItem]);
  const totalPickup = result?.pickupOfItems?.total;
  const totalItem = DataItem?.items?.total;
  const totalPayroll = resultPayroll?.summaryPayroll?.total;

  return (
    <>
      <div>
        <div className="appHeader border-0 ">
          <div className="appHeader text-light border-0 text-right">
            <div style={{ flex: 1 }} className="text-left ml-1">
              <img src={Imglogo} alt="logo" style={{ width: 40 }} />
            </div>
            ໜ້າຫຼັກ
            <div
              className="text-white pageTitle text-right text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <a
                className="mr-3 float-right"
                onClick={() => history.push(`${SHIPPER_CONFIRM}/1`)}
              >
                {totalPickup !== 0 ? (
                  <>
                    <i className="icon-bell" style={{ fontSize: 20 }} />
                    <span className="badge badge-success mr-1 p-2">
                      <small>{totalPickup}</small>
                    </span>
                  </>
                ) : null}
              </a>
            </div>
          </div>
        </div>
        <div
          className="wallet-card mt-5"
          style={{
            borderBottom: "1px solid red",
          }}
        >
          <div className="wallet-footer">
            <div className="item">
              <a
                href="javascript:void(0)"
                onClick={() => history.push(`${TAB_MENU_ITEM_IN}/1`)}
              >
                <div className="icon-wrapper">
                  <i className="fa-solid fa-circle-down fa-2x" />
                </div>
                <h5>ອໍເດີຮັບແລ້ວ</h5>
              </a>
            </div>
            <div className="item">
              <a
                href="javascript:void(0)"
                onClick={() => history.push(`${ITEM_DELIVERING}/1`)}
              >
                <div className="icon-wrapper">
                  {totalItem !== 0 ? (
                    <span
                      className="badge badge-success ms-2"
                      style={{
                        position: "absolute",
                        marginTop: -60,
                        marginRight: -50,
                        padding: 0,
                        zIndex: 1000,
                      }}
                    >
                      <small className="p-1">{totalItem || 0}</small>
                    </span>
                  ) : null}
                  <i className="fa-solid fa-truck fa-2x" />
                </div>
                <h5>ກຳລັງຈັດສົ່ງ</h5>
              </a>
            </div>
            <div className="item">
              <a onClick={(e) => history.push(`${TAB_MENU_COMPLETED}/1`)}>
                <div className="icon-wrapper">
                  <i className="fas fa-circle-check fa-2x" />
                </div>
                <h5>ສົ່ງສຳເລັດ</h5>
              </a>
            </div>
          </div>
          <div className="wallet-footer">
            <div className="item">
              <a
                href="javascript:void(0)"
                onClick={() => history.push(`${COMMISSION_SHIPER}/1`)}
              >
                <div className="icon-wrapper">
                  {totalPayroll !== 0 ? (
                    <span
                      className="badge badge-success ms-2"
                      style={{
                        position: "absolute",
                        marginTop: -60,
                        marginRight: -50,
                        padding: 0,
                        zIndex: 1000,
                      }}
                    >
                      <small className="p-1">{totalPayroll || 0}</small>
                    </span>
                  ) : null}
                  <i className="fa-solid fa-money-bill-wave fa-2x" />
                </div>
                <h5>ສ່ວນແບ່ງ</h5>
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-3">
          <div
            className="rounded facebook-page mt-2"
            style={{ borderRadius: 5, zIndex: 0 }}
          >
            <div
              className="fb-page mt-3"
              data-href="https://www.facebook.com/AnousithExpress"
              data-tabs="timeline"
              data-width=""
              data-height=""
              data-small-header="true"
              data-adapt-container-width="true"
              data-hide-cover="true"
              data-show-facepile="true"
            >
              <blockquote
                cite="https://www.facebook.com/AnousithExpress"
                class="fb-xfbml-parse-ignore"
              >
                <a
                  href="https://www.facebook.com/AnousithExpress"
                  target="_blank"
                  className="p-2"
                >
                  ANS EXPRESS ອານຸສິດ ຂົນສົ່ງດ່ວນ{" "}
                  <i className="icon-arrow-right my-1 float-right" />
                </a>
                <br />
                <center className="mt-3 mb-3">
                  <a
                    href="javascript:void(0)"
                    onClick={() => window.location.reload()}
                    className="mt-5"
                  >
                    <i className="icon-refresh fs-1" />
                    <br />
                    ...
                  </a>
                </center>
              </blockquote>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
