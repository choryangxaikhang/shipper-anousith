import React, { useEffect, useState } from "react";
import Notiflix, { Loading } from "notiflix";
import {
  getStaffLogin,
  userStatus,
  loadingScreen,
  setGender,
  TOKEN,
  formatDateDash,
} from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import male from "../../img/male.png";
import female from "../../img/female.png";
import { LOGIN } from "../../routes/app";
import { USERS } from "./apollo";
export default function Profile() {
  const [listData, setListData] = useState([]);
  const userState = getStaffLogin();

  const [fetchData, { data: dataStaff }] = useLazyQuery(USERS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          role: "SHIPPER",
          _id: parseInt(userState?._id),
        },
      },
    });
  }, []);
  useEffect(() => {
    setListData(dataStaff?.users?.data[0]);
  }, [dataStaff]);
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
    <>
      <div id="appCapsule">
        <div className="appHeader text-white border-0 ">
          <div style={{ flex: 1 }} className="text-left">
          </div>
          ໂປຣໄຟລ໌
          <div
            className="text-white pageTitle text-right text-nowrap pr-0 "
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
        <div className="body-content bg-white" style={{ marginTop: -30 }}>
          <center>
            {listData?.gender === "MALE" ? (
              <img
                src={listData?.profileImage ? listData?.profileImage : male}
                alt="logo"
                className="logo p-2"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "40%",
                  border: "2px solid de0a0af2",
                }}
              />
            ) : (
              <img
                src={listData?.profileImage ? listData?.profileImage : female}
                alt="logo"
                className="logo p-2"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "40%",
                  border: "2px solid de0a0af2",
                }}
              />
            )}
            <br />
            <b>ID: {listData?.cvID}</b>
          </center>
          <div style={{ marginTop: -20 }}>
            <div className="session-list">
              <div className="listview-title ml-0 mb-2"></div>
              <>
                <ul className="listview image-listview text">
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ຊື່ ແລະ ນາມສະກຸມ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {listData?.firstName ? listData?.firstName : "-"}{" "}
                          {listData?.lastName ? listData?.lastName : "-"}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ເພດ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {setGender(listData?.gender ? listData?.gender : "-")}{" "}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ແຂວງ</div>
                        <div className="custom-control custom-switch">
                          {listData?.province?.title
                            ? listData?.province?.title
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
                          {listData?.district?.title
                            ? listData?.district?.title
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
                          {listData?.village?.title
                            ? listData?.village?.title
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ວັນທີ່ເລີ່ມວຽກ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {formatDateDash(
                            listData?.workStartDate
                              ? listData?.workStartDate
                              : "-"
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ເບີໂທ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {listData?.phoneNumber ? listData?.phoneNumber : "-"}
                          <br />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div >ບ່ອນປະຈຳການ:</div>
                        <div className="custom-control custom-switch">
                          {listData?.branch?.title
                            ? listData?.branch?.title
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ຕຳແຫນ່ງ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {userStatus(listData?.role ? listData?.role : "-")}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
