import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import BlockUser from "./widget/blockUser";

import ChangeRole from "./widget/changeRole";

import ChangePasswordStaff from "./widget/changePasswordStaff";
import ChangePasswordCustomer from "./widget/changePasswordCustomer";

import TurnOffHouse from "./widget/turnOffhouse";
import InviteOwner from "./widget/inviteOwner";
import { OTHER } from "../../routes/app";
import UserList from "../user_staff";
export default function SettingsScreen() {
  const { history, location, match } = useReactRouter();
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
        ຕັ້ງຄ່າລະບົບ
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="row" style={{ marginTop: 70 }}>
        <div className="col-md-4 mt-1">
          <div className="card border ms-1">
            <div
              className="p-1 border-bottom  fs-5"
              style={{ backgroundColor: "#fcfcfc",color:"#9c9695" }}
            >
              <i
                className="fa-sharp fa-solid fa-microchip me-2"
                style={{ color: "#d9d1d0" }}
              />
              ຕັ້ງຄ່າກິດຈະການ
            </div>
            <TurnOffHouse />
            <InviteOwner />
          </div>
        </div>
        <div className="col-md-4 mt-1">
          <div className="card border ms-1">
            <div
              className="p-1  border-bottom  fs-5"
              style={{ backgroundColor: "#fcfcfc",color:"#9c9695" }}
            >
              <i
                className="fa-sharp fa-solid fa-microchip me-2"
                style={{ color: "#d9d1d0" }}
              />
              ຕັ້ງຄ່າພະນັກງານ
            </div>
            <BlockUser />
            <ChangeRole />
            <UserList />
          </div>
        </div>
        <div className="col-md-4 mt-1">
          <div className="card border ms-1">
            <div
              className="p-1 border-bottom  fs-5"
              style={{ backgroundColor: "#fcfcfc", color:"#9c9695" }}
            >
              <i
                className="fa-sharp fa-solid fa-microchip me-2"
                style={{ color: "#d9d1d0" }}
              />
              ຈັດການລະຫັດຜ່ານ
            </div>
            <ChangePasswordStaff />
            <ChangePasswordCustomer />
          </div>
        </div>
      </div>
    </>
  );
}
