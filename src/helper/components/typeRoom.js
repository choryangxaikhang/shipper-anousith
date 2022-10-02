import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { loadingData } from "..";
import { QUERY_TYPE_ROOM } from "./apollo";
export default function TypeRoom({
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
  const [fetchData, { data, loading }] = useLazyQuery(QUERY_TYPE_ROOM);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          title_lao: searchValue ? searchValue : undefined,
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
      const result = data?.typeRooms?.data?.filter(
        (obj) => obj?.title_lao === value
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
        value={defaultValue ? defaultValue : "ເລືອກປະເພດຫ້ອງ..."}
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
          <Modal.Title className="fs-5">ເລືອກປະເພດຫ້ອງ</Modal.Title>
        </Modal.Header>
        <Modal.Body >
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

              {data?.typeRooms?.data?.map((data, index) => (
                <div
                  className="d-flex py-2 border-bottom"
                  key={index}
                  onClick={() => handleClick(data?.title_lao)}
                >
                  <span className="text-black">
                    {" "}
                    <i class="fa-solid fa-hotel me-1"/>
                    {data?.title_lao}
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
