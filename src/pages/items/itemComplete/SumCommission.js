/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { currency, getStaffLogin } from "../../../helper";
import BottomNav from "../../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import { QUERY_COMMISSION } from "../../home/apollo";

export default function SumCommission({ startDate, endDate }) {
  const [_item, setResult] = useState({});
  const userInfo = getStaffLogin();

  const [fetchData, { data: result }] = useLazyQuery(QUERY_COMMISSION, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          shipper: parseInt(userInfo?._id),
          dateBetween: [startDate, endDate],
        },
        orderBy: "DESC",
        limit: 0,
      },
    });
  }, [startDate, endDate]);

  useEffect(() => {
    setResult(result?.summariesShippers);
  }, [result]);

  const totalGeneral = _item?.sent?.general?.total;
  let _general = parseInt(_item?.sent?.general?.commission);
  const totalNear = _item?.sent?.near?.total;
  let _near = parseInt(_item?.sent?.near?.commission);
  const totalFar = _item?.sent?.farAway?.total;
  let farAway = parseInt(_item?.sent?.farAway?.commission);
 const amount = _general + _near + farAway;

  return (
    <>
      <div className="container-min">
          <div>
            ໄລຍະໃກ້:  {currency(totalNear) || 0}/ {currency(_near || 0)}
          </div>
          <div>
            ໄລຍະທົ່ວໄປ: {currency(totalGeneral) || 0}/{currency(_general || 0)}
          </div>
          <div>
            ໄລຍະໄກ: {currency(totalFar || 0)}/{currency(farAway|| 0)}
          </div>
          <div>
            ລວມ: {currency(amount || 0)}
          </div>
      </div>
    </>
  );
}
