import { useLazyQuery, useMutation } from "@apollo/client";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./utils/index.css";
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
      <div
        classNameName="p-1 text-black border-bottom"
        onClick={() => setShow(true)}
      >
        <i classNameName="fa-solid fa-chevron-right me-2" />
        ຕັ້ງຄ່າເປີດ ແລະ ປິດກິດຈະການ
      </div>
      <Modal show={show} animation={false} size="xl">
        <Modal.Header>
          ຕັ້ງຄ່າເປີດ ແລະ ປິດກິດຈະກໍາ
          <a
            classNameName="pull-right ms-2"
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i classNameName="icon-x fa-2x text-danger" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <div classNameName="input-group mt-1">
            <input
              type="search"
              classNameName="form-control form-control-lg"
              placeholder="ຊື່ກິດຈະການ..."
              onChange={(e) => setSearchValue(e.target.value)}
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
            <div classNameName="table-responsive mt-1">
              <table classNameName="table table-bordered table-sm text-black">
                <thead>
                  <tr>
                    <th classNameName="text-center">#</th>
                    <th classNameName="text-nowrap">ຊື່ກິດຈະການ</th>
                    <th classNameName="text-nowrap" width="30">
                      ຈັດການ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {house &&
                    house?.map((item, index) => (
                      <tr key={index}>
                        <td classNameName="text-center">{index + 1}</td>
                        <td>{item?.houseName ? item?.houseName : "-"}</td>
                        <div classNameName="form-check form-switch">
                          <input
                            id="_dm-dbOfflineContact"
                            classNameName="form-check-input ms-2"
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
