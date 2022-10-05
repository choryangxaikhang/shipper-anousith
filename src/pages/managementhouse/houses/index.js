/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  houseStatus,
  ITEM_PER_PAGE,
  loadingData,
  messageConfirm,
  messageError,
  messageSuccess,
  // messageError,
  // messageSuccess,
} from "../../../helper";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";
import { DELETE_HOUSE, QUERY_HOUSE } from "./apollo";
import { USER_KEY } from "../../../Routes/app";
import AddHouses from "./addHouse";
import EditHouse from "./editHouse";
import Notiflix, { Loading } from "notiflix";
export default function Houses() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState("");
  const jsonObj = JSON.parse(localStorage.getItem(USER_KEY));
  const userInfo = jsonObj?.data;
  const [loadData, setLoadData] = useState(false);
  const [provinceData, setProvinceData] = useState("");
  const [deleteHouse] = useMutation(DELETE_HOUSE);
  const [fetchData, { data: setData, loading }] = useLazyQuery(QUERY_HOUSE, {
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          houseName: String(searchValue),
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, searchValue, numberPage, loadData, provinceData]);
  const _deleteHouse = (id) => {
    messageConfirm("ທ່ານຕ້ອລືບ ແທ້ ຫຼື ບໍ່?", async () => {
      Loading.dots();
      try {
        const { data: _deleteData } = await deleteHouse({
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
  //pageination
  const countData = setData?.houses?.total;
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
  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ຈັດການຂໍ້ມູນກິດຈະການ</h3>
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
                      <AddHouses
                        onSuccess={() => {
                          setLoadData(!loadData);
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
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ປະເພດກິດຈະການ</th>
                          <th className="text-nowrap">ຊື່ກິດຈະການ</th>
                          <th className="text-nowrap">ແຂວງ</th>
                          <th className="text-nowrap">ເມືອງ</th>
                          <th className="text-nowrap">ບ້ານ</th>
                          <th className="text-nowrap"> ເວລາເປີດ</th>
                          <th className="text-nowrap text-center">ຈັດການ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {setData?.houses?.data &&
                          setData?.houses?.data?.map((data, index) => (
                            <tr key={index}>
                              <td>{NO(index)}</td>
                              <td>
                              <i class="fa-solid fa-city me-2" />
                                {data?.type?.title_lao ? data?.type?.title_lao : "-"}</td>
                              <td>{data?.houseName ? data?.houseName : "-"}</td>
                              <td>
                                {data?.province?.provinceName
                                  ? data?.province?.provinceName
                                  : "-"}
                              </td>
                              <td>
                                {data?.district?.title
                                  ? data?.district?.title
                                  : "-"}
                              </td>
                              <td>
                                {data?.village?.title
                                  ? data?.village?.title
                                  : "-"}
                              </td>
                              <td>{data?.powerTime ? data?.powerTime : "-"}</td>
                              <td className="text-end">
                                {userInfo?.role === "IT" ||
                                  userInfo?.role === "SUPER_ADMIN" ? (
                                  <div className="btn-group">
                                    <EditHouse
                                      data={data}
                                      onSuccess={() => {
                                        setLoadData(!loadData);
                                      }}
                                    />
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => _deleteHouse(data?._id)}
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
                    routes={`/managementhouse/houses`}
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
