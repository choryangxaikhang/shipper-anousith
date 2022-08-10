import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { HISTORY, PROFILES } from "../routes/app";
import "./bottomNav.css";

export default function BottomNav() {
  return (
    <div
      className="appBottomMenu pb-2"
      style={{
        height: 60,
        paddingTop: 10,
        backgroundColor:'#ffff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
      }}
    >
      <NavLink
        className="item"
        to={`${HISTORY}/confirm`}
        style={{borderTopLeftRadius: 25,marginLeft:-10 }}
      >
        <div className="col pt-1"  style={{borderTopLeftRadius: 20 }}>
        <i className="icon-sort text-secondary" style={{ fontSize: 25 }}/>
          <strong className="text-secondary" style={{ fontSize: 15 }}>
          ການເຄື່ອນໄຫວ
          </strong>
        </div>
      </NavLink>
      <NavLink className="item" to="/home">
        <div className="col pt-1">
          <i className="icon-home" style={{ fontSize: 25 }} />
          <strong className="text-secondary" style={{ fontSize: 15 }}>
            ໜ້າຫຼັກ
          </strong>
        </div>
      </NavLink>
      <NavLink
        className="item"
        to={`${PROFILES}`}
        style={{borderTopRightRadius: 25,marginRight:-10, borderTop:'none!important' }}
      >
        <div className="col pt-1" style={{borderTopRightRadius: 20,borderTop:'none' }}>
          <i className="icon-user text-secondary" style={{ fontSize: 25 }} />
          <strong className="text-secondary" style={{ fontSize: 15 }}>
            ໂປຣໄຟລ໌
          </strong>
        </div>
      </NavLink>
    </div>
  );
}
