/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { Button, Col } from "react-bootstrap";
// import "./utils/index.css";
import * as ROUTES from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";

export default function TabMenuOther() {
  const { history } = useReactRouter();
  return (
    <>
        <div className="appHeader text-light border-0 mr-0">
          <div style={{ flex: 1 }} className="text-left">
            <button
              className="btn text-white"
              onClick={() => history.push(ROUTES.HOME_PAGE)}
            >
              <i className="fa fa-chevron-left fs-4" />
            </button>
          </div>
          ຈັດການຂໍ້ມູນອື່ນໆ
          <div
            className="text-white pageTitle text-right text-nowrap pr-0"
            style={{ flex: 1 }}
          ></div>
        </div>
        <div id="appCapsule" style={{marginTop:-10}}>
          <div className="section wallet-card-section">
            <div className="session-list mt-1" ng-controller="home">
              <div className="wallet-card">
                <div className="wallet-footer">
                  <div className="item">
                    <a
                      href="javascript:void(0)"
                      onClick={() => history.push(`${ROUTES.HOTEL}`)}
                    >
                      <div className="icon-wrapper">
                      <i className="fa-solid fa-house fa-2x"/>
                      </div>
                      <h5>ໂຮມແຮມ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a >
                      <div className="icon-wrapper">
                      House
                      </div>
                      <h5>ບ້ານພັກ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a>
                      <div className="icon-wrapper">
                      House
                      </div>
                      <h5>ຫ້ອງຈອງ</h5>
                    </a>
                  </div>
                </div>
                <div className="wallet-footer">
                  <div className="item">
                    <a >
                      <div className="icon-wrapper">
                      House
                      </div>
                      <h5>ແຂກອອກ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a >
                      <div className="icon-wrapper">
                      House
                      </div>
                      <h5>ລາຍງານ</h5>
                    </a>
                  </div>
                  <div className="item">
                    <a>
                      <div className="icon-wrapper">
                      House
                      </div>
                      <h5>ລາຍງານ</h5>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
    </>
  );
}
