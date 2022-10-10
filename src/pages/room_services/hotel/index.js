import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import { ROOM_SERVICES } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import { QUERY_ROOM } from "./apollo";
import {
  currency,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  setParams,
  socketServer,
} from "../../../helper";
import TypeRoom from "../../../helper/components/typeRoom";
import CheckIn from "./CheckIn";
import SearchTypeRoom from "../../../helper/components/SearchTypeRoom";
import NoData from "../../../helper/components/NoData";
import SearchRoomFee from "../../../helper/components/SearchRoomFee";
import Pagination from "../../../helper/controllers/Pagination";
import SelectLocalHouse from "../../../helper/components/SelectLocalHouse";
export default function Hotel() {
  const { history, location, match } = useReactRouter();
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [loadData, setLoadData] = useState(false);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [localHouse, setLocalHouse] = useState("");
  const [typeDataRoom, setTypeDataRoom] = useState({});
  const [searchValue, setSearchValue] = useState();
  const [clickButton, setButton] = useState(false);
  const [userData, setUserData] = useState({});

  const [house, setHouse] = useState("");
  //!ໂມໂດເປີດຫ້ອງ
  const [getData, setModal] = useState();
  const [openModal, CloseModal] = useState(false);
  const CloseModalChange = () => CloseModal(false);
  const [fetchDataRoom, { data: setDataRoom, loading: loadingDataRoom }] =
    useLazyQuery(QUERY_ROOM, { fetchPolicy: "cache-and-network" });
  // useEffect(() => {
  //   setLocalHouse(getLocalHouse()?._id);
  // }, []);

  // data HouseLoca
  useEffect(() => {
    const _local = getStaffLogin();
    setUserData(_local?.data || {});
    setLocalHouse(getLocalHouse());
    //sidebar min
    const localSideBarMini = localStorage.getItem("SIDEBAR_MINI");
    if (localSideBarMini === "true") {
      document.body.classList.add("sidebar-collapse");
    }
  }, []);
  // end

  useEffect(() => {
    fetchDataRoom({
      variables: {
        where: {
          house: localHouse?._id,
          typeRoom: typeDataRoom?._id ? typeDataRoom?._id : undefined,
          title_lao: searchValue ? searchValue : undefined,
          status: "FEE",
        },
        skip: numberRow * (numberPage - 1),
        limit: numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse, loadData, typeDataRoom, searchValue, numberRow, numberPage]);

  //ຟັນຊັ່ນເປີດຫ້ອງ
  const _onClick = (e) => {
    setModal(e);
    CloseModal(true);
  };

  // pagination
  useEffect(() => {
    const page = query.get("page");
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(100);
    }
  }, [query]);
  const countPage = [];
  for (var i = 1; i <= Math.ceil(setDataRoom?.rooms?.total / numberRow); i++) {
    countPage.push(i);
  }

  socketServer.on("approveBooking", (res) => {
    if (res === localHouse?._id) {
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
            onClick={() => history.push(ROOM_SERVICES)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        {clickButton === true ? (
          <>
            <SelectLocalHouse
              style={{ width: "100%" }}
              value={localHouse?._id}
              onChange={(obj) => {
                if (obj?._id) {
                  setLocalHouse(obj);
                  localStorage.setItem("HOUSE", JSON.stringify(obj));
                  window.location.reload();
                }
              }}
              ownerId={userData?._id}
            />
          </>
        ) : (
          <b className="text-white">ເປີດບ້ານພັກ</b>
        )}
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        >
          <button
            className="btn text-white"
            onClick={(e) => {
              setButton(!clickButton);
            }}
          >
            <i className="fa-solid fa-magnifying-glass fa-2 ms-2" />
          </button>
        </div>
      </div>

      <div className=" body-content-lg ms-1 me-1 " style={{ marginTop: 50 }}>
        <div className="option-section">
          <br />
          <div className="row col-md-12  ms-3 mt-4">
            <div
              className="col-6"
              style={{
                position: "fixed",
                right: 0.1,
                zIndex: 100,
                top: 57,
              }}
            >
              <div className="option-card">
                <input
                  type="search"
                  className="form-control form-control-lg text-black"
                  placeholder="ຄົ້ນຫາຫ້ອງ"
                  value={searchValue}
                  style={{ border: " 1px solid #cccfc8" }}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div
              className="col-6 "
              style={{
                position: "fixed",
                left: 0.1,
                zIndex: 100,
                top: 57,
              }}
            >
              <div className="option-card">
                <SearchTypeRoom
                  style={{ height: "100%", backgroundColor: "red" }}
                  value={typeDataRoom?._id}
                  onChange={(obj) => {
                    setTypeDataRoom(obj);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="option-section">
          <div className="row gx-2">
            {setDataRoom?.rooms?.total > 0 ? (
              <>
                {setDataRoom?.rooms?.data?.map((data, index) => (
                  <>
                    <div className="col-6 mt-1">
                      <div
                        className="card border"
                        style={{ backgroundColor: "#f0edeb" }}
                        onClick={() => _onClick(data?._id)}
                        key={index}
                      >
                        <div className="border-bottom text-black text-center">
                          {data?.title_lao} / {data?.title_eng}
                        </div>
                        <div
                          className="card-body text-black"
                          style={{ marginTop: -10 }}
                        >
                          <b style={{ color: "#949492" }}>
                            {data?.typeRoom?.title_lao}
                          </b>
                          <br />
                          <b>
                            {currency(data?.priceFull)} /{" "}
                            {currency(data?.priceHalf)}
                          </b>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <NoData loading={loadingDataRoom} />
            )}
            {setDataRoom?.rooms?.total > 100 && (
              <Pagination
                className="mt-2"
                pageTotal={countPage}
                currentPage={numberPage}
                onPageChange={(page) => {
                  history.push({
                    search: setParams(`page`, page),
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
      <CheckIn
        getId={getData}
        OpenModalChange={openModal}
        CloseModalChange={CloseModalChange}
        onSuccess={(value) => {
          CloseModalChange();
          setLoadData(!loadData);
        }}
      />
    </>
  );
}
