import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Button } from "react-bootstrap";
import { getLocalHouse } from "../../../helper";
import { HOME_PAGE } from "../../../routes/app";
import ItemRanges from "./ItemRange";
import ItemMiddles from "./ItemMiddle";
import ItemDistances from "./ItemDistance";
import DataListItem from ".";

export default function TabMenuList() {
  const { history, location } = useReactRouter();
  const params = new URLSearchParams(location?.search);
  const [tabActive, setTabActive] = useState("itemAll");
  const [houseId, setLocalHouse] = useState("");
  const [clickButton, setButton] = useState(false);


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
        {clickButton === true ? (
          <>
            <div className="row">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm" />
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className="form-control form-control-sm" />
              </div>
            </div>
          </>
        ) : (
          <b className="text-white">ອໍເດີສົ່ງສຳເລັດທັງໝົດ</b>
        )}

        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        >
          <button
            className="btn text-white"
            onClick={(e) => {
              setButton(!clickButton);
            }}
          >
            <i className="fa-solid fa-magnifying-glass fa-2 ms-2" />
          </button>
        </div>
      </div>
      <div className="extraHeaders">
        <div className="extraHeader pr-0 pl-0 nav-tabs-item">
          <Button
            className={`item-tab text-nowrap ${tabActive === "itemAll" ? "clickActive" : "actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=itemAll" })}
          >
            ທັງໝົດ
          </Button>
          <Button
            className={`item-tab text-nowrap ${tabActive === "itemRange" ? "clickActive" : "Actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=itemRange" })}
          >
            ສົ່ງໄລຍະໃກ້
          </Button>
          <Button
            className={`item-tab text-nowrap ${tabActive === "ItemMiddles" ? "clickActive" : "Actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=ItemMiddles" })}
          >
            ສົ່ງໄລຍະທົ່ວໄປ
          </Button>
          <Button
            className={`item-tab text-nowrap ${tabActive === "ItemDistances" ? "clickActive" : "Actives"
              }`}
            variant=""
            onClick={() => history.push({ search: "?item=ItemDistances" })}
          >
            ສົ່ງໄລຍະໄກ
          </Button>

        </div>
      </div>
      <div id="appCapsule" className="extra-header-activeClick">
        {tabActive === "itemRange" && <ItemRanges />}
        {tabActive === "itemAll" && <DataListItem />}
        {tabActive === "ItemMiddles" && <ItemMiddles />}
        {tabActive === "ItemDistances" && <ItemDistances />}
      </div>
    </>
  );
}
