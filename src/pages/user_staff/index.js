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
import { Modal } from "react-bootstrap";
import EditUserStaff from "./EditUserStaff";
import AddUserStaff from "./addUser_staff";
export default function UserList() {
  const { history, location, match } = useReactRouter();
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [dataUserStaff, setDataUserStaff] = useState([]);
  //
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [text, setText] = useState("");

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
    <React.Fragment>
      <div className=" p-1 text-black border-top" onClick={() => setShow(true)}>
        <i className="fa-solid fa-chevron-right me-2" />
        ເພີ່ມພະນັກງານ
      </div>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          <AddUserStaff
            onSuccess={() => {
              setNewLoadData(!newLoadData);
            }}
          />
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="ຊື່ພະນັກງານ..."
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ border: "1px solid #c2c1be" }}
            />
          </div>
          {loading ? (
            loadingData(23, "ກຳລັງໂຫຼດຂໍ້ມູນ")
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-sm text-black">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                    <th>ເບີໂທ</th>
                    <th>ທີ່ຢູ່</th>
                    <th>ຕຳແຫນ່ງ</th>
                    <th>ບ່ອນປະຈຳການ</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUserStaff?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-nowrap">
                        {item?.firstName ? item?.firstName : "-"}{" "}
                        {item?.lastName ? item?.lastName : "-"}
                      </td>
                      <td className="text-nowrap">
                        {item?.phoneNumber ? item?.phoneNumber : "-"}{" "}
                      </td>
                      <td className="text-nowrap">
                        {item?.province?.provinceName
                          ? item?.province?.provinceName
                          : "-"}
                        <br />
                        {item?.district?.title ? item?.district?.title : "-"}
                        <br />
                        {item?.village?.title ? item?.village?.title : "-"}
                        <br />
                      </td>
                      <td className="text-nowrap">
                        {userStatus(item?.role ? item?.role : "-")}
                      </td>
                      <td className="text-nowrap">
                        {userStatus(
                          item?.house?.houseName ? item?.house?.houseName : "-"
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <EditUserStaff
                          getData={item}
                          onSuccess={() => {
                            setNewLoadData(!newLoadData);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
