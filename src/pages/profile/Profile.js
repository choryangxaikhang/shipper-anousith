import React, {useEffect, useState } from "react";
import Notiflix, { Loading } from "notiflix";
import {
  currency,
  formatDate,
  getStaffLogin,
  getStatus,
  loadingScreen,
  setGender,
  TOKEN,
} from "../../helper";
import BottomNav from "../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import Imglogo from "../../img/app-icon.png";
import { LOGIN } from "../../routes/app";
import { USERS } from "./apollo";
export default function Profile({ history }) {
  const [listData, setListData] = useState({});
  const userState = getStaffLogin();
  const userData = userState?.data;
  const [fetchData, { data: dataStaff, loading }] = useLazyQuery(USERS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          _id: parseInt(userData?._id),
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
            {/* <button
              className="btn text-white mr-2"
              onClick={() => history.goBack()}
            >
              <i className="icon-x fs-4" />
            </button> */}
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
            <img
              src={Imglogo}
              alt="logo"
              className="logo p-2"
              style={{
                width: 120,
                height: 120,
                borderRadius: "40%",
                border: "2px solid f54f02",
              }}
            /><br/>
            <b>ID-USER:{" "}{listData?._id}</b>
          </center>
          <div style={{ marginTop: -20 }}>
            <div className="session-list">
              <div className="listview-title ml-0">ລາຍລະອຽດ</div>
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
                        <div>ວັນທີ່ເລີ່ມວຽກ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {formatDate(
                            listData?.startWorkTime
                              ? listData?.startWorkTime
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
                        <div>ຕຳແຫນ່ງ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {getStatus(listData?.role ? listData?.role : "-")}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ເງິນເດືອນພື້ນຖານ</div>
                        <div className="custom-control custom-switch user-select-all">
                          {currency(
                            listData?.basicSalary ? listData?.basicSalary : 0
                          )}{" "}
                          ກີບ
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
                        <div>ແຂວງ</div>
                        <div className="custom-control custom-switch">
                          {listData?.province?.provinceName
                            ? listData?.province?.provinceName
                            : "-"}
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
