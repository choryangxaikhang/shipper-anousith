import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  userStatus,
} from "../../helper";
import Notiflix from "notiflix";
import { QUERY_USER_STAFF, DELETE_USER } from "./apollo";
// import AddUserStaff from "./addUser_staff";
// import EditUserStaff from "./EditUserStaff";
import * as ROUTES from "../../routes/app";
import DetailProfile from "./DetailProfile";
export default function UserList() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [dataUserStaff, setDataUserStaff] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);

  const [getUserStaff, { data: resUserStaffData, loading }] = useLazyQuery(
    QUERY_USER_STAFF,
    { fetchPolicy: "cache-and-network" }
  );
  const [deleteUserStaff] = useMutation(DELETE_USER);

  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  useEffect(() => {
    getUserStaff({
      variables: {
        where: {
          firstName: String(searchValue),
        },
        skip: searchValue ? 0 : numberRows * (numberPage - 1),
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [numberRows, searchValue, numberPage, newLoadData]);
  useEffect(() => {
    if (resUserStaffData) {
      setDataUserStaff(resUserStaffData?.users?.data);
    }
  }, [resUserStaffData]);

  //pageination
  const countData = resUserStaffData?.users?.total;
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

  const _deleteUserStaff = (id) => {
    //   console.log(id);
    //   return
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການລຶບ user ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _deleteUserStaff = await deleteUserStaff({
            variables: {
              where: {
                _id: parseInt(id),
              },
            },
          });
          if (_deleteUserStaff) {
            messageSuccess("ດຳເນີນການສຳເລັດ");
            setNewLoadData(!newLoadData);
          }
        } catch (error) {
          messageError("ດຳເນີນການບໍ່ສຳເລັດ");
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
          <h3 className="page-title mb-2 text-white">ຈັດການຂໍ້ມູນພະນັກງານ</h3>
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
                    <div className="col-md-2">
                      {/* <AddUserStaff
                        onSuccess={() => {
                          setNewLoadData(!newLoadData);
                        }}
                      /> */}
                    </div>
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-1">
                          <span>{loading ? loadingData(30) : ""}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th className="text-nowrap">ລຳດັບ</th>
                          <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                          <th className="text-nowrap">ເບີໂທ</th>
                          <th className="text-nowrap">ແຂວງ</th>
                          <th className="text-nowrap">ເມືອງ</th>
                          <th className="text-nowrap">ບ້ານ</th>
                          <th className="text-nowrap">ບັດປະຈຳຕົວ</th>
                          <th className="text-nowrap">ຕຳແຫນ່ງ</th>
                          {userInfo?.role === "SUPER_ADMIN" ||
                          userInfo?.role === "IT" ? (
                            <th className="text-nowrap text-center">ຈັດການ</th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>
                        {resUserStaffData?.users?.data &&
                          resUserStaffData?.users?.data?.map((data, index) => (
                            <tr key={index}>
                              <td>{NO(index)}</td>
                              <td>
                                {data?.firstName ? data?.firstName : "-"}{" "}
                                {data?.lastName ? data?.lastName : "-"}
                              </td>
                              <td>
                                {data?.phoneNumber ? data?.phoneNumber : "-"}
                              </td>
                              <td>
                                {data?.province?.provinceName
                                  ? data?.province?.provinceName
                                  : "-"}
                              </td>
                              <td>
                                {data?.district?.title
                                  ? data?.district?.title
                                  : "-"}
                              </td>
                              <td>
                                {data?.village?.title
                                  ? data?.village?.title
                                  : "-"}
                              </td>
                              <td>{data?.carSign ? data?.carSign : "-"}</td>
                              <td>
                                {userStatus(data?.role ? data?.role : "-")}
                              </td>
                              {userInfo?.role === "SUPER_ADMIN" ||
                              userInfo?.role === "IT" ? (
                                <td className="text-end">
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-light btn-blocksm"
                                      onClick={(e) => {
                                        history.push(
                                          `${ROUTES.DETAIL_USER}/${data?._id}`
                                        );
                                      }}
                                    >
                                      <i className="icon-sort ms-1" />
                                    </button>
                                    {/* <EditUserStaff
                                      getData={data}
                                      onSuccess={() => {
                                        setNewLoadData(!newLoadData);
                                      }}
                                    /> */}
                                    <button
                                      type="button "
                                      className="btn btn-primary btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        _deleteUserStaff(data?._id);
                                      }}
                                    >
                                      <i className="icon icon-delete"></i>
                                    </button>
                                  </div>
                                </td>
                              ) : null}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
