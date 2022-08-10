import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { loadingData } from "..";
import { BRANCHES } from "./apollo";

export default function Branch({
  style,
  className,
  defaultValue,
  size,
  getData,
  provinceId,
  disabled,
}) {
  const inputSize =
    size === "lg"
      ? "form-control-lg"
      : size === "sm"
      ? "form-control-sm"
      : "form-control-md";
  const [searchValue, setSearchValue] = useState();
  const [show, setShow] = useState(false);
  const [fetchData, { data, loading }] = useLazyQuery(BRANCHES);

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          branch_name: searchValue ? searchValue : undefined,
          public: 1,
          provinceID: provinceId ? parseInt(provinceId) : undefined,
        },
        limit: 50,
      },
    });
  }, [searchValue, provinceId]);

  const handleClick = (value) => {
    if (!value && getData) {
      getData(null);
      setShow(false);
      return;
    }
    try {
      const result = data?.branches?.data?.filter(
        (obj) => obj?.branch_name === value
      );
      if (result.length > 0 && getData) {
        getData(result[0]);
      }
    } catch (error) {
      if (getData) getData();
    }
    setShow(false);
  };

  return (
    <React.Fragment>
      <input
        type={"button"}
        className={`form-control text-left ${inputSize} ${className}`}
        // style={{ opacity: defaultValue ? 1 : 0.3 }}
        value={defaultValue ? defaultValue : "ເລືອກສາຂາ..."}
        onClick={() => setShow(true)}
        disabled={disabled}
      />
      <Modal
        show={show}
        centered
        style={style}
        className={className}
        onHide={() => setShow(false)}
      >
        {/* <Modal.Header>
          <Modal.Title className="col-md-12 text-center">
         ເລືອກສາຂາ
          </Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="custom-modal-body">
          <div className="form-group  basic col-md-12 text-center from-control-lg">
            <input
              type={"search"}
              className="form-control form-control-lg"
              style={{ backgroundColor: "white" }}
              onChange={(e) => setSearchValue(e.target.value)}
              onInput={(e) => {
                if (!e.target.value && getData) getData();
              }}
              placeholder="ຄົ້ນຫາຊື່ສາຂາ.."
            />
          </div>
          {loading ? (
            <center>{loadingData(25, "ກຳລັງໂຫຼດຂໍ້ມູນ...")}</center>
          ) : (
            <div className="mt-1">
              {data?.branches?.data?.map((data, index) => (
                <div
                  className="d-flex py-2 border-bottom align-items-center"
                  key={index}
                  onClick={() => handleClick(data?.branch_name)}
                >
                  <i className="fa fa-map-marker-alt text-danger mr-2" />
                  <span className="text-black">{data?.branch_name}</span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            size="lg"
            className="btn btn-primary"
            onClick={() => setShow(false)}
          >
            <i className="icon-close " />
            ປິດ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
