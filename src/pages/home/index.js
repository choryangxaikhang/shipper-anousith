import React, { useState } from "react";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import {
  loadingData,
} from "../../helper";
import {
  COMMITION_SHIPER,
  SHIPPER_CONFIRM,
  TAB_MENU_COMPLETED,
  TAB_MENU_DELIVERING,
  TAB_MENU_ITEM_IN
} from "../../routes/app";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import { LIST_SHIPPER_CONFIRMED } from "./apollo";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
export default function Home() {
  const { history } = useReactRouter();
  const [house, setHouse] = useState("");
  const [userData, setUserData] = useState({});
  const [clickButton, setButton] = useState(false);
  const [reloadData, setReLoadData] = useState(false);

  const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_CONFIRMED, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          itemStatus: "REQUESTING"
        },
      },
    });  
  }, [result, reloadData]);
  const total = result?.items?.total;

  return (
    <>
      <div>
        <div className="appHeader  border-0 ">
          <div style={{ flex: 1 }} className="text-left">
            <button
              className="btn text-white"
              onClick={(e) => {
                setButton(!clickButton);
              }}
            >
              <i className="fa-solid fa-magnifying-glass fa-2 ms-2" />
            </button>
          </div>
          {clickButton === true ? (
            <>
              <SelectLocalHouse
                style={{ width: "100%" }}
                value={house?._id}
                onChange={(obj) => {
                  if (obj?._id) {
                    setHouse(obj);
                    localStorage.setItem("HOUSE", JSON.stringify(obj));
                    window.location.reload();
                  }
                }}
                ownerId={userData?._id}
              />
            </>
          ) : (
            <b className="text-white">
              {house?.houseName ? house?.houseName : "ໜ້າຫຼັກ"}
            </b>
          )}

          <div
            className="text-white pageTitle text-center text-nowrap pr-0"
            style={{ flex: 1 }}
          >
            <a
              className="mr-3 float-right"
              onClick={() => history.push(`${SHIPPER_CONFIRM}/1`)}

            >
              <i className="icon-bell" style={{ fontSize: 20 }} />
              <span style={{ position: "absolute", right: 10, top: 10 }}>
                {loadingData(10)}
              </span>
              <span className="badge badge-success mr-1 p-2">
                <small>
                  {total || 0}
                </small>
              </span>
            </a>
          </div>
        </div>
        <div className="body-content body-content-lg "
          style={{
            paddingTop: "0px"
          }}
        >
          <div
            className="wallet-card"
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
                  onClick={() => history.push(`${TAB_MENU_DELIVERING}/1`)}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-truck fa-2x" />
                  </div>
                  <h5>ກຳລັງຈັດສົ່ງ</h5>
                </a>
              </div>
              <div className="item">
                <a
                  onClick={(e) => history.push(`${TAB_MENU_COMPLETED}/1`)}
                >
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
                  onClick={() => history.push(`${COMMITION_SHIPER}/1`)}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-money-bill-wave fa-2x" />
                  </div>
                  <h5>ສ່ວນແບ່ງ</h5>
                </a>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
