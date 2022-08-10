import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { VILLAGES } from "./apollo";

export default function Village({
  style,
  className,
  defaultValue,
  size,
  getData,
  where,
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
  const [fetchData, { data, loading }] = useLazyQuery(VILLAGES);

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          villageName: searchValue ? searchValue : undefined,
          isPublic: true,
          ...where,
        },
        limit: 18,
      },
    });
  }, [searchValue, where]);

  const handleClick = (value) => {
    if (!value && getData) {
      getData(null);
      setShow(false);
      return;
    }

    try {
      const result = data?.villages?.data?.filter(
        (obj) => obj?.villageName === value
      );
      if (result.length > 0 && getData) {
        getData(result[0]);
        setShow(false);
      }
    } catch (error) {
      if (getData) getData();
      setShow(false);
    }
  };

  return (
    <React.Fragment>
      <input
        type={"button"}
        className={`form-control text-left ${inputSize} ${className}`}
        // style={{ opacity: defaultValue ? 1 : 0.7 }}
        value={defaultValue ? defaultValue : "ເລືອກບ້ານ"}
        onClick={() => setShow(true)}
        disabled={disabled}
      />
      <Modal
        show={show}
        centered
        style={style}
        className={className}
        onHide={() => setShow(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">ເລືອກບ້ານ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="input-group mb-3">
            <input
              type={"search"}
              className="form-control form-control-lg"
              onChange={(e) => setSearchValue(e.target.value)}
              onInput={(e) => {
                if (!e.target.value && getData) getData();
              }}
              placeholder="ຄົ້ນຫາ"
            />
            <span className="input-group-text px-3">
              <i className="fa fa-search" />
            </span>
          </div>

          <div className="mt-2">
            <div
              className="d-flex py-2 border-bottom align-items-center"
              onClick={() => handleClick("")}
            >
              <i className="fa fa-map-marker-alt text-danger mr-2" />
              <span>ເລືອກຄ່າເລີ່ມຕົ້ນ</span>
            </div>

            {data?.villages?.data?.map((data, index) => (
              <div
                className="d-flex py-2 border-bottom align-items-center"
                key={index}
                onClick={() => handleClick(data?.villageName)}
              >
                <i className="fa fa-map-marker-alt text-danger mr-2" />
                <span>{data?.villageName}</span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="primary" onClick={() => setShow(false)}>
            <i className="icon-close mr-1" />
            ຍົກເລີກ
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
