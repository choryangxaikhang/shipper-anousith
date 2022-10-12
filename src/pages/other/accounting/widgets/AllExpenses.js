/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_EXPENSES, EXTRA_EXPENSE, USER_KEY } from "../../../Routes/app";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateTime,
  ITEM_PER_PAGE,
  loadingData,
  setParams,
  unixTimeFormat,
} from "../../../helper";
import { QUERY_EXTRA_EXPENSE } from "../apollo";
import { Table } from "react-bootstrap";
import LimitData from "../../../helper/components/pagination/LimitData";
import Pagination from "../../../helper/Pagination";

export default function AllExpenses() {
  const { history, location, match } = useReactRouter();
  const jsonObj = JSON.parse(localStorage.getItem(USER_KEY));
  const userInfo = jsonObj?.data;
  // const numberPage = match?.params?.page;
  const [numberPage, setPageNumber] = useState(1);
  const _id = match?.params?.branchId;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));

  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState();
  const [fetchData, { data: setData, loading }] = useLazyQuery(
    QUERY_EXTRA_EXPENSE,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          branch_id: parseInt(_id),
          public:1
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_ASC",
      },
    });
  }, [numberRows, searchValue, numberPage, _id]);

  //pageination
  const countData = setData?.extraExpenses?.total;
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

  useEffect(() => {
    const page = query.get("page");
    if (page) setPageNumber(parseInt(page));
  }, [query]);

  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">
            {setData?.extraExpenses?.data[0].branch_id?.branch_name}
          </h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-1">
                          {loading ? (
                            loadingData(25)
                          ) : (
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => history.goBack()}
                            >
                              <i className="icon-arrow_back" />
                            </button>
                          )}
                        </div>
                        <LimitData
                          numberRows={numberRows}
                          onChangeRows={_onChangeRows}
                          onSearch={(_onSearch) => {
                            setSearchValue(_onSearch);
                          }}
                          numberPage={numberPage}
                          total={countData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ລົງວັນທີ່</th>
                          <th>ເນື້ອໃນລາຍການ</th>
                          <th className="text-nowrap text-right">ລາຍຮັບ</th>
                          <th className="text-nowrap text-right">ລາຍຈ່າຍ</th>
                          <th className="text-nowrap text-right">
                            ຍອດຄົງເຫຼືອ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {setData &&
                          setData?.extraExpenses?.data?.map((data, index) => (
                            <tr key={index}>
                              <td className="text-nowrap">{NO(index)}</td>
                              <td className="text-nowrap">
                                {formatDateTime(data?.accountantDate)}
                              </td>
                              <td>
                                {data?.detail ? data?.detail : "-"}
                              </td>
                              <td className="text-nowrap text-right">
                                {currency(
                                  data?.incomeKIP ? data?.incomeKIP : 0
                                )} ກີບ
                              </td>
                              <td className="text-nowrap text-right text-danger">
                                {currency(
                                  data?.expenseKIP ? data?.expenseKIP : 0
                                )} ກີບ
                              </td>
                              <td className="text-nowrap text-right">
                                {currency(
                                  data?.endBalanceKIP ? data?.endBalanceKIP : 0
                                )} ກີບ
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  <Pagination
                    className={"mt-3 mb-3"}
                    pageTotal={countPage}
                    currentPage={numberPage}
                    onPageChange={(page) => {
                      history.push({ search: setParams(`page`, page) });
                    }}
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
