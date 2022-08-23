import React, { useContext, useEffect, useState } from "react";

import male from "../../img/male.png";
import { AppContext } from "../../App";
import {
  aws_url_employee_Image,
  currency,
  formatDate,
  getStatus,
  loadingScreen,
  TOKEN,
} from "../../helper";
import Notiflix, { Loading } from "notiflix";
import BottomNav from "../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import { EMPLOYEE_QUEY } from "./apollo";
import { LOGIN } from "../../routes/app";
export default function Profile({ history }) {
  const [getUser, setGetUser] = useState("");
  const { userState } = useContext(AppContext);
  const userData = userState?.data;
  console.log(userData?._id)
  const [fetchData, { data: dataStaff, loading }] = useLazyQuery(
    EMPLOYEE_QUEY,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          _id:userData?._id
        },
      },
    });
  }, []);
  useEffect(() => {
    setGetUser(dataStaff?.employees?.data[0]);
  }, [dataStaff])
  const onLogout = () => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        Loading.dots();
        setTimeout(() => {
          Loading.remove();
          localStorage.clear();
          window.location.replace(LOGIN);
          localStorage.removeItem(TOKEN);
        }, 2000);
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
        <div className="section wallet-card-section pt-3 ">
          <div
            className="wallet-card pt-0 text-center"
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
                      <div>ຊື່ ແລະ ນາມສະກຸມ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.firstName ? getUser?.firstName : "-"}{" "}
                        {getUser?.lastName ? getUser?.lastName : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເພດ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.firstName ? getUser?.firstName : "-"}{" "}
                        {getUser?.lastName ? getUser?.lastName : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ວັນເດືອນປີເກີດ</div>
                      <div className="custom-control custom-switch user-select-all">
                       {formatDate(getUser?.dateOfBirth ? getUser?.dateOfBirth : "-")}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ອາຍຸ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.age ? getUser?.age : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                 <li>
                  <div className="item">
                    <div className="in">
                      <div>ວັນທີ່ເລີ່ມວຽກ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {formatDate(getUser?.workStartDate ? getUser?.workStartDate : "-")}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເບີໂທ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.phoneNumber ? getUser?.phoneNumber : "-"}<br />
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ພະແນກ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.department?.title_lao
                          ? getUser?.department?.title_lao
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
                        {getStatus(getUser?.role ? getUser?.role: "-")}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ຫນ່ວຍງານ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.team?.title_lao
                          ? getUser?.team?.title_lao
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເງິນເດືອນພື້ນຖານ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {currency(getUser?.basicSalary
                          ? getUser?.basicSalary
                          : 0)}{" "}ກີບ
                      </div>
                    </div>
                  </div>
                </li>
                 <li>
                  <div className="item">
                    <div className="in">
                      <div>ເງິນຕຳແຫນ່ງ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {currency(getUser?.positionSalary
                          ? getUser?.positionSalary
                          : 0)}{" "}ກີບ
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
                          ? currency(getUser?.taxIncome):0}{" "}ກີບ
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <div className="in">
                      <div>ເງິນປະກັນສັງຄົມ</div>
                      <div className="custom-control custom-switch user-select-all">
                        {getUser?.InsuranceExpense
                          ? currency(getUser?.InsuranceExpense): 0} {" "}ກີບ
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
                      <div>ອື່ນໆ</div>
                      <div className="custom-control custom-switch">
                        {getUser?.note
                          ? getUser?.note
                          : "-"}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
