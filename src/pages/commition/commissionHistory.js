import React, { useEffect, useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import { COMMISSION_SHIPER, DETAIL_HISTORY } from "../../routes/app";
import {
  endOfMonth,
  formatDateDash,
  getStaffLogin,
  startMonth,
  currency,
  messageSuccess,
  messageError,
} from "../../helper";
import { useLazyQuery, useMutation } from "@apollo/client";
import { QUERY_PAYROLL_SUMMARY, UPDATE_PAYROLL } from "../home/apollo";
import BottomNav from "../../layouts/BottomNav";
import Notiflix from "notiflix";

export default function CommissionHistory() {
  const { history } = useReactRouter();
  const useInfo = getStaffLogin();
  const [dataUser, setResultPayroll] = useState();
  const [reloadData, setReloadData] = useState(false);
  const [startDate, setStartDate] = useState(startMonth());
  const [endDate, setEndDate] = useState(endOfMonth());

  const [updatePayroll] = useMutation(UPDATE_PAYROLL);
  const [fetchPayroll, { data: resultPayroll }] = useLazyQuery(
    QUERY_PAYROLL_SUMMARY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    fetchPayroll({
      variables: {
        where: {
          empID: parseInt(useInfo?._id),
        },
        orderBy: "DESC",
        limit: 0,
      },
    });
  }, [startDate, endDate, reloadData]);

  useEffect(() => {
    setResultPayroll(resultPayroll?.summaryPayroll?.data);
  }, [resultPayroll]);

  const _updateConfirmStatus = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການຢືນຢັນແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _updatePayroll = await updatePayroll({
            variables: {
              data: {
                confirmStatus: "CONFIRMED",
              },
              where: {
                _id: parseInt(id),
              },
            },
          });

          if (_updatePayroll) {
            messageSuccess("ດຳເນີນການສຳເລັດ");
            setReloadData(!reloadData);
          }
        } catch (error) {
          console.log(error);
          messageError("ດຳເນີນການບໍ່ສຳເລັດ");
        }
      },
      () => {
        return false;
      }
    );
  };

  return (
    <>
      <div className="appHeader text-light border-0 mr-0">
        <div style={{ flex: 1 }} className="text-left">
          <button
            className="btn text-white"
            onClick={() => history.push(`${COMMISSION_SHIPER}/1`)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        <b className="text-white">ປະຫວັດເງິນເດືອນ</b>
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div style={{marginTop: "50px"}}>
        <div className="section">
          <div className="transactions ">
            {dataUser?.map((item) => (
              <a
                href="#"
                className="item"
                onClick={() => history.push(`${DETAIL_HISTORY}/${item?._id} `)}
              >
                <div className="detail">
                  <div className="align-top">
                    <i className="fa-solid fa-file-invoice-dollar fa-3x me-2" />
                  </div>
                  <div className="text-nowrap">
                    <p>
                      ຊື່ ແລະ ນາມສະກຸນ: {item?.empID?.firstName}{" "}
                      {item?.empID?.lastName}
                    </p>
                    <p>ວັນທີ່ຢືນຢັນ: {formatDateDash(item?.confirmedDate)}</p>
                    <p>ຈຳນວນເງິນ: {currency(item?.finalIncome)} ກີບ</p>
                    <p>
                      ເງິນເດືອນປະຈຳເດືອນ:
                      <span className="text-danger">
                        {" "}
                        {item?.forMonth}/{item?.forYear}
                      </span>
                    </p>
                    <p>
                      {item?.confirmStatus === "CONFIRMED" ? (
                        <span className="badge text-success">ຢືນຢັນແລ້ວ</span>
                      ) : (
                        <button
                          className="btn btn-success btn-block btn-xs rounded-pill mt-2"
                          onClick={() => _updateConfirmStatus(item?._id)}
                        >
                          <i class="fa-regular fa-circle-check mr-1" />
                          ຢືັນຢັນເງິນເດືອນ
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
