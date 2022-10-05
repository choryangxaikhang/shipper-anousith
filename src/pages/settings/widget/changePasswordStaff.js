import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import { QUERY_USERS, UPDATE_USERS } from "../apollo";
export default function ChangePasswordStaff() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [text, setText] = useState("");
  const [searchValuePhone, setSearchValuePhone] = useState("");
  const [queryUsers, { data: userData, loading }] = useLazyQuery(QUERY_USERS, {
    fetchPolicy: "cache-and-network",
  });
  const [updateUser] = useMutation(UPDATE_USERS);

  useEffect(() => {
    queryUsers({
      variables: {
        where: {
          firstName: searchValue ? searchValue : undefined,
          phoneNumber: searchValuePhone
            ? parseInt(searchValuePhone)
            : undefined,
        },
        // limit: searchValue ? 1000 : 10,
        limit: searchValue || searchValuePhone ? 1000 : 10,
        orderBy: "createdAt_DESC",
      },
    });
  }, [newLoadData]);

  useEffect(() => {
    if (userData) {
      setUsers(userData?.users?.data);
    }
    if (searchValue === "") {
      setNewLoadData(!newLoadData);
    }
  }, [userData, searchValue, searchValuePhone]);

  useEffect(() => {
    if (searchValuePhone === "") {
      setNewLoadData(!newLoadData);
    }
  }, [searchValuePhone]);
  const _onSearch = () => {
    setSearchValue(searchValue);
    setSearchValuePhone(searchValuePhone);
    setNewLoadData(!newLoadData);
  };
  // const _onSearch = () => {
  //   setSearchValue(searchValue);
  //   setNewLoadData(!newLoadData);
  // };
  const _handleKeypress = (e) => {
    if (e.key === "Enter") {
      _onSearch();
    }
  };

  const _changeRole = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການປ່ຽນລະຫັດຜ່ານ user ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        try {
          const _updated = updateUser({
            variables: {
              data: {
                password: String(text),
              },
              where: {
                _id: parseInt(id),
              },
            },
          });
          if (_updated) {
            messageSuccess("ການດຳເນີນງານສຳເລັດ");
            setText(text);
            setNewLoadData(!newLoadData);
            setEditStatus(false);
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
    <React.Fragment>
      <div
        className="p-1 text-black border-bottom"
        onClick={() => setShow(true)}
      >
        <i className="fa-solid fa-chevron-right me-2" />
        ປ່ຽນລະຫັດຜ່ານພະນັກງານ
      </div>
      <Modal show={show}  animation={false} size="xl">
        <Modal.Header className="text-black">
          {" "}
          ປ່ຽນລະຫັດຜ່ານພະນັກງານ
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
              type="search"
              className="form-control form-control-lg"
              placeholder="ຊື່..."
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={_handleKeypress}
              style={{ border: "1px solid #c2c1be" }}
            />
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="ເບີໂທ..."
              onChange={(e) => setSearchValuePhone(e.target.value)}
              onKeyPress={_handleKeypress}
              style={{ border: "1px solid #c2c1be" }}
              onWheel={(e) => e.target.blur()}
            />
            <button
              type="button"
              onClick={() => _onSearch()}
              className="btn btn-primary btn-lg"
            >
              <i className="icon-search1" />
            </button>
          </div>
          {loading ? (
            loadingData(23, "ກຳລັງໂຫຼດຂໍ້ມູນ")
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-sm text-black">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                    <th className="text-nowrap">ເບີໂທ</th>
                    <th className="text-nowrap">ລະຫັດຜ່ານ</th>
                    <th className="text-nowrap">ຈັດການ</th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-nowrap">
                          {item?.firstName ? item?.firstName : "-"}{" "}
                          {item?.lastName ? item?.lastName : "-"}
                        </td>
                        <td className="text-nowrap">
                          {item?.phoneNumber ? item?.phoneNumber : "-"}
                        </td>
                        <td className="text-center text-nowrap">
                          {editStatus && getIndex === item?._id ? (
                            <input
                              type="text"
                              onChange={(e) => setText(e.target.value)}
                              className="form-control text-center"
                              placeholder="* * * * * *"
                            />
                          ) : (
                            "* * * * * *"
                          )}
                        </td>

                        <td
                          style={{ textAlign: "center" }}
                          className="text-nowrap"
                        >
                          {editStatus && getIndex === item?._id ? (
                            <a
                              href="javaScript:void(0)"
                              onClick={() => _changeRole(item?._id)}
                              style={{ textDecoration: "none" }}
                            >
                              <i className="icon-check text-success fa-2x" />
                            </a>
                          ) : (
                            <a
                              href="javaScript:void(0)"
                              onClick={() => {
                                setEditStatus(true);
                                setGetIndex(item?._id);
                                setText(item?.role);
                              }}
                              style={{ textDecoration: "none" }}
                            >
                              <i className="icon-edit text-primary" />
                            </a>
                          )}
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
