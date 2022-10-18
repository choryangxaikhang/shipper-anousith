import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import { QUERY_CUSTOMERS, UPDATE_CUSTOMER } from "../apollo";
export default function ChangePasswordCustomer_User() {
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
          id_list: searchValueID ? parseInt(searchValueID) : undefined,
          contact_info: searchValuePhone ? searchValuePhone : undefined,
        },
        limit: searchValueID || searchValuePhone ? 1000 : 10,
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
                id_list: parseInt(id),
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
      <div classNameName="card-body text-black " onClick={() => setShow(true)}>
        <i classNameName="fa-solid fa-chevron-right me-2" />
        ປ່ຽນລະຫັດຜ່ານລູກຄ້າ
      </div>
      {/* <a
        href="javaScript:void(0)"
        onClick={(event) => {
          event.stopPropagation()
          setShow(true)
        }}
        classNameName="h6 d-block mb-1 stretched-link text-decoration-none"
      >
        ປ່ຽນລະຫັດຜ່ານລູກຄ້າ
      </a> */}
      <Modal show={show} animation={false} size="xl">
        <Modal.Header closeButton>
          <Modal.Title classNameName="fs-5">
            <i classNameName="icon-sliders" /> ປ່ຽນລະຫັດຜ່ານລູກຄ້າດດ
          </Modal.Title>
        </Modal.Header>
        <div classNameName="input-group mb-3">
          <input
            type="number"
            classNameName="form-control"
            placeholder="ໄອດີ..."
            onChange={(e) => setSearchValueID(e.target.value)}
            onKeyPress={_handleKeypress}
          />
          <input
            type="number"
            classNameName="form-control"
            placeholder="ເບີໂທ..."
            onChange={(e) => setSearchValuePhone(e.target.value)}
            onKeyPress={_handleKeypress}
          />
          <button
            type="button"
            onClick={() => _onSearch()}
            classNameName="btn btn-primary btn-sm"
          >
            <i classNameName="icon-search1" />
          </button>
        </div>
        {loading ? (
          loadingData(23, "ກຳລັງໂຫຼດຂໍ້ມູນ")
        ) : (
          <div classNameName="table-responsive">
            <table classNameName="table table-bordered table-sm">
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
                      <td classNameName="text-center">{item?.id_list}</td>
                      <td classNameName="text-nowrap">
                        {item?.full_name ? item?.full_name : "-"}{" "}
                      </td>
                      <td classNameName="text-nowrap">
                        {item?.contact_info ? item?.contact_info : "-"}
                      </td>
                      <td classNameName="text-center text-nowrap">
                        {editStatus && getIndex === item?.id_list ? (
                          <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            classNameName="form-control text-center"
                            defaultValue={item?.password}
                          />
                        ) : (
                          "* * * *"
                        )}
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                        classNameName="text-nowrap"
                      >
                        {editStatus && getIndex === item?.id_list ? (
                          <a
                            href="javaScript:void(0)"
                            onClick={() => _changeRole(item?.id_list)}
                            style={{ textDecoration: "none" }}
                          >
                            <i classNameName="icon-check text-success fa-2x" />
                          </a>
                        ) : (
                          <a
                            href="javaScript:void(0)"
                            onClick={() => {
                              setEditStatus(true);
                              setGetIndex(item?.id_list);
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
        <Modal.Footer>
          <button
            classNameName="btn btn-danger btn-block btn-lg"
            onClick={() => handleClose()}
          >
            <i classNameName="icon-x" style={{ marginRight: 3 }} />
            ປິດ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
