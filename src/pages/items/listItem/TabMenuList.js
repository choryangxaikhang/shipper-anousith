import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button } from "react-bootstrap";
import { HOME_PAGE } from "../../../routes/app";
import ItemPickupReceive from "./ItemReceive";
import ItemCancel from "./ItemCancel";
import ItemCompleted from ".";

export default function TabMenuList() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  const [tabActive, setTabActive] = useState("completed");

  useEffect(() => {
    const tab = params.get("item");
    if (tab) {
      setTabActive(tab);
    }
  }, [params]);

  useEffect(() => {
    const elmTab = document.querySelectorAll(".nav-tabs-custom")[0];
    const elmItemTab = document.querySelectorAll("button.active")[0];
    if (elmTab && elmItemTab) {
      const left = elmItemTab.offsetLeft - 10;
      elmTab.scrollLeft = left;
    }
  }, [tabActive]);

  return (
    <>
      <div className="appHeader text-light border-0 mr-0">
        <div style={{ flex: 1 }} className="text-left">
          <button
            className="btn text-white"
            onClick={() => history.push(HOME_PAGE)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>   
          <b className="text-white">ລາຍງານອໍເດີທັງໝົດ</b>
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        >      
        </div>
      </div>
      <div className="extraHeaders">
        <div className="extraHeader pr-0 pl-0 nav-tabs-item">
          <Button
            className={`item-tab text-nowrap ${tabActive === "completed" ? "clickActive" : "actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=completed" })}
          >
            ອໍເດີສົ່ງສຳເລັດ
          </Button>
          <Button
            className={`item-tab text-nowrap ${tabActive === "receive" ? "clickActive" : "Actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=receive" })}
          >
            ອໍເດີຮັບເຂົ້າ
          </Button>
          <Button
            className={`item-tab text-nowrap ${tabActive === "cancel" ? "clickActive" : "Actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=cancel" })}
          >
            ອໍເດີລົ້ມເຫຼວທັງໝົດ
          </Button>
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "receive" && <ItemPickupReceive />}
        {tabActive === "completed" && <ItemCompleted />}
        {tabActive === "cancel" && <ItemCancel />}
      </div>
    </>
  );
}
