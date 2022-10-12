/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState,useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { EXPENSE_TYPE, USER_KEY } from "../../../Routes/app";
import useReactRouter from "use-react-router";
import {
  getLocalHouse,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
} from "../../../helper";
import {
  CREATE_EXPENSE_TYPE,
  DELETE_EXPENSE_TYPE,
  QUERY_EXPENSE_TYPE,
  UPDATE_EXPENSE_TYPE,
} from "../apollo";
import { Table } from "react-bootstrap";
import PaginationController from "../../../helper/components/pagination/PaginationComponent";
import LimitData from "../../../helper/components/pagination/LimitData";
import Notiflix from "notiflix";

export default function ExpenseTypeScreen() {
  const { history, location, match } = useReactRouter();
  const jsonObj = JSON.parse(localStorage.getItem(USER_KEY));
  const userInfo = jsonObj?.data;
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const inputRef = useRef();
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState();
  const [addNew, setAddNew] = useState(true);
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [localHouse, setLocalHouse] = useState("")
  const [queryExpenseType, { data: expenseTypeData, loading }] = useLazyQuery(
    QUERY_EXPENSE_TYPE,
    { fetchPolicy: "cache-and-network" }
  );

  const [addExpenseType] = useMutation(CREATE_EXPENSE_TYPE);
  const [editExpenseType] = useMutation(UPDATE_EXPENSE_TYPE);
  const [deleteExpenseType] = useMutation(DELETE_EXPENSE_TYPE);

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    queryExpenseType({
      variables: {
        where: {
          expenseTitle: searchValue,
          house: localHouse,
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, searchValue, numberPage, reloadData, localHouse]);

  //pageination
  const countData = expenseTypeData?.expenseTypes?.total;
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

  const handleAddNew = async () => {
    const { data } = await addExpenseType({
      variables: {
        data: {
          expenseTitle: text,
          house: localHouse,
        },
      },
    });
    if (data?.createExpenseType?.id_expense) {
      setText("");
      messageSuccess("ການດຳເນີນງານສຳເລັດ");
      setReloadData(!reloadData);
    } else {
      messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
      setText(text);
    }
  };

  const handleUpdate = async (id) => {
    const { data } = await editExpenseType({
      variables: {
        data: {
          expenseTitle: String(newText),
          house: localHouse,
        },
        where: {
          id_expense: parseInt(id),
        },
      },
    });

    if (data?.updateExpenseType?.id_expense) {
      messageSuccess("ການດຳເນີນງານສຳເລັດ");
      setNewText("");
      setReloadData(!reloadData);
      setEditStatus(false);
    } else {
      messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
      setNewText(text);
    }
  };

  const handleDelete = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const { data } = await deleteExpenseType({
            variables: {
              where: {
                id_expense: parseInt(id),
              },
            },
          });
          if (data?.deleteExpenseType?.id_expense) {
            messageSuccess("ການດຳເນີນງານສຳເລັດ");
            setReloadData(!reloadData);
          }
        } catch (error) {
          messageError("ການດຳເນີນງານບໍ່ສຳເລັດ");
        }
      },
      () => {
        return false;
      }
    );
  };

  return (
    <>
      <div className="content__header content__boxed overlapping">
        <div className="content__wrap">
          <h3 className="page-title mb-2 text-white">ຈັດການປະເພດລາຍຈ່າຍ</h3>
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
                    <div className="col-md-3">
                      {loading ? (
                        loadingData(25, '')
                      ) : (
                        <button
                          type="button"
                          className={
                            !addNew
                              ? "btn btn-sm btn-danger"
                              : "btn btn-sm btn-success"
                          }
                          onClick={() => {
                            setAddNew(!addNew);
                          }}
                        >
                          {!addNew ? (
                            <>
                              <i className="icon-x mr-1" /> ຍົກເລີກ
                            </>
                          ) : (
                            <>
                              <i className="icon-plus mr-1" /> ເພີ່ມ
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input type="search"
                        className="form-control form-control-lg"
                        placeholder="ຄົ້ນຫາ"
                        ref={inputRef}
                        defaultValue={searchValue ? searchValue : undefined}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            setSearchValue(inputRef.current.value);
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-2 mb-2">
                      <div className="input-group">
                        <button className="btn btn-primary"
                          onClick={() => {
                            setSearchValue(inputRef.current.value);
                          }}
                        >
                          <i className="fas fa-search" /> ຄົ້ນຫາ
                        </button>
                      </div>
                    </div>
                    <div className="row mt-4 pe-0">
                      <LimitData
                        numberRows={numberRows}
                        onChangeRows={_onChangeRows}
                        numberPage={numberPage}
                        total={countData}
                        hiddenSearch={"HideSearch"}
                        col={6}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ລາຍການ</th>
                          {userInfo?.role === "SUPER_ADMIN" ||
                            userInfo?.role === "IT" ? (
                            <th className="text-nowrap text-center" width={100}>
                              ຈັດການ
                            </th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>
                        <tr hidden={addNew}>
                          <td></td>
                          <td>
                            <input
                              type="text"
                              placeholder="ປະເພດລາຍຮັບ"
                              className="form-control"
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                            />
                          </td>
                          <td className="text-nowrap">
                            <button
                              type="button"
                              onClick={() => handleAddNew()}
                              className="btn w-100 btn-success"
                            >
                              <i className="icon-check mr-1" /> ບັນທຶກ
                            </button>
                          </td>
                        </tr>
                        {expenseTypeData &&
                          expenseTypeData?.expenseTypes?.data?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="text-nowrap text-center">{NO(index)}</td>
                                <td className="text-nowrap">
                                  {editStatus &&
                                    getIndex === item?.id_expense ? (
                                    <input
                                      type="text"
                                      placeholder="ປະເພດລາຍຮັບ"
                                      className="form-control"
                                      onChange={(e) =>
                                        setNewText(e.target.value)
                                      }
                                      value={newText}
                                    />
                                  ) : item?.expenseTitle ? (
                                    item?.expenseTitle
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="text-center">
                                  {userInfo?.role === "SUPER_ADMIN" ||
                                    userInfo?.role === "IT" ? (
                                    <div className="btn-group">
                                      {editStatus &&
                                        getIndex === item?.id_expense ? (
                                        <button
                                          onClick={() =>
                                            handleUpdate(item?.id_expense)
                                          }
                                          style={{ textDecoration: "none" }}
                                          className="btn btn-success"
                                        >
                                          <i className="icon-check-circle" />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setEditStatus(true);
                                            setGetIndex(item?.id_expense);
                                            setNewText(item?.expenseTitle);
                                          }}
                                          className="btn btn-sm btn-light"
                                          style={{ textDecoration: "none" }}
                                        >
                                          <i className="icon-edit" />
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDelete(item?.id_expense)
                                        }
                                        className="btn btn-sm btn-danger"
                                      >
                                        <i className="icon-trash"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </Table>
                  </div>
                  <PaginationController
                    routes={`${EXPENSE_TYPE}`}
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
