import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
import { OTHER } from "../../routes/app";
import TypeRoom from "./type_room";
import Rooms from "./rooms";
import "./util/index.css";
import { getLocalHouse } from "../../helper";
export default function TabMenu() {
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
        {tabActive === "Type" ? (
          <>ຈັດການເພີ່ມປະເພດຫ້ອງ</>
        ) : (
          <>{houseId?.houseName ? houseId?.houseName : "ຂໍ້ມູນຫ້ອງ"}</>
        )}
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="extraHeaderB">
        <div className="extraHeader pr-0 pl-0 nav-tabs-custom">
          <Button
            className={`item-tab btn-block btn-lg  ${
              tabActive === "Type" ? "activeClick" : ""
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=Type" })}
          >
            ຂໍ້ມູນປະເພດຫ້ອງ
          </Button>
          <Button
            className={`item-tab btn-block btn-lg mb-1  ${
              tabActive === "room" ? "activeClick" : ""
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=room" })}
          >
            ຂໍ້ມູນຫ້ອງ
          </Button>
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "Type" && <TypeRoom />}
        {tabActive === "room" && <Rooms />}
      </div>
    </>
  );
}
