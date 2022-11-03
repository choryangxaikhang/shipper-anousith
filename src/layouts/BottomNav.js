import React from "react";
import { NavLink } from "react-router-dom";
import { getStaffLogin } from "../helper";
import { TAB_MENU_LIST, PROFILES } from "../routes/app";

export default function BottomNav() {
  const userState = getStaffLogin();
  const userInfo = userState?.data;

  return (
    <div
      className="appBottomMenu pb-2"
      style={{
        height: 60,
        paddingTop: 10,
        backgroundColor: "#ffff",
      }}
    >
      {/* {userInfo?.role == "BRANCH_DIRECTOR" ||
      userInfo?.role === "IT" ||
      userInfo?.role === "SUPER_ADMIN" ||
      userInfo?.role === "ADMIN" ||
      userInfo?.role === "FINANCE" ||
      userInfo?.role === "ACCOUNTANT" ? ( 
        <>*/}
          <NavLink
            className="item"
            to={`${TAB_MENU_LIST}/1`}
            style={{ borderTopLeftRadius: 25, marginLeft: -10 }}
          >
            <div className="col pt-1" style={{ borderTopLeftRadius: 20 }}>
              <i
                className="icon-sort text-secondary"
                style={{ fontSize: 25}}
                
              />
              <strong className="text-secondary"
               style={{ 
                fontSize: 15,           
              }}
               >
                ລາຍງານ
              </strong>
            </div>
          </NavLink>
        {/* </>
      ) : null} */}
      <NavLink className="item" to="/home">
        <div className="col pt-1">
          <i className="icon-home text-secondary" style={{ fontSize: 25 }} />
          <strong className="text-w" style={{ fontSize: 15 }}>
            ໜ້າຫຼັກ
          </strong>
        </div>
      </NavLink>
      <NavLink
        className="item"
        to={`${PROFILES}`}
        style={{
          borderTopRightRadius: 25,
          marginRight: -10,
          borderTop: "none!important",
        }}
      >
        <div
          className="col pt-1"
          style={{ borderTopRightRadius: 20, borderTop: "none" }}
        >
          <i className="icon-user text-secondary" style={{ fontSize: 25 }} />
          <strong className="text-secondary" style={{ fontSize: 15 }}>
            ໂປຣໄຟລ໌
          </strong>
        </div>
      </NavLink>
    </div>
  );
}
