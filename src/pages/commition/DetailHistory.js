import React, { useEffect, useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import { HISTORY_COMMISSION } from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import {
  endOfMonth,
  getStaffLogin,
  startMonth,
  currency,
  messageSuccess,
  messageError,
} from "../../helper";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  QUERY_COMMISSION,
  QUERY_PAYROLL_SUMMARY,
  UPDATE_PAYROLL,
} from "../home/apollo";
import Notiflix from "notiflix";
import DetailIBonusMoney from "./DetailAll/DetailBonus";
import DetailExtraIncome from "./DetailAll/DetailExtraIncome";
import DetailIBorrow from "./DetailAll/DetailBorow";
import DetailOT from "./DetailAll/DetailOT";
import DetailDeduct from "./DetailAll/DetailDeduct";
import DetailDiligent from "./DetailAll/DetailDiligent";

export default function DetailHistory() {
  const useInfo = getStaffLogin();
  const { history, match } = useReactRouter();
  const ID = parseInt(match?.params?._id);
  const [dataUser, setResultPayroll] = useState();
  const [reloadData, setReloadData] = useState(false);
  const [dataSummary, setResultSummary] = useState();
  const [startDate, setStartDate] = useState(startMonth());
  const [endDate, setEndDate] = useState(endOfMonth());

  const [detailIBonus, setDetailBonus] = useState();
  const [detailExtraIncome, setExtraIncome] = useState();
  const [detailBorrow, setDetailBorrow] = useState();
  const [detailOT, setDetailOT] = useState();
  const [detailDeduct, setDetailDeduct] = useState();
  const [detailDiligent, setDetailDiligent] = useState();

  const [updatePayroll] = useMutation(UPDATE_PAYROLL);
  const [fetchPayroll, { data: resultPayroll }] = useLazyQuery(
    QUERY_PAYROLL_SUMMARY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [fetchSummary, { data: resultSummary }] = useLazyQuery(
    QUERY_COMMISSION,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    fetchPayroll({
      variables: {
        where: {
          _id: parseInt(ID),
        },
        limit: 1,
      },
    });

    fetchSummary({
      variables: {
        where: {
          shipper: parseInt(useInfo?._id),
          dateBetween: [startDate, endDate],
        },
      },
    });
  }, [startDate, endDate, reloadData]);

  useEffect(() => {
    setResultPayroll(resultPayroll?.summaryPayroll?.data);
  }, [resultPayroll]);

  useEffect(() => {
    setResultSummary(resultSummary?.summariesShippers);
  }, [resultSummary]);

  const _receive = parseInt(dataSummary?.receive?.total || 0);
  const _receiveCommission = parseInt(dataSummary?.receive?.commission || 0);

  let _sent = parseInt(dataSummary?.sent?.general?.total || 0);
  let _sentCommission = parseInt(dataSummary?.sent?.general?.commission || 0);

  let _sentNear = parseInt(dataSummary?.sent?.near?.total || 0);
  let _sentNearCommission = parseInt(dataSummary?.sent?.near?.commission || 0);

  let _sentFar = parseInt(dataSummary?.sent?.farAway?.total || 0);
  let _sentFarCommission = parseInt(
    dataSummary?.sent?.farAway?.commission || 0
  );

  let _total = parseInt(_sent + _sentNear + _sentFar);
  const amountCommission = parseInt(
    _sentCommission + _sentNearCommission + _sentFarCommission
  );

  const totalCommission = _total >= (200 || 240) ? 100000 : 0;
  const totalCommission1 = _total >= 250 ? 150000 : 0;

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
            onClick={() => history.push(`${HISTORY_COMMISSION}/1`)}
           >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        <b className="text-white">ລາຍລະອຽດ</b>
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="container-min">
        <div className="card">
          <div className="col-12">
            <div style={{ paddingBottom: "20px" }} />
            <div className="listed-detail mt-5">
            </div>
            {dataUser &&
              dataUser?.map((item, index) => (
                <ul className="listview flush transparent simple-listview no-space mt-1">
                  <li>
                    <strong>cvID:</strong>
                    <span> {item?.empID?.cvID}</span>
                  </li>
                  <li>
                    <strong>ຊື່ ແລະ ນາມສະກຸນ</strong>
                    <span> {item?.empID?.firstName}{" "}{item?.empID?.lastName}</span>
                  </li>
                  <li>
                    <strong>ເງິນເດືອນພື້ນຖານ</strong>
                    <span>{currency(item?.empID?.basicSalary || 0)} ກີບ</span>
                  </li>
                  <li>
                    <strong>ເງິນຕຳແໜ່ງ</strong>
                    <span>{currency(item?.positionSalary || 0)} ກີບ</span>
                  </li>
                  {item?.extraIncome !== 0 ? (
                    <li onClick={() => setExtraIncome(item?._id)}>
                      <strong>ເງິນເພິ່ມ</strong>
                      <span>{currency(item?.extraIncome || 0)} ກີບ
                      <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                      </span>
                    </li>
                  ) : null}

                  {item?.otIncome !== 0 ? (
                    <li onClick={() => setDetailOT(item?._id)}>
                      <strong>ເງິນໂອທີ</strong>
                      <span>{currency(item?.otIncome || 0)} ກີບ
                      <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                      </span>
                    </li>
                  ) : null}

                  {item?.bonusIncome !== 0 ? (
                    <li onClick={() => setDetailBonus(item?._id)}>
                      <strong>ເງິນໂບນັດ</strong>
                      <span>{currency(item?.bonusIncome || 0)} ກີບ
                      <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                      </span>
                    </li>
                  ) : null}

                  {item?.diligentIncome !== 0 ? (
                    <li onClick={() => setDetailDiligent(item?._id)}>
                      <strong>ເງິນຂະຫຍັນ</strong>
                      <span>{currency(item?.diligentIncome || 0)} ກີບ
                      <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                      </span>
                    </li>
                  ) : null}

                  {item?.borrowExpense !== 0 ? (
                    <li onClick={() => setDetailBorrow(item?._id)}>
                      <strong>ເງິນເບິກລ່ວງໜ້າ</strong>
                      <span>{currency(item?.borrowExpense || 0)} ກີບ
                      <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                      </span>
                    </li>
                  ) : null}

                  {item?.deductionExpense !== 0 ? (
                    <li onClick={() => setDetailDeduct(item?._id)}>
                      <strong>ເງິນຫັກ</strong>
                      <span>{currency(item?.deductionExpense || 0)} ກີບ
                      <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                      </span>
                    </li>
                  ) : null}

                  <li>
                    <strong>ອໍເດີໄລຍະໃກ້</strong>
                    <span>
                      {_sentNear || 0} / {currency(_sentNearCommission || 0)}{" "}
                      ກີບ
                    </span>
                  </li>
                  <li>
                    <strong>ອໍເດີໄລຍະທົ່ວໄປ</strong>
                    <span>
                      {_sent || 0} / {currency(_sentCommission || 0)} ກີບ
                    </span>
                  </li>
                  <li>
                    <strong>ອໍເດີໄລຍະໄກ</strong>
                    <span>
                      {_sentFar || 0} / {currency(_sentFarCommission || 0)} ກີບ
                    </span>
                  </li>

                  <li>
                    <strong>ອໍເດີສົ່ງສຳເລັດທັງໝົດ</strong>
                    <span>
                      {_total || 0} / {currency(amountCommission || 0)} ກີບ
                    </span>
                  </li>
                  <li>
                    <strong>ອໍເດີຮັບເຂົ້າທັງໝົດ</strong>
                    <span>
                      {_receive || 0} / {currency(_receiveCommission || 0)} ກີບ
                    </span>
                  </li>
                  {_total >= 250 ? (
                    <li>
                      <strong>ເງິນເປົ້້າ</strong>
                      <span> {totalCommission1} ກີບ</span>
                    </li>
                  ) : (
                    <li>
                      <strong>ເງິນເປົ້າ</strong>
                      <span> {totalCommission} ກີບ</span>
                    </li>
                  )}
                  <li>
                    <strong>ຄ່າອາກອນ</strong>
                    <span>{currency(item?.taxIncome || 0)} ກີບ</span>
                  </li>
                  <li>
                    <strong>
                      <i className="fa-solid fa-money-bill-wave mr-1" />
                      ເງິນເດືອນທີ່ໄດ້
                    </strong>
                    <span className="text-success">
                      {currency(item?.finalIncome || 0)} ກີບ
                    </span>
                  </li>
                  <div className="mb-3 mt-3">
                    {item?.confirmStatus === "CONFIRMED" ? (
                      <button
                        className="btn btn-success btn-block btn-xs rounded-pill"
                        disabled
                        onClick={() => _updateConfirmStatus(item?._id)}
                      >
                        <i class="fa-regular fa-circle-check mr-1" />
                        ຢືັນຢັນເງິນເດືອນ
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-block btn-xs rounded-pill"
                        onClick={() => _updateConfirmStatus(item?._id)}
                      >
                        <i class="fa-regular fa-circle-check mr-1" />
                        ຢືັນຢັນເງິນເດືອນ
                      </button>
                    )}
                  </div>
                </ul>
              ))}
          </div>
        </div>
        <BottomNav />
      </div>
      <DetailIBonusMoney _id={detailIBonus} onHide={() => setDetailBonus()} />
      <DetailExtraIncome
        _id={detailExtraIncome}
        onHide={() => setExtraIncome()}
      />
      <DetailIBorrow _id={detailBorrow} onHide={() => setDetailBorrow()} />
      <DetailOT _id={detailOT} onHide={() => setDetailOT()} />
      <DetailDeduct _id={detailDeduct} onHide={() => setDetailDeduct()} />
      <DetailDiligent _id={detailDiligent} onHide={() => setDetailDiligent()} />
    </>
  );
}
