import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { OTHER } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import { QUERY_ROOM } from "./apollo";
import {
  currency,
  getLocalHouse,
  ITEM_PER_PAGE,
  socketServer,
} from "../../../helper";
import TypeRoom from "../../../helper/components/typeRoom";
export default function Hotel() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [loadData, setLoadData] = useState(false);
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageTotal, setPageTotal] = useState([1]);
  const [localHouse, setLocalHouse] = useState("");
  const [typeDataRoom, setTypeDataRoom] = useState({});
  console.log("typeDataRoom",typeDataRoom)
  const [listRoom, setListRoom] = useState();
  const [fetchDataRoom, { data: setDataRoom, loading: loadingDataRoom }] =
    useLazyQuery(QUERY_ROOM, { fetchPolicy: "cache-and-network" });
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  console.log("localHouse", localHouse);

  console.log("setDataRoom", setDataRoom);

  useEffect(() => {
    fetchDataRoom({
      variables: {
        where: {
          //   house: localHouse,
          //   _id: listRoom?._id ? listRoom?._id : undefined,
          //   status: "FEE"
        },
        skip: listRoom ? 0 : numberRows * (numberPage - 1),
        limit: listRoom ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse, loadData, listRoom]);
  //pageination
  const countData = setDataRoom?.rooms?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRows); i++) {
    countPage.push(i);
  }

  socketServer.on("approveBooking", (res) => {
    if (res === localHouse) {
      //   newSound.play();
      setLoadData(!loadData);
    }
  });
  socketServer.on("approveCheckOut", (res) => {
    if (res === localHouse) {
      //   newSound.play();
      setLoadData(!loadData);
    }
  });

  return (
    <>
      <div className="appHeader text-light border-0 mr-0">
        <div style={{ flex: 1 }} className="text-left">
          <button
            className="btn text-white"
            onClick={() => history.push(OTHER)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        ເປີດໂຮມແຮມ
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className="container" style={{ marginTop: 60 }}>
        <div className="option-section">
          <div className="col-md-6 mt-2">
            <div className="form-group mb-2">
              <TypeRoom
                size={"lg"}
                getData={(data) => {
                  setTypeDataRoom(data);
                }}
                defaultValue={typeDataRoom?.title_lao}
              />
            </div>
          </div>
          <div className="row col-md-12  ms-3">
            {setDataRoom?.rooms?.data?.map((data, index) => (
              <>
                <div
                  className="col-5 card mb-1 ms-1"
                  style={{
                    // marginLeft:0.1,
                    backgroundColor:
                      data?.status === "FULL" ? "#fcd98d" : "#fcd98d",
                  }}
                >
                  <div className="option-card">
                    <a
                      href="javascript:void(0)"
                      data-bs-toggle="modal"
                      data-bs-target="#withdraw"
                    >
                      <p style={{ borderBottom: "1px solid #c7c2b9" }}>
                        {data?.title_lao} / {data?.title_eng}
                      </p>
                      <div className="option-card-icon">
                        <p>{data?.typeRoom?.title_lao}</p>
                        {currency(data?.priceFull)} /{" "}
                        {currency(data?.priceHalf)}
                      </div>
                    </a>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
