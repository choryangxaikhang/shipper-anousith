import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
import { OTHER } from "../../../routes/app";
import { getLocalHouse } from "../../../helper";
import "./util/index.css";
export default function TabMenuIncome() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  //useState
  const [tabActive, setTabActive] = useState("Type");
  const [houseId, setLocalHouse] = useState("");

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);

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
          <button
            className="btn text-white"
            onClick={() => history.push(OTHER)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        {houseId?.houseName ? houseId?.houseName : "ລາຍງານຂໍ້ມູນ"}
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="extraHeaders">
        <div className="extraHeader pr-0 pl-0 nav-tabs-custom">
          <Button
            className={`item-tab ${tabActive === "items" ? "clickActives" : ""}`}
            variant=""
            onClick={() => history.push({ search: "?tab=items" })}
          >
            ລາຍການສ້າງໃໝ່
          </Button>
          <Button
            className={`item-tab ${tabActive === "requesting" ? "clickActives" : ""}`}
            variant=""
            onClick={() => history.push({ search: "?tab=requesting" })}
          >
            ລໍຖ້າສາຂາກົດຮັບ
          </Button>
          <Button
            className={`item-tab ${tabActive === "list" ? "clickActives" : ""}`}
            variant=""
            onClick={() => history.push({ search: "?tab=list" })}
          >
            ສາຂາໄດ້ຮັບແລ້ວ
          </Button>
          <Button
            className={`item-tab ${tabActive === "all" ? "clickActives" : ""}`}
            variant=""
            onClick={() => history.push({ search: "?tab=all" })}
          >
            ພັດສະດຸສົ່ງສຳເລັດ
          </Button>
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "Type"}
        {tabActive === "room"}
        {tabActive === "Type"}
        {tabActive === "room"}
      </div>
    </>
  );
}
