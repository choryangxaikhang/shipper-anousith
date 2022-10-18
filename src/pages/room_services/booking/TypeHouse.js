/* eslint-disable jsx-a11y/anchor-is-valid */
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  aws_url_images,
  currency,
  formatDateTime,
  getLocalHouse,
  ITEM_PER_PAGE,
  loadingData,
  paiStatus,
  setParams,
  socketServer,
} from "../../../helper";
import useReactRouter from "use-react-router";
import {
  HOUSE,
  UPDATE_BOOKING_STATUS,
} from "./apollo";
export default function TypeHouse({ getId }) {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  const [listData, setListData] = useState()
  const query = new URLSearchParams(location.search);
  const [queryHouse, { data: setData, loading: loadingId }] =
    useLazyQuery(HOUSE, { fetchPolicy: "cache-and-network" });
  // detail
  useEffect(() => {
    queryHouse({
      variables: {
        where: {
          _id: getId,
        },
        orderBy: "createdAt_DESC",
        limit: 1,
      },
    });
  }, [getId]);

  const getData = setData?.houses?.data[0];

  return (
    <>
        <td classNameName="text-end text-black">
          {getData?.type?.title_lao ? getData?.type?.title_lao : "-"}
        </td>
    </>
  );
}