/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_EXPENSES, EXTRA_ADMIN, USER_KEY } from "../../../Routes/app";
import useReactRouter from "use-react-router";
import { ITEM_PER_PAGE, loadingData } from "../../../helper";
import { QUERY_BRANCH } from "../apollo";
import { Table } from "react-bootstrap";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";
import SummaryIncome from "../widgets/summaryIncome";
import SummaryExpense from "../widgets/summaryExpense";
import SummaryEndBalance from "../widgets/summaryEndBalance";

export default function ExpensesAdmin() {
  const { history, location, match } = useReactRouter();
  const jsonObj = JSON.parse(localStorage.getItem(USER_KEY));
  const userInfo = jsonObj?.data;
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));

  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState();
  const [queryBranches, { data: branchData, loading }] = useLazyQuery(
    QUERY_BRANCH,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    queryBranches({
      variables: {
        where: {
          branch_name: searchValue,
          public: 1
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_ASC",
      },
    });
  }, [numberRows, searchValue, numberPage]);

  //pageination
  const countData = branchData?.branches?.total;
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
          <h3 className="page-title mb-2 text-white">ລາຍຈ່າຍບໍລິຫານ</h3>
        </div>
      </div>
      <div className="content__boxed">
        <div className="content__wrap">
          <div className="row">
            <div className="col-md-12">
              {/* Simple state widget */}
              <div className="card">
                <div className="card-header">
                  <div className="row">
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
                          <th className="text-nowrap">ຊື່ສາຂາ</th>
                          <th className="text-nowrap text-right">ລາຍຮັບ</th>
                          <th className="text-nowrap text-right">ລາຍຈ່າຍ</th>
                          <th className="text-nowrap text-right">
                            ຍອດຄົງເຫຼືອ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchData &&
                          branchData?.branches?.data?.map((item, index) => (
                            <tr
                              key={index}
                              style={{
                                color: item?.public === 0 ? "red" : "",
                              }}
                            >
                              <td className="text-nowrap">{NO(index)}</td>
                              <td className="text-nowrap">
                                {item?.branch_name ? item?.branch_name : "-"}
                              </td>
                              <td className="text-nowrap text-right">
                                <a
                                  href="JavaScript:void(0)"
                                  style={{ textDecoration: "none" }}
                                  onClick={() =>
                                    history.push(
                                      `${ALL_EXPENSES}/1/${item?.id_branch}`
                                    )
                                  }
                                  className="text-danger"
                                >
                                  <i className="icon-sort pull-left" />{" "}
                                  <SummaryIncome branchID={item?.id_branch} />
                                </a>
                              </td>
                              <td className="text-nowrap text-right">
                                <a
                                  href="JavaScript:void(0)"
                                  style={{ textDecoration: "none" }}
                                  onClick={() =>
                                    history.push(
                                      `${ALL_EXPENSES}/1/${item?.id_branch}`
                                    )
                                  }
                                  className="text-danger"
                                >
                                  <i className="icon-sort pull-left" />{" "}
                                  <SummaryExpense branchID={item?.id_branch} />
                                </a>
                              </td>
                              <td className="text-nowrap text-right">
                                <a
                                  href="JavaScript:void(0)"
                                  style={{ textDecoration: "none" }}
                                  onClick={() =>
                                    history.push(
                                      `${ALL_EXPENSES}/1/${item?.id_branch}`
                                    )
                                  }
                                  className="text-danger"
                                >
                                  <i className="icon-sort pull-left" />{" "}
                                  <SummaryEndBalance
                                    branchID={item?.id_branch}
                                  />
                                </a>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  <PaginationController
                    routes={`${EXTRA_ADMIN}`}
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
