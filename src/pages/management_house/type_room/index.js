/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  loadingScreen,
  messageConfirm,
  messageError,
  messageSuccess,
  setParams,
  valiDate,
} from "../../../helper";
import { useFormik } from "formik";
import Notiflix, { Loading } from "notiflix";
import { CREATE_TYPE, DELETE, QUERY_TYPE_ROOM } from "./apollo";
import { Row } from "react-bootstrap";
import EditType from "./editType";
import Pagination from "../../../helper/controllers/Pagination";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  setRef,
} from "@mui/material";
import NoData from "../../../helper/components/NoData";
import AddTypeRoom from "./AddTypeRoom";
export default function TypeRoom() {
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
    QUERY_TYPE_ROOM,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          title_lao: searchValue ? searchValue : undefined,
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, searchValue, numberPage, newLoadData]);

  const countData = setData?.typeRooms?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRows); i++) {
    countPage.push(i);
  }

  const _delete = (id) => {
    messageConfirm("ທ່ານຕ້ອງການລືບ ແທ້ ຫຼື ບໍ່?", async () => {
      loadingScreen();
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
          messageSuccess("ລືບສຳເລັດ");
          setNewLoadData(!newLoadData);
        } else {
          messageError("ລືບບໍ່ສຳເລັດ");
        }
      } catch (error) {
        console.log(error);
        Notiflix.Loading.remove();
        messageError("ຂໍ້ມູນຜີດພາດ");
      }
    });
  };
  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ຈັດການຂໍ້ມູນປະເພດຫ້ອງ</h3>
        </div>
      </div>
      {/* data */}
      <div className="section">
        <div className="transactions" style={{ marginTop: 30 }}>
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
                placeholder="ປ້ອນປະເພດຫ້ອງພາສາລາວຄົ້ນຫາ"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="text-center">{loading ? loadingData(25) : ""}</div>
          {setData?.typeRooms?.total > 0 ? (
            <div className="listView mt-2">
              {setData?.typeRooms?.data?.map((data, index) => (
                <>
                  <b
                    className="float-end"
                    style={{ marginTop: -8, marginRight: -10 }}
                  >
                    <i
                      className="fa-solid fa-trash"
                      onClick={(e) => {
                        _delete(data?._id);
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
                        <strong>ປະເພດຫ້ອງລາວ: {data?.title_lao}</strong>
                        <strong>ປະເພດຫ້ອງອັງກິດ: {data?.title_eng}</strong>
                      </div>
                    </div>
                    <div className="right">
                      <EditType
                        getId={data}
                        onSuccess={(e) => {
                          setNewLoadData(!newLoadData);
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
          <AddTypeRoom
            onSuccess={(e) => {
              setNewLoadData(!newLoadData);
            }}
          />
        </div>
      </div>
    </>
  );
}
