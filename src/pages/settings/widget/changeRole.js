import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import { QUERY_USERS, UPDATE_USERS } from "../apollo";
export default function ChangeRole() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [text, setText] = useState("");

  const [queryUsers, { data: userData, loading }] = useLazyQuery(QUERY_USERS, {
    fetchPolicy: "cache-and-network",
  });
  const [updateUser] = useMutation(UPDATE_USERS);

  useEffect(() => {
    queryUsers({
      variables: {
        where: {
          firstName: searchValue ? searchValue : undefined,
        },
        limit: searchValue ? 1000 : 10,
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
  }, [userData, searchValue]);

  const _onSearch = () => {
    setSearchValue(searchValue);
    setNewLoadData(!newLoadData);
  };
  const _handleKeypress = (e) => {
    if (e.key === "Enter") {
      _onSearch();
    }
  };

  const _changeRole = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການປ່ຽນສິດການໃຊ້ລະບົບ user ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        try {
          const _updated = updateUser({
            variables: {
              data: {
                role: String(text),
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
      <div className=" p-1 text-black border-top" onClick={() => setShow(true)}>
        <i className="fa-solid fa-chevron-right me-2" />
        ກຳນົດສິດການນຳໃຊ້ລະບົບ
      </div>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ກຳນົດສິດການນຳໃຊ້ລະບົບ
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
              onKeyPress={_handleKeypress}
              style={{ border: "1px solid #c2c1be" }}
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
                    <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                    <th>ສິດການໃຊ້ລະບົບ</th>
                    <th>ຈັດການ</th>
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
                          {editStatus && getIndex === item?._id ? (
                            <select
                              className="form-control"
                              onChange={(e) => setText(e.target.value)}
                            >
                              <option defaultValue="">
                                ເລືອກສິດການໃຊ້ລະບົບ
                              </option>
                              <option
                                value="HR"
                                selected={item?.role === "HR" ? true : false}
                              >
                                ບຸກຄາລະກອນ
                              </option>
                              <option
                                value="ACCOUNTANT"
                                selected={
                                  item?.role === "ACCOUNTANT" ? true : false
                                }
                              >
                                ບັນຊີ
                              </option>
                              <option
                                value="FINANCE"
                                selected={
                                  item?.role === "FINANCE" ? true : false
                                }
                              >
                                ການເງິນ
                              </option>

                              <option
                                value="BRANCH_DIRECTOR"
                                selected={
                                  item?.role === "BRANCH_DIRECTOR" ? true : false
                                }
                              >
                                ເຈົ້າຂອງກີດຈະການ
                              </option>
                              <option
                                value="IT"
                                selected={item?.role === "IT" ? true : false}
                              >
                                IT
                              </option>
                              <option
                                value="CALL_CENTER"
                                selected={
                                  item?.role === "CALL_CENTER" ? true : false
                                }
                              >
                                ເຄົາເຕີ
                              </option>
                              <option
                                value="ADMIN"
                                selected={item?.role === "ADMIN" ? true : false}
                              >
                                ADMIN
                              </option>
                              <option
                                value="SUPER_ADMIN"
                                selected={
                                  item?.role === "SUPER_ADMIN" ? true : false
                                }
                              >
                                SUPER_ADMIN
                              </option>
                              <option
                                value="CUSTOMER_SERVICE"
                                selected={
                                  item?.role === "CUSTOMER_SERVICE"
                                    ? true
                                    : false
                                }
                              >
                                ບໍລິການລູກຄ້າ
                              </option>
                            </select>
                          ) : (
                            item?.role
                          )}
                        </td>

                        <td style={{ textAlign: "center" }}>
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
