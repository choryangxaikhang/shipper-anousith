import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import ListUser from "../../../helper/components/ListUser";
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
      <a
        href="javaScript:void(0)"
        onClick={() => setShow(true)}
        className="list-group-item-action mt-3"
      >
        <i className="icon-sliders" /> ບັນຈຸເຈົ້າຂອງກິດຈະການ
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
            <i className="icon-sliders" /> ບັນຈຸເຈົ້າຂອງກິດຈະການ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="ຊື່ກິດຈະການ..."
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
                            <span>{item?.owner?.firstName ? item?.owner?.firstName + ' ' + item?.owner?.lastName : '-'}</span>
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
