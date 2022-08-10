import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { loadingData } from "..";
import { PROVINCES } from "./apollo";
import "./utils/index.css";
export default function Provinces({
  style,
  className,
  defaultValue,
  size,
  getData,
}) {
  const inputSize =
    size === "lg"
      ? "form-control-lg"
      : size === "sm"
      ? "form-control-sm"
      : "form-control-md";
  const [searchValue, setSearchValue] = useState();
  const [show, setShow] = useState(false);
  const [fetchData, { data, loading }] = useLazyQuery(PROVINCES);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          provinceName: searchValue ? searchValue : undefined,
        },
        limit: 25,
      },
    });
  }, [searchValue]);

  const handleClick = (value) => {
    if (!value && getData) {
      getData(null);
      setShow(false);
      return;
    }
    try {
      const result = data?.provinces?.data?.filter(
        (obj) => obj?.provinceName === value
      );
      if (result.length > 0 && getData) {
        getData(result[0]);
        setShow(false);
      }
    } catch (error) {
      if (getData) getData();
    }
  };



  return (
    <React.Fragment>
      <input
        type={"button"}
        style={{ opacity: defaultValue ? 1 : 0.3 }}
        className={`form-control text-left ${inputSize} ${className}`}
        value={defaultValue ? defaultValue : "ເລືອກແຂວງ..."}
        onClick={() => setShow(true)}
      />
      <Modal
        show={show}
        centered
        style={style}
        className={className}
        onHide={() => setShow(false)}
      >
        <Modal.Body className="custom-modal-body">
          <div className="form-group mb-2 basic">
            <input
              type={"search"}
              className="form-control form-control-lg"
              onChange={(e) => setSearchValue(e.target.value)}
              onInput={(e) => {
                if (!e.target.value && getData) getData();
              }}
              placeholder="ຄົ້ນຫາ..."
            />
          </div>
          {loading ? (
            <center>{loadingData(25, "ກຳລັງໂຫຼດຂໍ້ມູນ...")}</center>
          ) : (
            <div className="mt-1">
              {data?.provinces?.data?.map((data, index) => (
                <div
                  className="d-flex py-2 border-bottom align-items-center"
                  key={index}
                  onClick={() => handleClick(data?.provinceName)}
                >
                  <i className="fa fa-map-marker-alt text-primary mr-2" />
                  <span className="text-primary">{data?.provinceName}</span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button size="lg" className="btn btn-primary btn-block rounded" onClick={() => setShow(false)}>
            <i className="icon-close " />
            ຍົກເລີກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
