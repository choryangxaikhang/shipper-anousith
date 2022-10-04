import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData, messageError, messageSuccess } from "../../../helper";
import { QUERY_HOUSE, UPDATE_HOUSE } from "../apollo";
export default function TurnOffHouse() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [house, setHouse] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newLoadData, setNewLoadData] = useState(false);

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
  const _turnOnHouse = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການເປີດ ກິດຈະການ ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _updated = await updateHouse({
            variables: {
              data: {
                public: String("ACTIVE"),
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

  const _turnOffHouse = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ທ່ານຕ້ອງການປິດ ກິດຈະການ ນີ້ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _updated = await updateHouse({
            variables: {
              data: {
                public: String("INACTIVE"),
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
      <a
        href="javaScript:void(0)"
        onClick={() => setShow(true)}
        className="list-group-item-action"
      >
        <i className="icon-sliders" /> ຕັ້ງຄ່າເປີດ ແລະ ປິດກິດຈະການ
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
            <i className="icon-sliders" /> ຕັ້ງຄ່າເປີດ ແລະ ປິດກິດຈະກໍາ
          </Modal.Title>
        </Modal.Header>
        <div className="input-group mb-3 mt-1">
          <input
            type="text"
            className="form-control form-control-lg"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={_handleKeypress}
            style={{color:"1px solid red", backgroundColor:"red"}}
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
                  <th className="text-nowrap" width="30">
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
                        <div className="form-check form-switch">
                          <input
                            id="_dm-dbOfflineContact"
                            className="form-check-input ml-5"
                            type="checkbox"
                            checked={item?.public === "ACTIVE" ? "ACTIVE" : ""}
                            onChange={
                              item?.public === "ACTIVE"
                                ? () => {
                                    _turnOffHouse(item?._id);
                                  }
                                : () => {
                                    _turnOnHouse(item?._id);
                                  }
                            }
                          />
                        </div>
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
