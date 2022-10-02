import React, { useEffect, useState, useContext } from "react";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
import History from "./History";
import { HOME_PAGE } from "../../routes/app";
import "./utils/index.css"
import CompleteConfirm from "./CompleteConfirm";
export default function TabMenuBarHistory() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);

  //useState
  const [tabActive, setTabActive] = useState("confirm");
  useEffect(() => {
    const tab = params.get("tab");
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
          <button className="btn text-white" onClick={() => history.push(HOME_PAGE)}>
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        ຈັດການຂໍ້ມູນອື່ນໆ
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        >
        </div>
      </div>
      <div className="extraHeader pr-0 pl-0 nav-tabs-custom ">
        <Button
          className={`item-tab btn-block mb-1 ${tabActive === "confirm" ? "active" : ""}`}
          variant=""
          onClick={() => history.push({ search: "?tab=confirm" })}
        >
          <i class="fa-solid fa-check me-1" />
          ຫ້ອງເອ
        </Button>
        <Button
          className={`item-tab btn-block mb-2 ${tabActive === "complete_confirm" ? "active" : ""}`}
          variant=""
          onClick={() => history.push({ search: "?tab=complete_confirm" })}
        >
          <i class="icon-check-circle me-1" />
          ຫ້ອງພັດລົມ
        </Button>
        <Button
          className={`item-tab btn-block mb-2 ${tabActive === "complete_confirm" ? "active" : ""}`}
          variant=""
          onClick={() => history.push({ search: "?tab=complete_confirm" })}
        >
          <i class="icon-check-circle me-1" />
          ໂຮມແຮມ
        </Button>
      </div>
      <div id="appCapsule" className="extra-header-active">
        {tabActive === "confirm" && <History />}
        {tabActive === "complete_confirm" && <CompleteConfirm />}
      </div>

    </>
  );
}
