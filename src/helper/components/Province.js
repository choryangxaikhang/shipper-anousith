import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { loadingData } from "..";
import { PROVINCES } from "./apollo";
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
  // console.log(defaultValue)
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
        className={`form-control text-left ${inputSize} ${className}`}
        style={{ textAlign:'left' }}
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
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">ເລືອກແຂວງ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="form-group mb-2">
            <input
              type={"search"}
              className="form-control form-control-lg"
              onChange={(e) => setSearchValue(e.target.value)}
              onInput={(e) => {
                if (!e.target.value && getData) getData();
              }}
              placeholder="ຄົ້ນຫາ"
            />
          </div>
          {loading ? (
            <center>{loadingData(25, "ກຳລັງໂຫຼດຂໍ້ມູນ...")}</center>
          ) : (
            <div className="mt-1 ">

              {data?.provinces?.data?.map((data, index) => (
                <div
                  className="d-flex py-2 border-bottom"
                  key={index}
                  onClick={() => handleClick(data?.provinceName)}
                >
                  <span className="text-black">
                    {" "}
                    <i className="fa fa-map-marker-alt text-danger mr-2" />{" "}
                    {data?.provinceName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="primary" onClick={() => setShow(false)}>
            <i className="icon-close " />
            ຍົກເລີກ
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
