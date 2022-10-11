/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  messageWarning,
  StatusEquiment,
} from "../../../../helper";
import {
  ADD_EQUIMENT_STOCK,
  DELETE_EQUIMENT_STOCK,
  QUERY_BILL,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import AddData from "./AddData";
import EditData from "./EditData";
import { EQUIMENT_LIST } from "../../../../routes/app";

export default function GenerateBill() {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const inputRef = useRef();
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState();
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [newText, setNewText] = useState("");
  const [reloadData, setNewLoadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");
  const [addNew, setAddNew] = useState(true);
  //caludar
  const [listIdData, setIdData] = useState();
  const getInTotal = listIdData?.endTotal;
  const finalTotal = getInTotal - newText;

  const [queryStock, { data: setData, loading }] = useLazyQuery(QUERY_BILL, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);

  useEffect(() => {
    queryStock({
      variables: {
        where: {
          status: "FEE",
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, searchValue, numberPage, reloadData, localHouse]);

  const _onSearch = () => {
    setSearchValue(searchValue);
    setNewLoadData(!reloadData);
  };
  const _handleKeypress = (e) => {
    if (e.key === "Enter") {
      _onSearch();
    }
  };
  //pageination
  const countData = setData?.equimentStocks?.total;
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
  return (
    <>
      <h3 className="page-title mb-2 mt-2 ms-3 text-black">
        ຈັດການຂໍ້ມູນໃບບິນເບິກເຄື່ອງ
      </h3>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped  table-sm mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>ເລກໃບເບີກ</th>
                          <th>ຫົວຂໍ້</th>
                          <th className="text-end">ຈັດການ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {setData?.billEquiment?.data?.map((data, index) => (
                          <>
                            <tr key={index} className="text-black">
                              <td>{index + 1}</td>
                              <td className="text-nowrap">
                                {data?.billNo ? data?.billNo : "-"}
                              </td>
                              <td className="text-nowrap">
                                {data?.details ? data?.details : "-"}
                              </td>
                              <td className="text-nowrap text-end">
                                <button
                                  className="btn  me-1 btn-lg"
                                  onClick={() =>
                                    history.push(
                                      `${EQUIMENT_LIST}/${data?._id}`
                                    )
                                  }
                                >
                                  <i
                                    className="fa fa-cart-plus me-1"
                                    style={{ fontSize: 17 }}
                                  />
                                  ເບີກຊັບສິນ
                                </button>
                                <EditData
                                  _data={data}
                                  onSuccess={(e) => {
                                    setNewLoadData(!reloadData);
                                  }}
                                />
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
              setNewLoadData(!reloadData);
            }}
          />
        </div>
      </div>
    </>
  );
}
