import React from "react";
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
  const { history } = useReactRouter();
  return (
    <>
      <div classNameName="appHeader text-light border-0 mr-0">
        <div style={{ flex: 1 }} classNameName="text-left">
          <button
            classNameName="btn text-white"
            onClick={() => history.push(OTHER)}
          >
            <i classNameName="fa fa-chevron-left fs-4" />
          </button>
        </div>
        ຕັ້ງຄ່າລະບົບ
        <div
          classNameName="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div classNameName="row" style={{ marginTop: 70 }}>
        <div classNameName="col-md-4 mt-1">
          <div classNameName="card border ms-1">
            <div
              classNameName="p-1 border-bottom  fs-5"
              style={{ backgroundColor: "#fcfcfc", color: "#9c9695" }}
            >
              <i
                classNameName="fa-sharp fa-solid fa-microchip me-2"
                style={{ color: "#d9d1d0" }}
              />
              ຕັ້ງຄ່າກິດຈະການ
            </div>
            <TurnOffHouse />
            <InviteOwner />
          </div>
        </div>
        <div classNameName="col-md-4 mt-1">
          <div classNameName="card border ms-1">
            <div
              classNameName="p-1  border-bottom  fs-5"
              style={{ backgroundColor: "#fcfcfc", color: "#9c9695" }}
            >
              <i
                classNameName="fa-sharp fa-solid fa-microchip me-2"
                style={{ color: "#d9d1d0" }}
              />
              ຕັ້ງຄ່າພະນັກງານ
            </div>
            <BlockUser />
            <ChangeRole />
            <UserList />
          </div>
        </div>
        <div classNameName="col-md-4 mt-1">
          <div classNameName="card border ms-1">
            <div
              classNameName="p-1 border-bottom  fs-5"
              style={{ backgroundColor: "#fcfcfc", color: "#9c9695" }}
            >
              <i
                classNameName="fa-sharp fa-solid fa-microchip me-2"
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
