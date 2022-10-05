/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageConfirm,
  messageError,
  messageSuccess,
  valiDate,
} from "../../../helper";
import { useFormik } from "formik";
import * as Yup from "yup";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";
import Notiflix, { Loading } from "notiflix";
import { CREATE_TYPE, DELETE, QUERY_TYPE_HOUSE } from "./apollo";
import { Row } from "react-bootstrap";
import EditType from "./editType";
import AddTypeRoom from "./addType";
export default function TypeHouse() {
  const [numberRows, setNumberRows] = useState(ITEM_PER_PAGE);
  const { history, location, match } = useReactRouter();
  const userState = getStaffLogin();
  const userData = userState?.data;
  const numberPage = match?.params?.page;
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [createType] = useMutation(CREATE_TYPE);
  const [_deleteType] = useMutation(DELETE);

  const [fetchData, { data: setData, loading }] = useLazyQuery(
    QUERY_TYPE_HOUSE,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          title_lao: String(searchValue),
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, searchValue, numberPage, newLoadData]);
  const countData = setData?.TypeHouses?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRows); i++) {
    countPage.push(i);
  }
  const _onChangeRows = (e) => {
    let _value = e?.target?.value;
    history.push(`?rows=${_value}`);
    setNumberRows(parseInt(_value));
  };
  const _delete = (id) => {
    messageConfirm("ທ່ານຕ້ອງການລືບ ແທ້ ຫຼື ບໍ່?", async () => {
      Loading.dots();
      try {
        const { data: _deleteData } = await _deleteType({
          variables: {
            where: {
              _id: id,
            },
          },
        });
        if (_deleteData) {
          Notiflix.Loading.remove();
          messageSuccess("ການດຳເນີນງານສຳເລັດແລ້ວ");
          setNewLoadData(!newLoadData);
        } else {
          messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
      }
    });
  };

  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ຈັດການຂໍ້ມູນປະເພດກິດຈະການ</h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-xl-4 mb-3 mb-xl-0">
              <AddTypeRoom
                onSuccess={() => {
                  setNewLoadData(!newLoadData);
                }}
              />
            </div>
            <div className="col-xl-8 mb-3 mb-xl-0">
              <div className="card h-100">
                <div className="card-body">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-1 ml-1">
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
                  <div className="content__wrap order-2 flex-fill min-w-0">
                    <div className="row">
                      <div className="table-responsive">
                        <table className="table table-striped table-sm">
                          <thead>
                            <tr>
                              <th className="text-nowrap">ລຳດັບ</th>
                              <th className="text-nowrap">
                                ປະເພດກິດຈະການ (ພາສາລາວ)
                              </th>
                              <th className="text-nowrap">
                              ປະເພດກິດຈະການ (ພາສາອັງກິດ)
                              </th>
                              <th className="text-nowrap text-center">
                                ຈັດການ
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {setData?.typeHouses?.data &&
                              setData?.typeHouses?.data?.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    {data?.title_lao ? data?.title_lao : "-"}
                                  </td>
                                  <td>
                                    {data?.title_eng ? data?.title_eng : "-"}
                                  </td>
                                  <td className="text-nowrap text-end">
                                    <div className="btn-group">
                                      <EditType
                                        getId={data}
                                        onSuccess={() => {
                                          setNewLoadData(!newLoadData);
                                        }}
                                      />
                                      <button
                                        className="btn btn-primary btn-ms"
                                        onClick={() => _delete(data?._id)}
                                      >
                                        <i className="icon-trash" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <PaginationController
                        routes={`/managementhouse/type_room`}
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
        </div>
      </div>
    </>
  );
}
