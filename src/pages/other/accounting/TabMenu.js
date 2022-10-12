import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
import { OTHER } from "../../../routes/app";
import { getLocalHouse } from "../../../helper";
import IncomeType from "./inComeType/index.";
import ExpenseTypeScreen from "./expenseType/index.";
import ListAllExpenses from ".";
export default function TabMenuAccount() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  //useState
  const [tabActive, setTabActive] = useState("type");
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
            className={`item-tab ${
              tabActive === "type" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=type" })}
          >
            ປະເພດລາຍຮັບ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "type_expense" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=type_expense" })}
          >
            ປະເພດລາຍຈ່າຍ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "listData" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=listData" })}
          >
            ລາຍຮັບ ແລະ ລາຍຈ່າຍ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "bill" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=bill" })}
          >
            ສະຫລຸບບັນຊີ
          </Button>
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "type_expense" && <ExpenseTypeScreen />}
        {tabActive === "type" && <IncomeType />}
        {tabActive === "listData" && <ListAllExpenses />}
        {tabActive === "bill" && <IncomeType />}
        {tabActive === "set_history" && <IncomeType />}
      </div>
    </>
  );
}
