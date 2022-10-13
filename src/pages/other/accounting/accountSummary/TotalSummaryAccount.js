/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { QUERY_SUMMARY_ACCOUNT } from "./apollo";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  getLocalHouse,
  getUserLogin,
  loadingData,
} from "../../../../helper";
import _ from "lodash";
export default function TotalSummaryAccount({ startDate, endDate }) {
  const { history, location, match } = useReactRouter();
  const [localHouse, setLocalHouse] = useState("");
  const queryParams = new URLSearchParams(location?.search);
  const route = match?.params?.route;
  const [fetchData, { data: setData, loading: loading }] = useLazyQuery(
    QUERY_SUMMARY_ACCOUNT,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    let whereDate = {}
    if (startDate && endDate) {
      whereDate = {
        accountingDate_gte: createdAt_gte(startDate),
        accountingDate_lt: createdAt_lt(endDate),
      }
    } else {
      whereDate = {}
    }
    fetchData({
      variables: {
        where: {
          ...whereDate,
          house: localHouse,
        },
      },
    });
  }, [startDate, endDate,localHouse]);

  // summary Income
  const totalSummaryIncome = {
    incomeKIP: _.sumBy(setData?.accountingSummaries?.data, 'incomeKIP'),
    incomeTHB: _.sumBy(setData?.accountingSummaries?.data, 'incomeTHB'),
    incomeUSD: _.sumBy(setData?.accountingSummaries?.data, 'incomeUSD'),
  }
  // summaryExpense
  const totalSummaryExpress = {
    expenseKIP: _.sumBy(setData?.accountingSummaries?.data, 'expenseKIP'),
    expenseTHB: _.sumBy(setData?.accountingSummaries?.data, 'expenseTHB'),
    expenseUSD: _.sumBy(setData?.accountingSummaries?.data, 'expenseUSD'),
  }
  // summaryAlL
  const totalAllSummary = {
    endBalanceKIP: _.sumBy(setData?.accountingSummaries?.data, 'endBalanceKIP'),
    endBalanceTHB: _.sumBy(setData?.accountingSummaries?.data, 'endBalanceTHB'),
    endBalanceUSD: _.sumBy(setData?.accountingSummaries?.data, 'endBalanceUSD'),
  }
  return (
    <>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="card-body">
            {/* {userInfo.role === "SUPER_ADMIN" ||
              userInfo.role === "IT" ||
              userInfo.role === "ACCOUNTANT" ||
              userInfo.role === "FINANCE" ? ( */}
            <>
              <div className="card-group mb-3">
                <div className="card border"
                  style={{ backgroundColor: "#fffedb" }}
                >
                  <div className="p-2  border-bottom fs-4 text-black text-center">
                    ລາຍຮັບທັງຫມົດ
                  </div>
                  <div className="card-body text-black" >
                    <span>ເງິນກີບ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalSummaryIncome?.incomeKIP ? totalSummaryIncome?.incomeKIP : 0)
                      }
                      {" "}KIP
                    </span>

                    <br />
                    <span>ເງິນບາດ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalSummaryIncome?.incomeTHB ? totalSummaryIncome?.incomeTHB : 0)
                      }
                      {" "}
                      THB
                    </span>
                    <br />
                    <span>ເງິນໂດລາ:</span>

                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalSummaryIncome?.incomeUSD ? totalSummaryIncome?.incomeUSD : 0)
                      }
                      {" "}
                      USD
                    </span>
                    <br />
                  </div>
                </div>
                <div className="card border ms-1"
                  style={{ backgroundColor: "#fcf6f2" }}
                >
                  <div className="p-2  border-bottom fs-4 text-black text-center">
                    ລາຍຈ່າຍທັງຫມົດ
                  </div>
                  <div className="card-body text-black ">
                    <span>ເງິນກີບ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalSummaryExpress?.expenseKIP ? totalSummaryExpress?.expenseKIP : 0)
                      }
                      {" "}
                      KIP
                    </span>
                    <br />
                    <span>ເງິນບາດ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalSummaryExpress?.expenseTHB ? totalSummaryExpress?.expenseTHB : 0)
                      }
                      {" "}
                      THB
                    </span>
                    <br />
                    <span>ເງິນໂດລາ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalSummaryExpress?.expenseUSD ? totalSummaryExpress?.expenseUSD : 0)
                      }
                      {" "}
                      USD</span>

                  </div>
                </div>
                <div className="card border ms-1"
                  style={{ backgroundColor: "#daffd6" }}
                >
                  <div className="p-2  border-bottom fs-4 text-black text-center">
                    ຍອດຄົງເຫລືອທັງຫມົດ
                  </div>
                  <div className="card-body text-black">
                    <span>ເງິນກີບ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalAllSummary?.endBalanceKIP ? totalAllSummary?.endBalanceKIP : 0)
                      }
                      {" "}
                      KIP
                    </span>
                    <br />
                    <span>ເງິນບາດ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalAllSummary?.endBalanceTHB ? totalAllSummary?.endBalanceTHB : 0)
                      }
                      {" "}
                      THB
                    </span>
                    <br />
                    <span>ເງິນໂດລາ:</span>
                    <span className="pull-right">
                      {loading ? loadingData(25) :
                        currency(totalAllSummary?.endBalanceUSD ? totalAllSummary?.endBalanceUSD : 0)
                      }
                      {" "}
                      USD
                    </span>
                  </div>
                </div>
              </div>
            </>
            {/* ) : (
              ""
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
