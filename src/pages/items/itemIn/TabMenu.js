import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button } from "react-bootstrap";
import { getLocalHouse } from "../../../helper";
import { HOME_PAGE } from "../../../routes/app";
import ItemIn from ".";
import ItemMiddles from "./ItemMiddle";

export default function TabMenuItems() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  const [tabActive, setTabActive] = useState("itemReceived");
  const [houseId, setLocalHouse] = useState("");

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);

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
					<b className="text-white">ອໍເດີຮັບເຂົ້າ</b>

        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="extraHeaders">
        <div className="extraHeader pr-0 pl-0 nav-tabs-item">
          <Button
            className={`item-tab text-nowrap ${
              tabActive === "itemReceived" ? "clickActive" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?item=itemReceived" })}
          >
            ອໍເດີຮັບໄດ້
          </Button>        
          <Button
            className={`item-tab text-nowrap ${
              tabActive === "ItemCancel" ? "clickActive" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?item=ItemCancel" })}
          >
            ອໍເດີຫຼົ້ມແຫຼວ
          </Button>       
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "itemReceived" && <ItemIn />}   
        {tabActive === "ItemCancel" && <ItemMiddles />}
      </div>
    </>
  );
}
