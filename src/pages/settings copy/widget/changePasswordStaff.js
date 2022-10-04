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

  const [queryUsers, { data: userData, loading }] = useLazyQuery(QUERY_USERS, {
    fetchPolicy: "cache-and-network",
  });
  const [updateUser] = useMutation(UPDATE_USERS);

  useEffect(() => {
    queryUsers({
      variables: {
        where: {
          firstName: searchValue?searchValue:undefined,
        },
        limit: searchValue ? 1000 : 10,
        orderBy: "createdAt_DESC",
      },
    });
  }, [newLoadData]);

  useEffect(() => {
    if (userData) {
      setUsers(userData?.users?.data)
    }
    if (searchValue === "") {
      setNewLoadData(!newLoadData)
    }
  }, [userData, searchValue])

  const _onSearch = () => {
    setSearchValue(searchValue);
    setNewLoadData(!newLoadData);
  };
  const _handleKeypress = (e) => {
    if (e.key === "Enter") {
      _onSearch()
    }
  }

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
     
      <a
        href="javaScript:void(0)"
        onClick={() => setShow(true)}
        className=" list-group-item-action mt-3"
      >
        <i className="icon-sliders" /> ປ່ຽນລະຫັດຜ່ານພະນັກງານ
      </a>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            <i className="icon-sliders" /> ປ່ຽນລະຫັດຜ່ານພະນັກງານ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="ຊື່ພະນັງານ..."
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={_handleKeypress}
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
              <table className="table table-bordered table-sm">
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
        <Modal.Footer>
          <button
            className="btn btn-danger btn-block btn-lg"
            onClick={() => handleClose()}
          >
            <i className="icon-x" style={{ marginRight: 3 }} />
            ປິດ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
