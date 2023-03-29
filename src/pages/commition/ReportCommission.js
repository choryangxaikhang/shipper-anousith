import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_ITEM } from "./apollo";
import { currency, getStaffLogin } from "../../helper";
export default function ReportCommission({_startDate, _endDate}) {
  const userLogin = getStaffLogin();
  const [Total, setTotal] = useState();
  const [allTotal, setAllTotal] = useState();
  const [fetchItem, { data }] = useLazyQuery(QUERY_ITEM, {
    fetchPolicy: "cache-and-network",
  });
  const [ShipperItem, { data: ShipperData }] = useLazyQuery(QUERY_ITEM, {
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    fetchItem({
      variables: {
        where: {
          shipper: userLogin?._id,
          itemStatus: "COMPLETED",
          deliveryCompletedDateBetween: [_startDate, _endDate]
        },
      },
    });
    ShipperItem({
      variables: {
        where: {
          shipper: userLogin?._id,
          assignedShipperDateBetween: [_startDate, _endDate]
        },
      },
    });
  }, [fetchItem, ShipperItem, _startDate, _endDate]);

  console.log(userLogin);
  
  useEffect(() => {
    setTotal(data?.items?.total || 0);
    setAllTotal(ShipperData?.items?.total || 0);
  }, [data]);
 
  let _Total = parseInt(Total * 100);
  let _allTotal = parseInt(_Total / allTotal);

  let money = 0;

  if (_allTotal >= 85) {
    money = 200000;
  } else if (_allTotal >= 84){
    money = 150000;
  } else if (_allTotal === 80){
    money = 100000;
  } else if (_allTotal <= 79){
    money = -100000;
  } 
  return (
    <> 
      <span>{currency(allTotal)}/</span>
      <span>{currency(Total)}/</span>
      <span>{currency(money)}</span>
    </>
  );
}
