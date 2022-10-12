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
  setParams,
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
import NoData from "../../../../helper/components/NoData";
import Pagination from "../../../../helper/controllers/Pagination";

export default function GenerateBill() {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  // get query search
  const query = new URLSearchParams(location.search);
  const [numberPage, setNumberPage] = useState(1);
  const [numberRow, setNumberRow] = useState(100);
  const [searchValue, setSearchValue] = useState();
  const [reloadData, setNewLoadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("");

  const [queryBill, { data: setData, loading }] = useLazyQuery(QUERY_BILL, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);

  useEffect(() => {
    queryBill({
      variables: {
        where: {
          status: "FEE",
          house: localHouse?._id,
        },
        skip: numberRow * (numberPage - 1),
        limit: numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRow, searchValue, numberPage, reloadData, localHouse]);

  const _onSearch = () => {
    setSearchValue(searchValue);
    setNewLoadData(!reloadData);
  };
  

  //pageination
  const countData = setData?.billEquiment?.total;
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
      <h3 className="page-title mb-2 mt-2 ms-3 text-black">
        ຈັດການຂໍ້ມູນໃບບິນເບິກເຄື່ອງ
      </h3>
      <div className="row">
        <div className="col-12">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                {setData?.billEquiment?.total > 0 ? (
                  <>
                    <span className="text-center mb-2">
                      {loading ? loadingData(25) : ""}
                    </span>
                    <div className="table-responsive">
                      <table className="table   table-sm mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>ເລກໃບເບີກ</th>
                            <th>ຫົວຂໍ້</th>
                            <th>ສະຖານະບິນ</th>
                            <th className="text-end">ຈັດການ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {setData?.billEquiment?.data?.map((data, index) => (
                            <>
                              <tr key={index} className="text-black">
                                <td>{NO(index)}</td>
                                <td className="text-nowrap">
                                  {data?.billNo ? data?.billNo : "-"}
                                </td>
                                <td className="text-nowrap">
                                  {data?.details ? data?.details : "-"}
                                </td>
                                <td className="text-nowrap">
                                  {StatusEquiment(
                                    data?.status ? data?.status : "-"
                                  )}
                                </td>
                                <td className="text-nowrap text-end">
                                  <button
                                    className="btn  me-1 btn-sm text-success"
                                    onClick={() =>
                                      history.push(
                                        `${EQUIMENT_LIST}/${data?._id}`
                                      )
                                    }
                                  >
                                    <i className="fa fa-cart-plus me-1" />
                                    ເບີກ
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
                  </>
                ) : (
                  <NoData loading={loading} />
                )}
                {setData?.billEquiment?.total > 100 && (
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
            setNewLoadData(!reloadData);
          }}
        />
      </div>
    </>
  );
}
