import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { loadingData } from "..";
import { DISTRICTS } from "./apollo";

export default function District({
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
  const [fetchData, { data, loading }] = useLazyQuery(DISTRICTS);

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          title: searchValue ? searchValue : undefined,
          ...where,
        },
        limit: 100,
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
      const result = data?.districts?.data?.filter(
        (obj) => obj?.title === value
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
        className={`form-control text-left ${inputSize} ${className}`}
        style={{ opacity: defaultValue ? 1 : 0.3 }}
        value={defaultValue ? defaultValue : "ເລືອກເມືອງ"}
        onClick={() => setShow(true)}
        disabled={disabled}
      />
      <Modal
        show={show}
        centered
        style={style}
        className={className}
        onHide={() => setShow(false)}
        animation={true}
      >
        <Modal.Body className="custom-modal-body">
          <div class="form-group mb-1 basic">
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
              <div
                className="d-flex py-1 border-bottom align-items-center"
                onClick={() => handleClick("")}
              >
                <i className="fa fa-map-marker-alt text-primary mr-2" />
                <span className="text-primary">ເລືອກຄ່າເລີ່ມຕົ້ນ</span>
              </div>

              {data?.districts?.data?.map((data, index) => (
                <div
                  className="d-flex py-2 border-bottom align-items-center"
                  key={index}
                  onClick={() => handleClick(data?.title)}
                >
                  <i className="fa fa-map-marker-alt text-primary mr-2" />
                  <span className="text-primary">{data?.title}</span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            size="lg"
            className="btn btn-primary btn-block rounded"
            onClick={() => setShow(false)}
          >
            <i className="icon-close " />
            ຍົກເລີກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
