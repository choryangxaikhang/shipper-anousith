/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  currency,
  equimentStatus,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  loadingScreen,
  messageConfirm,
  messageError,
  messageSuccess,
  setParams,
} from "../../../../helper";
import {
  CREATE_TYPE,
  DELETE_EQUIMENT,
  QUERY_EQUIMENT,
  EDIT_EQUIMENT,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import Pagination from "../../../../helper/controllers/Pagination";
import LimitData from "../../../../helper/controllers/LimitData";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import NoData from "../../../../helper/components/NoData";
import AddData from "./AddData";
import EditData from "./EditData";

export default function EquiMent() {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  // get query search
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [searchValue, setSearchValue] = useState();
  const [addNew, setAddNew] = useState(true);
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [queryType, { data: setData, loading }] = useLazyQuery(QUERY_EQUIMENT, {
    fetchPolicy: "cache-and-network",
  });

  const [editType] = useMutation(EDIT_EQUIMENT);
  const [deleteEquiment] = useMutation(DELETE_EQUIMENT);

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    queryType({
      variables: {
        where: {
          title: searchValue,
          house: localHouse,
        },
        skip: searchValue ? 0 : numberRow * (numberPage - 1),
        limit: searchValue ? 1000 : numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRow, searchValue, numberPage, reloadData, localHouse]);

  //pageination
  const countData = setData?.equiments?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRow); i++) {
    countPage.push(i);
  }
  useEffect(() => {
    const page = query.get("page");
    if (page) {
      setNumberPage(parseInt(page));
    } else {
      setNumberRow(100);
    }
  }, [query]);

  const NO = (index) => {
    const no = numberRow * numberPage - numberRow;
    if (numberRow > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
  };

  const handleUpdate = async (id) => {
    const { data } = await editType({
      variables: {
        data: {
          title: String(newText),
        },
        where: {
          _id: parseInt(id),
        },
      },
    });

    if (data?.updateEquimentType?._id) {
      messageSuccess("ແກ້ໄຂສຳເລັດ");
      setNewText("");
      setReloadData(!reloadData);
      setEditStatus(false);
    } else {
      messageError("ແກ້ໄຂຜີີດພາດ");
      setNewText(text);
    }
  };

  const _delete = (id) => {
    messageConfirm("ທ່ານຕ້ອລືບ ແທ້ ຫຼື ບໍ່?", async () => {
      loadingScreen();
      try {
        const { data: _deleteData } = await deleteEquiment({
          variables: {
            where: {
              _id: id,
            },
          },
        });
        if (_deleteData) {
          Notiflix.Loading.remove();
          messageSuccess("ລືບຂໍ້ມູນສຳເລັດແລ້ວ");
          setReloadData(!reloadData);
        } else {
          messageError("ລືບຂໍ້ມູນບໍ່ສຳເລັດ");
        }
      } catch (error) {
        Notiflix.Loading.remove();
        messageError("ລືບຂໍ້ມູນຜິດພາດ");
        console.log(error);
      }
    });
  };

  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ລາຍງານຍອດການຈອງ</h3>
        </div>
      </div>
      <div className=" body-content-lg" style={{ marginTop: 30 }}>
        <div className="option-section">
          <div className="row col-md-12  mt-4">
            <div className="option-card">
              <FormControl fullWidth sx={{ m: 0 }}>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <i className="fa-solid fa-magnifying-glass" />
                    </InputAdornment>
                  }
                  type="search"
                  placeholder="ຄັ້ນຫາ"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </FormControl>
              <div className="option-section">
                <div className="row gx-2">
                  {setData?.equiments?.total > 0 ? (
                    <>
                      <span className="text-center mb-2">
                        {loading ? loadingData(25) : ""}
                      </span>
                      <div className="table-responsive">
                        <table className="table table-striped table-sm">
                          <thead>
                            <tr>
                              <th className="text-nowrap">ລຳດັບ</th>
                              <th className="text-nowrap">ຊື່ຊັບສິນ</th>
                              <th className="text-nowrap">ຫົວຫນ່ວຍ</th>
                              <th className="text-nowrap">ຂະນຫນາດ</th>
                              <th className="text-nowrap">ຍັງເຫລືອ</th>
                              <th className="text-nowrap">ລາຄາ</th>
                              <th className="text-nowrap text-center">
                                ຈັດການ
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {setData?.equiments?.data &&
                              setData?.equiments?.data?.map((data, index) => (
                                <tr key={index}>
                                  <td>{NO(index)}</td>
                                  <td className="text-nowrap">
                                    {data?.title ? data?.title : "-"}
                                  </td>
                                  <td>{data?.unit ? data?.unit : "-"}</td>
                                  <td>{data?.size ? data?.size : "-"}</td>
                                  <td>
                                    {currency(data?.price ? data?.price : "-")}
                                  </td>
                                  <td>
                                    {currency(data?.price ? data?.price : "-")}
                                  </td>
                                  <td className="text-end text-nowrap">
                                      <EditData
                                        data={data}
                                        onSuccess={() => {
                                          setReloadData(!reloadData);
                                        }}
                                      />
                                      <button
                                        className="btn btn-lg "
                                        onClick={() => _delete(data?._id)}
                                      >
                                        <i className="fas fa-trash" />
                                      </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <NoData loading={loading} />
                  )}
                  {setData?.equiments?.total > 100 && (
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
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            backgroundColor: "#f5f7f7",
          }}
          className="col-md-12 appBottomMenu"
        >
          <AddData
            onSuccess={(e) => {
              setReloadData(!reloadData);
            }}
          />
        </div>
      </div>
    </>
  );
}
