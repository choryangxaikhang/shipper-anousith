import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button } from "react-bootstrap";
import { getLocalHouse } from "../../../helper";
import { HOME_PAGE } from "../../../routes/app";
import ItemIn from ".";

export default function TabMenuItems() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  //useState
  const [tabActive, setTabActive] = useState("itemAll");
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
            onClick={() => history.push(HOME_PAGE)}
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
            className={`item-tab ${
              tabActive === "itemAll" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?item=itemAll" })}
          >
            ທັງໝົດ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "type_expense" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?item=type_expense" })}
          >
            ສົ່ງໄລຍະໃກ້
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "listData" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?item=listData" })}
          >
            ສົ່ງໄລຍະທົ່ວໄປ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "summary_account" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?item=summary_account" })}
          >
            ສົ່ງໄລຍະໄກ
          </Button>
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {/* {tabActive === "type_expense" && <ExpenseTypeScreen />} */}
        {tabActive === "itemAll" && <ItemIn />}   
        {/* {tabActive === "listData" && <ListAllExpenses />}
        {tabActive === "summary_account" && <SummaryAccount />} */}
      </div>
    </>
  );
}
