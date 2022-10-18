import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { loadingData } from "..";
import { PROVINCES } from "./apollo";
export default function Provinces({
  style,
  classNameName,
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
        classNameName={`form-control text-left ${inputSize} ${classNameName}`}
        style={{ textAlign:'left' }}
        value={defaultValue ? defaultValue : "ເລືອກແຂວງ..."}
        onClick={() => setShow(true)}
      />
      <Modal
        show={show}
        centered
        style={style}
        classNameName={classNameName}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title classNameName="fs-5">ເລືອກແຂວງ</Modal.Title>
        </Modal.Header>
        <Modal.Body classNameName="custom-modal-body">
          <div classNameName="form-group mb-2">
            <input
              type={"search"}
              classNameName="form-control form-control-lg"
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
            <div classNameName="mt-1 ">

              {data?.provinces?.data?.map((data, index) => (
                <div
                  classNameName="d-flex py-2 border-bottom"
                  key={index}
                  onClick={() => handleClick(data?.provinceName)}
                >
                  <span classNameName="text-black">
                    {" "}
                    <i classNameName="fa fa-map-marker-alt text-danger mr-2" />{" "}
                    {data?.provinceName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="primary" onClick={() => setShow(false)}>
            <i classNameName="icon-close " />
            ຍົກເລີກ
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
