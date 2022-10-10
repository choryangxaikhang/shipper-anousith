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
  DELETE_EQUIMENT_STOCK,
  EDIT_EQUIMENT_STOCK,
  QUERY_EQUIMENT_STOCK,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import Pagination from "../../../../helper/controllers/Pagination";
import LimitData from "../../../../helper/controllers/LimitData";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import NoData from "../../../../helper/components/NoData";
import AddData from "./AddData";
import EditData from "./EditData";

export default function EquimentStock() {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  // get query search
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [searchValue, setSearchValue] = useState();
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");

  const [queryType, { data: setData, loading }] = useLazyQuery(
    QUERY_EQUIMENT_STOCK,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [editType] = useMutation(EDIT_EQUIMENT_STOCK);
  const [deleteEquiment] = useMutation(DELETE_EQUIMENT_STOCK);

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
                  {setData?.equimentStocks?.total > 0 ? (
                    <>
                      <span className="text-center mb-2">
                        {loading ? loadingData(25) : ""}
                      </span>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-sm mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th className="text-nowrap">ຊື່ຊັບສິນ</th>
                              <th className="text-nowrap">ວັນທີ່ນຳເຂົ້າ</th>
                              <th className="text-nowrap">ຈຳນວນນຳເຂົ້າ</th>
                              <th className="text-center">ລາຄາ/ອັນ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {setData?.equimentStocks?.data?.map(
                              (data, index) => (
                                <>
                                  <tr key={index} className="text-black">
                                    <td>{NO(index)}</td>
                                    <td>{data?.equmentID?.title}</td>
                                    <td>
                                      {formatDateDash(
                                        data?.createdAt ? data?.createdAt : "-"
                                      )}
                                    </td>
                                    <td>
                                      {currency(
                                        data?.inTotal ? data?.inTotal : 0
                                      )}
                                    </td>
                                    <td>
                                      {currency(
                                        data?.equmentID?.price
                                          ? data?.equmentID?.price
                                          : 0
                                      )}
                                    </td>
                                  </tr>
                                </>
                              )
                            )}
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
