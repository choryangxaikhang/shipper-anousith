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
      <div className="card" style={{ marginTop: 50 }}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <TurnOffHouse />
                </div>
                <div className="col-md-12 mt-3">
                  <InviteOwner />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <div className="list-group">
                    <div className="col-md-12 mt-3">
                      <BlockUser />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ChangePasswordStaff />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ChangePasswordCustomer />
                    </div>
                    <div className="col-md-12 mt-3">
                      <ChangeRole />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
