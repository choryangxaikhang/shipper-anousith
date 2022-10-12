import { useLazyQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import Notiflix from "notiflix";
import React, { useContext, useEffect, useState } from "react";
import {
  createdAt_gte,
  createdAt_lt,
  currency,
  currentDate,
  loadingData,
} from "../../../helper";
import { QUERY_EXTRA_EXPENSE } from "../apollo";
export default function SummaryExpense({
  branchID,
  startDate,
  endDate,
}) {
  
  const [queryExtraExpense, { data: extraExpense, loading }] =
    useLazyQuery(QUERY_EXTRA_EXPENSE, {
      fetchPolicy: "cache-and-network",
    })

  useEffect(() => {
    queryExtraExpense({
      variables: {
        where: {
          branch_id: parseInt(branchID),
        },
        orderBy: "createdAt_DESC",
      }
    })
  }, [branchID, startDate, endDate])

  const summaryExpense=_.sumBy(extraExpense?.extraExpenses?.data, 'expenseKIP');
  return (
    <React.Fragment>
      {loading ? (
        loadingData(10)
      ) : (
        <span className="text-danger">
          {summaryExpense?currency(summaryExpense) : 0} ກີບ
        </span>
      )}
    </React.Fragment>
  )
}
