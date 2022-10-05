import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import { QUERY_USERS, UPDATE_USERS } from "../apollo";
export default function BlockUser() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);

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

  const _turnOnStatus = (id, statusCheck) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      statusCheck === "ACTIVE"
        ? "ທ່ານຕ້ອງການ ບລ໋ອກ user ນີ້ແທ້ ຫຼື ບໍ່?"
        : "ທ່ານຕ້ອງການປົດບລ໋ອກ user ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      () => {
        try {
          const _updated = updateUser({
            variables: {
              data: {
                status:
                  statusCheck === "ACTIVE"
                    ? String("UNACTIVE")
                    : String("ACTIVE"),
              },
              where: {
                _id: parseInt(id),
              },
            },
          });
          if (_updated) {
            messageSuccess("ການດຳເນີນງານສຳເລັດ");
            setNewLoadData(!newLoadData);
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
      <div className="p-1 text-black " onClick={() => setShow(true)}>
        <i className="fa-solid fa-chevron-right me-2" />
        ບລ໋ອກ User
      </div>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header className="text-black">
          ບລ໋ອກ User
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none", marginTop: -10 }}
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
              placeholder="ຊື່ພະນັງານ..."
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
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                    <th className="text-nowrap">ບລ໋ອກ</th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users?.map((item, index) => (
                      <tr key={index}>
                        <td className="">{index + 1}</td>
                        <td className="text-nowrap">
                          {item?.firstName ? item?.firstName : "-"}{" "}
                          {item?.lastName ? item?.lastName : "-"}
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                          className="text-nowrap"
                        >
                          <div className="form-check form-switch">
                            <input
                              id="_dm-dbOfflineContact"
                              className="form-check-input"
                              type="checkbox"
                              checked={
                                item?.status === "ACTIVE" ? "ACTIVE" : ""
                              }
                              onChange={() =>
                                _turnOnStatus(item?._id, item?.status)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
                {/* <tbody>
                  {users &&
                    users?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-nowrap">
                          {item?.firstName ? item?.firstName : "-"}{" "}
                          {item?.lastName ? item?.lastName : "-"}
                        </td>
                        <td
                          style={{ textAlign: "center" }}
                          className="text-nowrap"
                        >
                          <div className="form-check form-switch">
                            <input
                              id="_dm-dbOfflineContact"
                              className="form-check-input"
                              type="checkbox"
                              checked={
                                item?.status === "ACTIVE" ? "ACTIVE" : ""
                              }
                              onChange={() =>
                                _turnOnStatus(item?._id, item?.status)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody> */}
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
