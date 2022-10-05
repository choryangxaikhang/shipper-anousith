import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import ListUser from "../../../helper/components/ListUser";
import "./utils/index.css"
import { QUERY_HOUSE, UPDATE_HOUSE } from "../apollo";
export default function InviteOwner() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [house, setHouse] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);
  const [itemID, setItemID] = useState("");
  const [userData, setUserData] = useState([]);
  const [queryHouse, { data: resPonData, loading }] = useLazyQuery(
    QUERY_HOUSE,
    { fetchPolicy: "cache-and-network" }
  );
  const [updateHouse] = useMutation(UPDATE_HOUSE);

  useEffect(() => {
    queryHouse({
      variables: {
        where: {
          houseName: searchValue ? searchValue : undefined,
        },
        limit: searchValue ? 1000 : 10,
        orderBy: "createdAt_DESC",
      },
    });
  }, [newLoadData]);
  useEffect(() => {
    if (resPonData) {
      setHouse(resPonData?.houses?.data);
    }
    if (searchValue === "") {
      setNewLoadData(!newLoadData);
    }
  }, [resPonData, searchValue]);

  const _onSearch = () => {
    setSearchValue(searchValue);
    setNewLoadData(!newLoadData);
  };
  const _handleKeypress = (e) => {
    if (e.key === "Enter") {
      _onSearch();
    }
  };
  const _handleSubmit = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງຢືນຢັນລາຍການນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _updated = await updateHouse({
            variables: {
              data: {
                owner: userData?._id,
              },
              where: {
                _id: parseInt(id),
              },
            },
          });
          if (_updated) {
            messageSuccess("ການດຳເນີນງານສຳເລັດ");
            setItemID("");
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
      <div className="p-1 text-black border-bottom" onClick={() => setShow(true)}>
        <i className="fa-solid fa-chevron-right me-2" />
        ບັນຈຸເຈົ້າຂອງກິດຈະການ
      </div>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        animation={false}
        backdrop="static"
        size="xl"
        className="container-div"
      >
        <Modal.Header>
          ບັນຈຸເຈົ້າຂອງກິດຈະການ
          <a
            className="pull-right ms-2 "
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body >
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="ຊື່ກິດຈະການ..."
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={_handleKeypress}
              style={{border:"1px solid #c2c1be"}}
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
                    <th className="text-nowrap">ຊື່ກິດຈະການ</th>
                    <th className="text-nowrap" width="200">
                      ລາຍຊື່ສະມາຊິກ
                    </th>
                    <th className="text-nowrap" width="120">
                      ຈັດການ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {house &&
                    house?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-nowrap">
                          {item?.houseName ? item?.houseName : "-"}
                        </td>
                        <td className="text-nowrap">
                          {item?._id === itemID ? (
                            <ListUser
                              getData={(data) => {
                                setUserData(data);
                              }}
                              defaultValue={userData?.firstName}
                            />
                          ) : (
                            <span>
                              {item?.owner?.firstName
                                ? item?.owner?.firstName +
                                  " " +
                                  item?.owner?.lastName
                                : "-"}
                            </span>
                          )}
                        </td>
                        <td>
                          {item?._id === itemID ? (
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => _handleSubmit(item?._id)}
                            >
                              <i className="icon-check" /> ຢືນຢັນ
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-light btn-sm"
                              onClick={() => setItemID(item?._id)}
                            >
                              <i className="icon-edit" /> ແກ້ໄຂ
                            </button>
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
