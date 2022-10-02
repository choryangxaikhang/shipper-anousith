import Notiflix, { Loading } from "notiflix";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import "./navbar.css";
import Sidebar from "./Sidebar";
import ModalDate from "../helper/components/ModalDate";
import {loadingScreen, TOKEN } from "../helper";
import useReactRouter from "use-react-router";
import { LOGIN } from "../routes/app";
export default function Navbar() {
  const { history, location } = useReactRouter();
  const { userState, titleState } = useContext(AppContext);
  const [showSidebar, setShowSidebar] = useState(false);

  const onLogout = () => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        loadingScreen()
        setTimeout(() => {
          Loading.remove();
          localStorage.clear();
          window.location.replace(LOGIN);
          localStorage.removeItem(TOKEN);
        }, 1000);
      },
      () => {
        return false;
      }
    );
  };

  return (
    <React.Fragment>
      <div className="appHeader text-light border-0 d-flex nav-container">
        <div style={{ flex: 1 }} className="text-right">
          {titleState === "ໜ້າຫຼັກ" ? (
            <button
              className="btn text-white"
              style={{ flex: 1 }}
            >
            <i className="fas fa-qrcode"/>
            </button>
          ) : titleState === "ໂປຣໄຟລ໌" ? (
            <button
              className="btn text-white ml-0"
              onClick={() => onLogout()}
              style={{ flex: 1, marginRight: -10 }}
            >
              <i className="icon-log-out1" style={{ fontSize: 25 }} />
            </button>
          ) : (
            <React.Fragment>
              {titleState === "ຈັດການພັດສະດຸ" ||
              titleState === "ສະຫຼຸບບິນ" ||
              titleState === "ເບິ່ງບິນຝາກເຄື່ອງ" ? (
                <ModalDate />
              ) : null}
            </React.Fragment>
          )}
        </div>
      </div>

      {/* sidebar */}
      <Sidebar
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        onLogout={onLogout}
        history={history}
        location={location}
      />
    </React.Fragment>
  );
}
