import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { loadingData } from "..";
import { USER } from "./apollo";

export default function ListUser({
  style,
  classNameName,
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
  const [fetchData, { data, loading }] = useLazyQuery(USER);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          firstName: searchValue ? searchValue : undefined,
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
      const result = data?.users?.data?.filter(
        (obj) => obj?.firstName === value
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
        classNameName={`form-control ${inputSize} ${classNameName}`}
        style={{ textAlign: "left" }}
        value={defaultValue ? defaultValue : "ຄົ້ນຫາ..."}
        onClick={() => setShow(true)}
      />
      <Modal
        show={show}
        centered
        style={style}
        classNameName={classNameName}
        animation={false}
      >
        <Modal.Header>
          <Modal.Title classNameName="fs-5">ເລືອກພະນັກງານ</Modal.Title>
        </Modal.Header>
        <Modal.Body classNameName="custom-modal-body">
          <div classNameName="form-group">
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
            <div classNameName="mt-1">

              {data?.users?.data?.map((data, index) => (
                <div
                  classNameName="d-flex py-2 border-bottom align-items-center text-black"
                  key={index}
                  onClick={() => handleClick(data?.firstName)}
                >
                  <span>
                    <i classNameName="fa fa-user text-danger mr-2" />{" "}
                    {data?.firstName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            classNameName="btn btn-block btn-danger"
            onClick={() => setShow(false)}
          >
            <i classNameName="icon-x" /> ຍົກເລີກ
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
