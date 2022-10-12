/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  setParams,
} from "../../../../helper";
import {
  DELETE_INCOME_TYPE,
  QUERY_INCOME_TYPE,
  UPDATE_INCOME_TYPE,
} from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import Pagination from "../../../../helper/controllers/Pagination";
import LimitData from "../../../../helper/controllers/LimitData";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import NoData from "../../../../helper/components/NoData";
import AddTypeData from "./AddTypeData";

export default function IncomeType() {
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
  const [queryType, { data: expenseTypeData, loading }] = useLazyQuery(
    QUERY_INCOME_TYPE,
    { fetchPolicy: "cache-and-network" }
  );

  const [editIncomeType] = useMutation(UPDATE_INCOME_TYPE);
  const [deleteType] = useMutation(DELETE_INCOME_TYPE);

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    queryType({
      variables: {
        where: {
          incomeTitle: searchValue,
          house: localHouse,
        },
        skip: searchValue ? 0 : numberRow * (numberPage - 1),
        limit: searchValue ? 1000 : numberRow,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRow, searchValue, numberPage, reloadData, localHouse]);

  //pageination
  const countData = expenseTypeData?.incomeTypes?.total;
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
    const { data } = await editIncomeType({
      variables: {
        data: {
          incomeTitle: String(newText),
          house: localHouse,
        },
        where: {
          id_income: parseInt(id),
        },
      },
    });

    if (data?.updateIncomeType?.id_income) {
      messageSuccess("ແກ້ໄຂສຳເລັດ");
      setNewText("");
      setReloadData(!reloadData);
      setEditStatus(false);
    } else {
      messageError("ແກ້ໄຂບໍ່ສຳເລັດ");
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
          const { data } = await deleteType({
            variables: {
              where: {
                id_income: parseInt(id),
              },
            },
          });
          if (data?.deleteIncomeType?._id) {
            messageSuccess("ລືບຂໍ້ມູນສຳເລັດ");
            setReloadData(!reloadData);
          }
        } catch (error) {
          messageError("ລືບບໍ່ສຳເລັດ");
          console.log(error);
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
          <h3 className="page-title mb-2 text-white">ລາຍການຫມວດຊັບສິນ</h3>
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
              <div className="option-section mt-1">
                <div className="row gx-2">
                  {expenseTypeData?.incomeTypes?.total > 0 ? (
                    <>
                      <div className="table-responsive">
                        <Table className="table  table-sm mb-0">
                          <thead>
                            <tr>
                              <th className="text-start">ລຳດັບ</th>
                              <th className="text-nowrap text-start">
                                ປະເພດລາຍຮັບ
                              </th>
                              {userInfo?.role === "SUPER_ADMIN" ||
                              userInfo?.role === "IT" ? (
                                <th
                                  className="text-nowrap text-center"
                                  width={100}
                                >
                                  ຈັດການ
                                </th>
                              ) : null}
                            </tr>
                          </thead>
                          <tbody>
                            {expenseTypeData &&
                              expenseTypeData?.incomeTypes?.data?.map(
                                (item, index) => (
                                  <tr key={index} className="text-black">
                                    <td className="text-start">{NO(index)}</td>
                                    <td className="text-nowrap text-start">
                                      {editStatus &&
                                      getIndex === item?.id_income ? (
                                        <input
                                          type="text"
                                          placeholder="ປະເພດລາຍຮັບ"
                                          className="form-control"
                                          onChange={(e) =>
                                            setNewText(e.target.value)
                                          }
                                          value={newText}
                                        />
                                      ) : item?.incomeTitle ? (
                                        item?.incomeTitle
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                    <td className="text-center">
                                      <div className="btn-group">
                                        {editStatus &&
                                        getIndex === item?.id_income ? (
                                          <button
                                            onClick={() =>
                                              handleUpdate(item?.id_income)
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
                                              setGetIndex(item?.id_income);
                                              setNewText(item?.incomeTitle);
                                            }}
                                            className="btn btn-sm"
                                            style={{ textDecoration: "none" }}
                                          >
                                            <i className="fas fa-edit" />
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDelete(item?.id_income)
                                          }
                                          className="btn btn-sm"
                                        >
                                          <i className="icon-trash text-danger"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <NoData loading={loading} />
                  )}
                  {expenseTypeData?.incomeTypes?.total > 100 && (
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
          <AddTypeData
            onSuccess={(e) => {
              setReloadData(!reloadData);
            }}
          />
        </div>
      </div>
    </>
  );
}
