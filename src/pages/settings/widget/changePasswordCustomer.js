import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import { QUERY_CUSTOMERS, UPDATE_CUSTOMER } from "../apollo";
export default function ChangePasswordCustomer() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [users, setUsers] = useState([]);
  const [searchValueID, setSearchValueID] = useState("");
  const [searchValuePhone, setSearchValuePhone] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [getIndex, setGetIndex] = useState(0);
  const [text, setText] = useState("");

  const [queryCustomer, { data: customerData, loading }] = useLazyQuery(
    QUERY_CUSTOMERS,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  useEffect(() => {
    queryCustomer({
      variables: {
        where: {
          _id: searchValueID ? parseInt(searchValueID) : undefined,
          phoneNumber: searchValuePhone
            ? parseInt(searchValuePhone)
            : undefined,
        },
        limit: searchValueID || searchValuePhone ? 1000 : 10,
        orderBy: "createdAt_DESC",
      },
    });
  }, [newLoadData]);
  useEffect(() => {
    if (customerData) {
      setUsers(customerData?.customers?.data);
    }
    if (searchValueID === "") {
      setNewLoadData(!newLoadData);
    }
  }, [customerData, searchValueID]);
  useEffect(() => {
    if (searchValuePhone === "") {
      setNewLoadData(!newLoadData);
    }
  }, [searchValuePhone]);

  const _onSearch = () => {
    setSearchValueID(searchValueID);
    setSearchValuePhone(searchValuePhone);
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
      "ທ່ານຕ້ອງການປ່ຽນລະຫັດຜ່ານ user ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        try {
          const _updated = updateCustomer({
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
      <div className="card-body text-black " onClick={() => setShow(true)}>
        <i className="fa-solid fa-chevron-right me-2" />
        ປ່ຽນລະຫັດຜ່ານລູກຄ້າ
      </div>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        backdrop="static"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            <i className="icon-sliders" /> ປ່ຽນລະຫັດຜ່ານລູກຄ້າ
          </Modal.Title>
        </Modal.Header>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control form-control-lg"
            placeholder="ໄອດີ..."
            onChange={(e) => setSearchValueID(e.target.value)}
            onKeyPress={_handleKeypress}
          />
          <input
            type="number"
            className="form-control form-control-lg"
            placeholder="ເບີໂທ..."
            onChange={(e) => setSearchValuePhone(e.target.value)}
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
                  <th className="text-nowrap">ID</th>
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
                      <td className="text-center">{item?._id}</td>
                      <td className="text-nowrap">
                        {item?.fullName ? item?.fullName : "-"}{" "}
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
                          />
                        ) : (
                          "* * * *"
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
                              setText(item?.password);
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
