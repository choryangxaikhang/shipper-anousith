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
  messageWarning,
  setParams,
} from "../../../../helper";
import {
  CREATE_TYPE,
  DELETE_EQUIMENT,
  QUERY_EQUIMENT,
  EDIT_EQUIMENT,
  QUERY_BILL,
  CREATE_EQUIMENT_OUT,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import Pagination from "../../../../helper/controllers/Pagination";
import LimitData from "../../../../helper/controllers/LimitData";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import NoData from "../../../../helper/components/NoData";
import AddData from "./AddData";
import EditData from "./EditData";
import Detail from "./Detail";
import { OTHER, TAB_EQUIMENT } from "../../../../routes/app";
import _ from "lodash";
import SearchEquimentType from "../../../../helper/components/SearchEquimentType";
import CheckOutOrder from "./CheckOutOrder";
import ListEquimentOut from "./ListEquimentOut";
export default function EquiMent() {
  const { history, location, match } = useReactRouter();
  const getId = match?.params?._id;
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  // get query search
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [searchValue, setSearchValue] = useState();
  const [reloadData, setReloadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [detail, setDetail] = useState();

  // end
  const [listEquimentType, setListEquimentType] = useState("");
  const [queryType, { data: setData, loading }] = useLazyQuery(QUERY_EQUIMENT, {
    fetchPolicy: "cache-and-network",
  });

  const [deleteEquiment] = useMutation(DELETE_EQUIMENT);
  const [upDateStock] = useMutation(EDIT_EQUIMENT);

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);
  useEffect(() => {
    queryType({
      variables: {
        where: {
          title: searchValue,
          house: localHouse?._id,
          equimentType: listEquimentType?._id
            ? listEquimentType?._id
            : undefined,
        },
        skip: searchValue ? 0 : numberRow * (numberPage - 1),
        limit: searchValue ? 1000 : numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [
    numberRow,
    searchValue,
    numberPage,
    reloadData,
    localHouse,
    listEquimentType,
  ]);
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
      <div style={{ marginTop: -90 }}>
        <div id="appCapsule">
          <div className="justify-content-md-center">
            <div className="appHeader text-light border-0">
              <div style={{ flex: 1 }} className="text-left">
                {getId >= 2 ? (
                  <button
                    className="btn text-white"
                    onClick={() =>
                      history.push(`/other/equiment/Type?tab=equiment`)
                    }
                  >
                    <i className="fa fa-chevron-left fs-4" />
                  </button>
                ) : (
                  <>
                    <button
                      className="btn text-white"
                      onClick={() => history.push(OTHER)}
                    >
                      <i className="fa fa-chevron-left fs-4" />
                    </button>
                  </>
                )}
              </div>
              {getId >= 2 ? <>ເບິກຊັບສິນ</> : <>
              {localHouse?.houseName ? localHouse?.houseName : "ລາຍງານຂໍ້ມູນ"}</>}

              <div
                className="text-white pageTitle text-right text-nowrap pr-0"
                style={{ flex: 1 }}
              >
                <button
                  className="btn text-white mr-0"
                  onClick={() => setReloadData(!reloadData)}
                >
                  {loading ? (
                    loadingData(23)
                  ) : (
                    <i className="icon-cycle fs-4" />
                  )}
                </button>
              </div>
            </div>
            <br />
            <br />
            <div className="section  mb-2 mt-5">
              <div className="transactions row">
                <div className="row">
                  <div className="col-12 w-100">
                    <div className="mb-1">
                      <SearchEquimentType
                        style={{ minWidth: 200 }}
                        value={listEquimentType?._id}
                        onChange={(obj) => {
                          setListEquimentType(obj);
                        }}
                      />
                    </div>
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
                  </div>
                </div>
                <div className="text-center">
                  {loading ? loadingData(25) : ""}
                </div>
                <div className="col-lg-8">
                  {setData?.equiments?.total > 0 ? (
                    <>
                      <span className="text-center mb-2">
                        {loading ? loadingData(25) : ""}
                      </span>
                      <div className="table-responsive mt-2 ">
                        <table className="table table-sm mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th className="text-nowrap">ຊື່ຊັບສິນ</th>
                              <th className="text-nowrap">ວັນທີ່</th>
                              <th className="text-nowrap text-end">ຈຳນວນ</th>
                              <th className="text-nowrap text-end">ລາຄາ/ອັນ</th>
                              <th className="text-nowrap text-end">ລວມ</th>
                              <th className="text-nowrap text-end">ຈັດການ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {setData?.equiments?.data?.map((data, index) => (
                              <>
                                <tr key={index} className="text-black">
                                  <td>{NO(index)}</td>
                                  <td className="text-nowrap">
                                    {data?.title ? data?.title : "-"}
                                  </td>
                                  <td className="text-nowrap ">
                                    {formatDateDash(data?.createdAt)}
                                  </td>
                                  <td className="text-end text-nowrap">
                                    {currency(data?.total ? data?.total : 0)}
                                  </td>
                                  <td className="text-end text-nowrap">
                                    {currency(data?.price ? data?.price : 0)}
                                  </td>
                                  <td className="text-end text-nowrap">
                                    {currency(
                                      data?.total * parseInt(data?.price)
                                    )}
                                  </td>
                                  {getId >= 2 ? (
                                    <td className="text-nowrap text-end">
                                      <CheckOutOrder
                                        getBillId={getId}
                                        getData={data}
                                        onSuccess={() => {
                                          setReloadData(!reloadData);
                                        }}
                                      />
                                    </td>
                                  ) : (
                                    <>
                                      <td className="text-end text-nowrap">
                                        <EditData
                                          data={data}
                                          onSuccess={() => {
                                            setReloadData(!reloadData);
                                          }}
                                        />
                                        <button
                                          className="btn btn-sm "
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            _delete(data?._id);
                                          }}
                                        >
                                          <i className="fas fa-trash" />
                                        </button>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              </>
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
                <ListEquimentOut
                  onSuccess={(e) => {
                    setReloadData(!reloadData);
                  }}
                />
              </div>
            </div>
          </div>
          <Detail _id={detail} onHide={() => setDetail()} />
        </div>
        <div
          style={{
            position: "fixed",
            bottom: 5,
            backgroundColor: "#edece8",
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
