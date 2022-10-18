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
      <div classNameName="p-1 text-black " onClick={() => setShow(true)}>
        <i classNameName="fa-solid fa-chevron-right me-2" />
        ປ່ຽນລະຫັດຜ່ານລູກຄ້າ
      </div>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header classNameName="text-black">
          ປ່ຽນລະຫັດຜ່ານລູກຄ້າ
          <a
            classNameName="pull-right ms-2 "
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i classNameName="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <div classNameName="input-group mb-3">
          <input
            type="number"
            classNameName="form-control form-control-lg"
            placeholder="ໄອດີ..."
            onChange={(e) => setSearchValueID(e.target.value)}
            onKeyPress={_handleKeypress}
            style={{ border: "1px solid #c2c1be" }}
          />
          <input
            type="number"
            classNameName="form-control form-control-lg"
            placeholder="ເບີໂທ..."
            onChange={(e) => setSearchValuePhone(e.target.value)}
            onKeyPress={_handleKeypress}
            style={{ border: "1px solid #c2c1be" }}
          />
          <button
            type="button"
            onClick={() => _onSearch()}
            classNameName="btn btn-primary btn-lg"
          >
            <i classNameName="icon-search1" />
          </button>
        </div>
        {loading ? (
          loadingData(23, "ກຳລັງໂຫຼດຂໍ້ມູນ")
        ) : (
          <div classNameName="table-responsive">
            <table classNameName="table table-bordered table-sm text-black">
              <thead>
                <tr>
                  <th classNameName="text-center">#</th>
                  <th classNameName="text-nowrap">ID</th>
                  <th classNameName="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                  <th classNameName="text-nowrap">ເບີໂທ</th>
                  <th classNameName="text-nowrap">ລະຫັດຜ່ານ</th>
                  <th classNameName="text-nowrap">ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users?.map((item, index) => (
                    <tr key={index}>
                      <td classNameName="text-center">{index + 1}</td>
                      <td classNameName="text-center">{item?._id}</td>
                      <td classNameName="text-nowrap">
                        {item?.fullName ? item?.fullName : "-"}{" "}
                      </td>
                      <td classNameName="text-nowrap">
                        {item?.phoneNumber ? item?.phoneNumber : "-"}
                      </td>
                      <td classNameName="text-center text-nowrap">
                        {editStatus && getIndex === item?._id ? (
                          <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            classNameName="form-control text-center"
                          />
                        ) : (
                          "* * * *"
                        )}
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                        classNameName="text-nowrap"
                      >
                        {editStatus && getIndex === item?._id ? (
                          <a
                            href="javaScript:void(0)"
                            onClick={() => _changeRole(item?._id)}
                            style={{ textDecoration: "none" }}
                          >
                            <i classNameName="icon-check text-success fa-2x" />
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
                            <i classNameName="icon-edit text-primary" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
}
