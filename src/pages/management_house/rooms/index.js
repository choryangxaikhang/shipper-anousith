/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  formatDateTime,
  userStatus,
  ITEM_PER_PAGE,
  loadingData,
  messageConfirm,
  messageError,
  messageSuccess,
  currency,
  getLocalHouse,
  getStaffLogin,
  setParams,
} from "../../../helper";
import { DELETE_ROOM, QUERY_ROOM } from "./apollo";
import AddRooms from "./addRooms";
import EditRooms from "./editRooms";
import Notiflix, { Loading } from "notiflix";
import Pagination from "../../../helper/controllers/Pagination";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import NoData from "../../../helper/components/NoData";
export default function Rooms() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState("");
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  const [localHouse, setLocalHouse] = useState("");
  const [loadData, setLoadData] = useState(false);
  const [provinceData, setProvinceData] = useState("");
  const [deleteRoom] = useMutation(DELETE_ROOM);
  const [fetchData, { data: setData, loading }] = useLazyQuery(QUERY_ROOM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);

  // let _where = {
  //   title_lao: String(searchValue),
  //   house: parseInt(localHouse),
  // };

  // if(userInfo?.role === "SUPER_ADMIN"){
  //   delete _where.house
  // }

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          title_lao: String(searchValue),
          house: parseInt(localHouse),
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberRows,
    searchValue,
    numberPage,
    loadData,
    provinceData,
    setData,
    localHouse,
  ]);

  //pageination
  const countData = setData?.rooms?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRows); i++) {
    countPage.push(i);
  }
  const NO = (index) => {
    const no = numberRows * numberPage - numberRows;
    if (numberRows > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
  };

  const _deleteRoom = (id) => {
    messageConfirm("ທ່ານຕ້ອລືບ ແທ້ ຫຼື ບໍ່?", async () => {
      Loading.dots();
      try {
        const { data: _deleteData } = await deleteRoom({
          variables: {
            where: {
              _id: id,
            },
          },
        });
        if (_deleteData) {
          Notiflix.Loading.remove();
          messageSuccess("ລືບຂໍ້ມູນສຳເລັດແລ້ວ");
          setLoadData(!loadData);
        } else {
          messageError("ລືບຂໍ້ມູນບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        messageError("ລືບຂໍ້ມູນຜິດພາດ");
      }
    });
  };

  return (
    <>
      <div className="section" style={{ marginTop: 50 }}>
        <div className="transactions mt-2">
          <div className="row">
            <FormControl fullWidth sx={{ m: 0 }}>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <i className="fa-solid fa-magnifying-glass" />
                  </InputAdornment>
                }
                onWheel={(e) => e.target.blur()}
                type="search"
                placeholder="ຄົ້ນຫາ..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="text-center">{loading ? loadingData(25) : ""}</div>
          {setData?.rooms?.total > 0 ? (
            <div className="listView mt-2">
              {setData?.rooms?.data?.map((data, index) => (
                <>
                  <b
                    className="float-end"
                    style={{ marginTop: -8, marginRight: -10 }}
                  >
                    <i
                      className="icon-trash text-danger"
                      onClick={(e) => {
                        _deleteRoom(data?._id);
                      }}
                      style={{ fontSize: 20, color: "#9c9695" }}
                    ></i>
                  </b>
                  <a
                    href="javascript:void(0)"
                    className="item pr-0 "
                    key={index}
                  >
                    <div className="detail col-md-10">
                      <div>
                        <strong>
                          ເບີຫ້ອງ: {data?.title_lao ? data?.title_lao : "-"}/
                          {data?.title_eng ? data?.title_eng : "-"}
                        </strong>
                        <b className="colors">
                          ລາຄາ:{" "}
                          {currency(data?.priceFull ? data?.priceFull : "-")} /{" "}
                          {currency(data?.priceFull ? data?.priceFull : "-")}
                        </b>
                        <br />
                        <b className="colors">
                          ປະເພດຫ້ອງ:{" "}
                          {currency(data?.priceFull ? data?.priceFull : "-")}
                        </b>
                        <br />
                        <b className="colors">
                          ລາຍລະອຽດ: {data?.detail ? data?.detail : "-"}
                        </b>
                      </div>
                    </div>
                    <div className="right">
                      <EditRooms
                        data={data}
                        loadData={loadData}
                        onSuccess={(item) => {
                          setLoadData(item);
                        }}
                      />
                    </div>
                  </a>
                </>
              ))}
            </div>
          ) : (
            <NoData loading={loading} />
          )}
          {setData?.typeRooms?.total > 100 && (
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
        <div
          style={{
            position: "fixed",
            // bottom: 1,
            backgroundColor: "#edece8",
            zIndex: 99999,
          }}
          className="col-md-12 appBottomMenu"
        >
          <AddRooms
            loadData={loadData}
            onSuccess={(item) => {
              setLoadData(item);
            }}
          />
        </div>
      </div>
    </>
  );
}
