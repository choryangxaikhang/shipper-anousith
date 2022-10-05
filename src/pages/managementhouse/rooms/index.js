/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  formatDateTime,
  getStatus,
  ITEM_PER_PAGE,
  loadingData,
  messageConfirm,
  messageError,
  messageSuccess,
  currency,
  getLocalHouse,
} from "../../../helper";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";
import { DELETE_ROOM, QUERY_ROOM } from "./apollo";
import { USER_KEY } from "../../../Routes/app";
import AddRooms from "./addRooms";
import EditRooms from "./editRooms";
import Notiflix, { Loading } from "notiflix";
export default function Rooms() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState("");
  const jsonObj = JSON.parse(localStorage.getItem(USER_KEY));
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
  }, [numberRows, searchValue, numberPage, loadData, provinceData, setData,localHouse]);

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
  const _onChangeRows = (e) => {
    let _value = e?.target?.value;
    history.push(`?rows=${_value}`);
    setNumberRows(parseInt(_value));
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
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ຈັດການຂໍ້ມູນຫ້ອງ</h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-2">
                      <AddRooms
                        loadData={loadData}
                        onSuccess={(item) => {
                          setLoadData(item);
                        }}
                      />
                    </div>
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-1">
                          <span>{loading ? loadingData(25) : ""}</span>
                        </div>
                        <LimitData
                          numberRows={numberRows}
                          onChangeRows={_onChangeRows}
                          onSearch={(_onSearch) => {
                            setSearchValue(_onSearch);
                          }}
                          numberPage={numberPage}
                          total={countData}
                          col={1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap text-center">#</th>
                          <th className="text-nowrap">ຫ້ອງ (ພາສາລາວ)</th>
                          <th className="text-nowrap">ຫ້ອງ (ພາສາອັງກິດ)</th>
                          <th className="text-nowrap">ຊື່ກິດຈະການ</th>
                          <th className="text-nowrap">ປະເພດຫ້ອງ</th>
                          <th className="text-nowrap"> ລາຄາເຕັມ</th>
                          <th className="text-nowrap">ສ່ວນຫຼຸບ</th>
                          <th className="text-nowrap text-center">ສະຖານະ</th>
                          <th className="text-nowrap text-center text-center">
                            ວັນທີ່ສ້າງ
                          </th>
                          <th className="text-nowrap text-center">ຈັດການ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {setData?.rooms?.data &&
                          setData?.rooms?.data?.map((data, index) => (
                            <tr key={index}>
                              <td className="text-center">{NO(index)}</td>
                              <td className="text-nowrap text-left">
                                {data?.title_lao ? data?.title_lao : "-"}
                              </td>
                              <td className="text-nowrap text-leftr">
                                {data?.title_eng ? data?.title_eng : "-"}
                              </td>
                              <td>
                                {data?.house?.houseName
                                  ? data?.house?.houseName
                                  : "-"}
                              </td>
                              <td className="text-nowrap">
                                {data?.typeRoom?.title_lao
                                  ? data?.typeRoom?.title_lao
                                  : "-"}
                              </td>
                              <td className="text-nowrap text-end">
                                {data?.priceFull
                                  ? currency(data?.priceFull)
                                  : "-"}{" "}
                                ກີບ
                              </td>
                              <td className="text-nowrap text-end">
                                {data?.priceHalf
                                  ? currency(data?.priceHalf)
                                  : "-"}{" "}
                                ກີບ
                              </td>
                              <td className="text-nowrap text-center">
                                {getStatus(data?.status ? data?.status : "-")}
                              </td>
                              <td className="text-nowrap text-center">
                                {formatDateTime(
                                  data?.createdAt ? data?.createdAt : "-"
                                )}
                              </td>
                              <td className="text-nowrap text-end">
                                {userInfo?.role === "IT" ||
                                  userInfo?.role === "SUPER_ADMIN" ? (
                                  <div className="btn-group">
                                    <EditRooms
                                      data={data}
                                      loadData={loadData}
                                      onSuccess={(item) => {
                                        setLoadData(item);
                                      }}
                                    />
                                    <span className="vr" />
                                    <button
                                      className="btn btn-sm  btn-primary"
                                      onClick={() => _deleteRoom(data?._id)}
                                    >
                                      <i className="fas fa-trash" />
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationController
                    routes={`/managementhouse/rooms`}
                    numberRows={numberRows}
                    numberPage={numberPage}
                    countPage={countPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
