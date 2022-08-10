import React, { useContext, useEffect, useState } from "react";

import male from "../../img/male.png";
import { AppContext } from "../../App";
import {
  aws_url_image,
  formatDate,
  formatDateTime,
  loadingScreen,
  setGender,
  TOKEN,
} from "../../helper";
import Notiflix, { Loading } from "notiflix";
import BottomNav from "../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import { QUERY_CUSTOMER } from "./apollo";
export default function Profile({ history }) {
  const [dataCustomer, setDataCustomer] = useState("");
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;

  const [getCustomer, { data: customerData, loading }] = useLazyQuery(
    QUERY_CUSTOMER,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    getCustomer({
      variables: {
        where: {
          _id: userData?._id ? parseInt(userData?._id) : "",
        },
      },
    });
    if (customerData) {
      setDataCustomer(customerData?.customers?.data);
    }
  }, [customerData]);

      
  const onLogout = () => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        loadingScreen();
        setTimeout(() => {
          Loading.remove();
          localStorage.clear();
          window.location.replace("/landing");
          localStorage.removeItem(TOKEN);
        }, 2000);
      },
      () => {
        return false;
      }
    );
  };
  const _sendDataUpdate = (data) => {;
    localStorage.setItem("data", JSON.stringify(data));
  }
  return (
    <>
      <div id="appCapsule">
        <div className="appHeader text-light border-0">
          <div style={{ flex: 1 }} className="text-left">
          <button
                className="btn text-white mr-2"
                onClick={() => history.goBack()}
              >
                <i className="icon-x fs-4" />
              </button>
          </div>
          ໂປຣໄຟລ໌
          <div
            className="text-white pageTitle text-right text-nowrap pr-0"
            style={{ flex: 1 }}
          >
            <button
              className="btn text-white ml-0"
              onClick={() => onLogout()}
              style={{ flex: 1, marginRight: -10 }}
            >
              <i className="icon-log-out1" style={{ fontSize: 25 }} />
            </button>
          </div>
        </div>
        <div className="section wallet-card-section pt-5">
          <div
            className="wallet-card pt-0"
            style={{
              height: 180,
              backgroundColor: "#565e5e",
            }}
          >
            <table className="w-100 mt-0">
              <tr>
                <td className="text-center p-0">
                  {" "}
                  <img
                    src={
                      dataCustomer[0]?.profileImage
                        ? aws_url_image + dataCustomer[0]?.profileImage
                        : male
                    }
                    alt="logo"
                    className="logo mb-2"
                    style={{
                      width: 70,
                      height: 75,
                      borderRadius: 4,
                      marginLeft: -10,
                    }}
                  />{" "}
                  <p>BH{dataCustomer[0]?._id ? dataCustomer[0]?._id : "-"}</p>
                </td>
                <td className="text-left text-white pl-1">
                  <p className="m-1">
                    ຊື່:{" "}
                    {dataCustomer[0]?.fullName
                      ? dataCustomer[0]?.fullName
                      : "-"}
                  </p>
                  <p className="m-1">
                    ເພດ:{" "}
                    {dataCustomer[0]?.gender
                      ? setGender(dataCustomer[0]?.gender)
                      : "-"}
                  </p>
                  <p className="m-1">
                    ເບີໂທ:{" "}
                    {dataCustomer[0]?.phoneNumber
                      ? dataCustomer[0]?.phoneNumber
                      : "-"}
                  </p>
                  <p className="m-1">
                    ວັນທີສະໝັກ:{" "}
                    {dataCustomer[0]?.createdAt
                      ? formatDate(dataCustomer[0]?.createdAt)
                      : "-"}
                  </p>
                  <div
                    className="text-center bg-primary rounded"
                    style={{ padding: 2 }}
                  >
                    {dataCustomer[0]?.status}
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="session-list mt-3">
            <div className="listview-title ml-0">ຂໍ້ມູນທີ່ຢູ່</div>
            <>
              <ul className="listview image-listview text">
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ບ້ານ</div>
                      <div className="custom-control custom-switch">
                        {dataCustomer[0]?.village
                          ? dataCustomer[0]?.village
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເມືອງ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {dataCustomer[0]?.district?.title
                          ? dataCustomer[0]?.district?.title
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ແຂວງ</div>
                      <div className="custom-control custom-switch">
                        {dataCustomer[0]?.province?.provinceName
                          ? dataCustomer[0]?.province?.provinceName
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      {dataCustomer[0]?.note ? dataCustomer[0]?.note : "-"}
                    </div>
                  </div>
                </li>
              </ul>
            </>
          </div>
          <div>
            <a
              href="javaScript:void(0)"
              hidden={dataCustomer[0]?false:true}
              className="btn btn-block btn-primary btn-lg rounded mt-5"
              onClick={() => {
                _sendDataUpdate(dataCustomer[0]);
                history.push(`/profile/updateprofile`);
              }}
            >
              <i className="icon-edit mr-1"></i> ແກ້ໄຂໂປຣໄຟລ໌
            </a>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
