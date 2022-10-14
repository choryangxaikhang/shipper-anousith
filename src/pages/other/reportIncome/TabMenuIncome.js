import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
import { OTHER } from "../../../routes/app";
import { getLocalHouse, getStaffLogin } from "../../../helper";
import "./util/index.css";
import ReportBooking from "./reportBooking";
import ReportCheckIn from "./reportCheckIn";
import ReportCheckOut from "./reportCheckOut";
import DividendReport from "./dividend_report";
import SumTotalBooking from "./sumTotalBooking";
export default function TabMenuIncome() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  const userState = getStaffLogin();
  const userData = userState?.data;
  //useState
  const [tabActive, setTabActive] = useState("reportBooking");
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
              tabActive === "reportBooking" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=reportBooking" })}
          >
            ຍອມທີ່ຈອງ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "reportAll" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=reportAll" })}
          >
            ຍອດຫ້ອງກຳລັງເປີດ
          </Button>
          <Button
            className={`item-tab ${
              tabActive === "checkout" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=checkout" })}
          >
            ຍອດຫ້ອງແຂກອອກແລ້ວ
          </Button>
          {userData?.role === "SUPER_ADMIN" || userData?.role === "IT" ? (
            <>
              <Button
                className={`item-tab ${
                  tabActive === "dividendReport" ? "clickActives" : "Actives"
                }`}
                variant=""
                onClick={() => history.push({ search: "?tab=dividendReport" })}
              >
                ຍອດປັນຜົນ
              </Button>
            </>
          ) : null}

          <Button
            className={`item-tab ${
              tabActive === "sumTotalBooking" ? "clickActives" : "Actives"
            }`}
            variant=""
            onClick={() => history.push({ search: "?tab=sumTotalBooking" })}
          >
            ຍອດສະຫລຸບລວມ
          </Button>
        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "reportBooking" && <ReportBooking />}
        {tabActive === "reportAll" && <ReportCheckIn />}
        {tabActive === "checkout" && <ReportCheckOut />}
        {tabActive === "dividendReport" && <DividendReport />}
        {tabActive === "sumTotalBooking" && <SumTotalBooking />}
      </div>
    </>
  );
}
