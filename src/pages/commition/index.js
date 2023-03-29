import React, { useEffect, useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import { HOME_PAGE } from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import {
  formatDateDash,
  getStaffLogin,
  toDayDash,
  currency,
  messageSuccess,
  messageError,
} from "../../helper";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  LIST_USERS,
  QUERY_COMMISSION,
  QUERY_PAYROLL_SUMMARY,
  UPDATE_PAYROLL,
} from "../home/apollo";
import Notiflix from "notiflix";
import DetailIBonusMoney from "./DetailAll/DetailBonus";
import DetailExtraIncome from "./DetailAll/DetailExtraIncome";
import DetailDeduct from "./DetailAll/DetailDeduct";
import DetailDiligent from "./DetailAll/DetailDiligent";
import DetailOT from "./DetailAll/DetailOT";
import DetailIBorrow from "./DetailAll/DetailBorow";
import ReportCommission from "./ReportCommission";

export default function Commission_ShiPer() {
  const useInfo = getStaffLogin();
  const { history, location } = useReactRouter();
  const [dataUser, setUser] = useState();
  const [reloadData, setReloadData] = useState(false);
  const [dataSummary, setResultSummary] = useState();
  const [startDate, setStartDate] = useState(toDayDash());
  const [endDate, setEndDate] = useState(new Date());

  const [detailIBonus, setDetailIBonus] = useState();
  const [detailExtraIncome, setExtraIncome] = useState();
  const [detailBorrow, setDetailBorrow] = useState();
  const [detailOT, setDetailOT] = useState();
  const [detailDeduct, setDetailDeduct] = useState();
  const [detailDiligent, setDetailDiligent] = useState();

  const [updatePayroll] = useMutation(UPDATE_PAYROLL);
  const [fetchSummary, { data: Summary }] = useLazyQuery(
    QUERY_PAYROLL_SUMMARY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [fetchUser, { data: User }] = useLazyQuery(LIST_USERS, {
    fetchPolicy: "cache-and-network",
  });
  const [fetchCommission, { data: resultSummary }] = useLazyQuery(
    QUERY_COMMISSION,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    fetchSummary({
      variables: {
        where: {
          empID: parseInt(useInfo?._id),
          confirmStatus: "UNCONFIRMED",
        },
        orderBy: "DESC",
        limit: 1,
      },
    });

    fetchUser({
      variables: {
        where: {
          _id: parseInt(useInfo?._id),
        },
        orderBy: "DESC",
        limit: 1,
      },
    });

    fetchCommission({
      variables: {
        where: {
          shipper: parseInt(useInfo?._id),
          dateBetween: [startDate, endDate],
        },
      },
    });
  }, [startDate, endDate, reloadData]);

  useEffect(() => {
    setUser(User?.users?.data);
  }, [User]);

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

  const _totalCommission = parseInt(
    _receiveCommission + amountCommission + totalCommission + totalCommission1
  );

  const totalSummary = Summary?.summaryPayroll?.total;
  const _dataSummary = Summary?.summaryPayroll?.data[0];

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
            onClick={() => history.push(`${HOME_PAGE}`)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        <b className="text-white">ຂໍ້ມູນການແບ່ງສ່ວນ</b>
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
              <div className="row">
                <div className="col-6 mb-2">
                  <input
                    type="date"
                    value={formatDateDash(startDate)}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-6 mb-2">
                  <input
                    type="date"
                    value={formatDateDash(endDate)}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>
            </div>
            {dataUser &&
              dataUser?.map((item) => (
                <ul className="listview flush transparent simple-listview no-space mt-1">
                  <li>
                    <strong>ID:</strong>
                    <span> {item?.cvID}</span>
                  </li>
                  <li>
                    <strong>ຊື່ ແລະ ນາມສະກຸນ:</strong>
                    <span>
                      {" "}
                      {item?.firstName} {item?.lastName}
                    </span>
                  </li>
                  <li>
                    <strong>ເງິນເດືອນພື້ນຖານ</strong>
                    <span>{currency(item?.basicSalary || 0)} ກີບ</span>
                  </li>
                  <li>
                    <strong>ເງິນຕຳແໜ່ງ</strong>
                    <span>{currency(item?.positionSalary || 0)} ກີບ</span>
                  </li>
                  {totalSummary > 0 ? (
                    <>
                      {_dataSummary?.extraIncome !== 0 ? (
                        <li onClick={() => setExtraIncome(_dataSummary?._id)}>
                          <strong>ເງິນເພິ່ມ</strong>
                          <span>
                            {currency(_dataSummary?.extraIncome || 0)} ກີບ
                            <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                          </span>
                        </li>
                      ) : null}

                      {_dataSummary?.otIncome !== 0 ? (
                        <li onClick={() => setDetailOT(_dataSummary?._id)}>
                          <strong>ເງິນໂອທີ</strong>
                          <span>
                            {currency(_dataSummary?.otIncome || 0)} ກີບ
                            <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                          </span>
                        </li>
                      ) : null}

                      {_dataSummary?.bonusIncome !== 0 ? (
                        <li onClick={() => setDetailIBonus(_dataSummary?._id)}>
                          <strong>ເງິນໂບນັດ</strong>
                          <span>
                            {currency(_dataSummary?.bonusIncome || 0)} ກີບ
                            <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                          </span>
                        </li>
                      ) : null}

                      {_dataSummary?.diligentIncome !== 0 ? (
                        <li onClick={() => setDetailDiligent(_dataSummary?._id)}>
                          <strong>ເງິນຂະຫຍັນ</strong>
                          <span>
                            {currency(_dataSummary?.diligentIncome || 0)} ກີບ
                            <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                          </span>
                        </li>
                      ) : null}

                      {_dataSummary?.borrowExpense !== 0 ? (
                        <li
                          onClick={() => setDetailBorrow(_dataSummary?._id)}
                        >
                          <strong>ເງິນເບິກລ່ວງໜ້າ</strong>
                          <span>
                            {currency(_dataSummary?.borrowExpense || 0)} ກີບ
                            <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                          </span>
                        </li>
                      ) : null}

                      {_dataSummary?.deductionExpense !== 0 ? (
                        <li onClick={() => setDetailDeduct(_dataSummary?._id)}>
                          <strong>ເງິນຫັກ</strong>
                          <span>
                            {currency(_dataSummary?.deductionExpense || 0)} ກີບ
                            <i className="fa-solid fa-angle-right ms-1 text-secondary" />
                          </span>
                        </li>
                      ) : null}
                    </>
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
                      
                      <strong>ເງິນປະສິດທິພາບ</strong>
                      <span> <ReportCommission _startDate={startDate} _endDate={endDate} /> ກີບ</span>
                    </li>
                  )}
                  <li>
                    <strong>ຄ່າອາກອນ</strong>
                    <span>{currency(item?.taxIncome || 0)} ກີບ</span>
                  </li>
                  <li>
                    <strong>ເງິນປະກັນສັງຄົມ</strong>
                    <span>{currency(item?.InsuranceExpense || 0)} ກີບ</span>
                  </li>
                  <li>
                    <strong>ເງິນລວມທັງໝົດ</strong>
                    <span>
                      {currency(
                        _totalCommission +
                          item?.basicSalary +
                          item?.positionSalary -
                          (item?.InsuranceExpense + item?.taxIncome) || 0
                      )}{" "}
                      ກີບ
                    </span>
                  </li>
                  <li>
                    <strong>
                      <i className="fa-solid fa-money-bill-wave mr-1" />
                      ເງິນເດືອນທີ່ໄດ້
                    </strong>
                    {totalSummary > 0 ? (
                      <span className="text-success">
                        {currency(_dataSummary?.finalIncome || 0)} ກີບ
                      </span>
                    ) : (
                      <span className="text-danger">ຍັງບໍ່ສະຫຼຸບ</span>
                    )}
                  </li>
                  <div className="mb-3 mt-3">
                    {totalSummary > 0 ? (
                      <button
                        className="btn btn-success btn-block btn-xs rounded-pill"
                        onClick={() => _updateConfirmStatus(_dataSummary?._id)}
                      >
                        <i class="fa-regular fa-circle-check mr-1" />
                        ຢືັນຢັນເງິນເດືອນ
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-block btn-xs rounded-pill "
                        variant=""
                        onClick={() => history.push(`/commission/history/1`)}
                      >
                        <i className="fa-solid fa-angles-right me-2" />
                        ປະຫວັດເງິນເດືອນ
                      </button>
                    )}
                  </div>
                </ul>
              ))}
          </div>
        </div>
        <BottomNav/>
      </div>
      <DetailIBonusMoney _id={detailIBonus} onHide={() => setDetailIBonus()} />
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
