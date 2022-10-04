import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import BlockUser from "./widget/blockUser";

import ChangeRole from "./widget/changeRole";

import ChangePasswordStaff from "./widget/changePasswordStaff";
import ChangePasswordCustomer from "./widget/changePasswordCustomer";

import TurnOffHouse from "./widget/turnOffhouse";
import InviteOwner from "./widget/inviteOwner";
import { OTHER } from "../../routes/app";
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
        <div className="card-group mb-3 col-md-4">
          <div className="card border ms-1">
            <div className="p-1 border-bottom text-black text-center">
              ຕັ້ງຄ່າກິດຈະການ
            </div>
            <TurnOffHouse />
            <InviteOwner />
          </div>
        </div>
        <div className="card-group mb-3 col-md-4">
          <div
            className="card border ms-1"
            style={{ backgroundColor: "#daffd6" }}
          >
            <div className="p-2  border-bottom fs-4 text-black text-center">
              <i className="fa-solid fa-chevron-right me-2" />
              ຕັ້ງຄ່າພະນັກງານ
            </div>
            <div className="card-body text-black">
              <span>ເງິນກີບ:</span>
            </div>
          </div>
        </div>
        <div className="card-group mb-3 col-md-4">
          <div
            className="card border ms-1"
            style={{ backgroundColor: "#daffd6" }}
          >
            <div className="p-2  border-bottom fs-4 text-black text-center">
              <i className="fa-solid fa-chevron-right me-2" />
              ຈັດການລະຫັດຜ່ານ
            </div>
            <div className="card-body text-black">
              <span>ເງິນກີບ:</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
