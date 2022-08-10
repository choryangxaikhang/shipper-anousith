import React, { useContext, useEffect, useState } from "react";

import male from "../../img/male.png";
import { AppContext } from "../../App";
import {
  aws_url_employee_Image,
  currency,
  formatDate,
  formatDateTime,
  loadingScreen,
  setGender,
  TOKEN,
} from "../../helper";
import Notiflix, { Loading } from "notiflix";
import BottomNav from "../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import { EMPLOYEE_QUEY } from "./apollo";
export default function Profile({ history }) {
  const [getUser, setGetUser] = useState("");
  const { userState } = useContext(AppContext);
  const userData = userState?.data;
  const [fetchData, { data: dataStaff, loading }] = useLazyQuery(
    EMPLOYEE_QUEY,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    fetchData({
      variables: {
        where: {},
      },
    });
  }, []);
  useEffect(() => {
    setGetUser(dataStaff?.employees?.data[0]);
  }, [dataStaff])

  console.log("dataStaff", getUser)


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
  // const _sendDataUpdate = (data) => {
  //   ;
  //   localStorage.setItem("data", JSON.stringify(data));
  // }
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
        <div className="section wallet-card-section pt-2">
          <div
            className="wallet-card pt-0 text-center mt-1"
            style={{
              height: 180,
            }}
          >
            {" "}
            <img
              src={
                getUser?.profileImage
                  ? aws_url_employee_Image + getUser?.profileImage
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
            /> <br />
            <b className="text-start">
              ID: {getUser?.cvID ? getUser?.cvID : "-"}<br />
            </b>
          </div>

          <div className="session-list mt-3">
            <div className="listview-title ml-0">ລາຍລະອຽດ</div>
            <>
              <ul className="listview image-listview text">
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເມືອງ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.firstName ? getUser?.firstName : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເບີໂທ</div>
                      <div className="custom-control custom-switch user-select-all">
                      {getUser?.phoneNumber ? getUser?.phoneNumber  : "-"}<br/>
                      </div>
                    </div>
                  </div>
                </li> <li>
                  <div className="item">
                    <div className="in">
                      <div>ເງິນເດືອນພື້ນຖານ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {currency(getUser?.basicSalary
                          ? getUser?.district?.title
                          : 0)}
                      </div>
                    </div>
                  </div>
                </li>
                 <li>
                  <div className="item">
                    <div className="in">
                      <div>ເງິນຕຳແຫນ່ງ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.positionSalary
                          ? getUser?.positionSalary
                          : 0}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                <div className="item">
                    <div className="in">
                      <div>ເງິນອາກອນ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.taxIncome
                          ? getUser?.taxIncome
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ບ້ານ</div>
                      <div className="custom-control custom-switch">
                        {getUser?.village
                          ? getUser?.village
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
                        {getUser?.district?.title
                          ? getUser?.district?.title
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
                        {getUser?.province?.provinceName
                          ? getUser?.province?.provinceName
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      {getUser?.note ? getUser?.note : "-"}
                    </div>
                  </div>
                </li>
              </ul>
            </>
          </div>
          {/* <div>
            <a
              href="javaScript:void(0)"
              hidden={getUser[0]?false:true}
              className="btn btn-block btn-primary btn-lg rounded mt-5"
              onClick={() => {
                _sendDataUpdate(getUser[0]);
                history.push(`/profile/updateprofile`);
              }}
            >
              <i className="icon-edit mr-1"></i> ແກ້ໄຂໂປຣໄຟລ໌
            </a>
          </div> */}
        </div>
        <BottomNav />
      </div>
    </>
  );
}
