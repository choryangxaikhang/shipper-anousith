import React, { useEffect } from "react";
import _ from "lodash";
import { getStaffLogin, currency} from "../../helper";
import { useLazyQuery } from "@apollo/client";
import { ITEM_DELIVERY_LOG, QUERY_ITEM } from "../home/apollo";

export default function EfficiencyCommission({ startDate, endDate }) {
  const useInfo = getStaffLogin();
  const [fetchAllItem, { data: resultAll }] = useLazyQuery(QUERY_ITEM, {
    fetchPolicy: "cache-and-network",
  });
  const [fetchItemSent, { data: resultItem }] = useLazyQuery(QUERY_ITEM, {
    fetchPolicy: "cache-and-network",
  });
  const [fetchItemCancel, { data: resultCancel }] = useLazyQuery(
    ITEM_DELIVERY_LOG,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    fetchItemCancel({
      variables: {
        where: {
          shipper: parseInt(useInfo?._id),
          dateBetween: [startDate, endDate],
        },
      },
    });
    fetchAllItem({
      variables: {
        where: {
          shipper: parseInt(useInfo?._id),
          assignedShipperDateBetween: [startDate, endDate],
        },
      },
    });

    fetchItemSent({
      variables: {
        where: {
          shipper: parseInt(useInfo?._id),
          itemStatus: "COMPLETED",
          deliveryCompletedDateBetween: [startDate, endDate],
        },
      },
    });
  }, [fetchAllItem, fetchItemCancel, fetchItemSent, startDate, endDate]);

  const totalAll = resultAll?.items?.total || 0;
  const totalItem = resultItem?.items?.total || 0;
  const totalCancel = resultCancel?.itemDeliveryLogs?.total || 0;

  let money = 0;
  let X = 0;
  let Y = 0;
   X = parseInt(totalItem) * 100;
   Y = X / totalAll;

   console.log("X",X,totalAll)

  if (Y >= 85) {
    money = 200000;
  } else if (Y >= 81) {
    money = 150000;
  } else if (Y === 80) {
    money = 100000;
  } else if (Y <= 79) {
    money = -100000;
  }

  return (
    <>
      <span>
        {currency(totalAll)}/ {currency(totalItem)}/ {currency(totalCancel)}/ {Y || 0}%/ {currency(money)} ກີບ
      </span>
    </>
  );
}
