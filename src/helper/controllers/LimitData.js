import React from "react";
import { currency } from "..";

export default function LimitData({
  numberRows,
  onChangeRows,
  onSearch,
  numberPage,
  total,
}) {
  return (
    <>
      <div className="form-group row col-md-4">
        <label htmlFor="searchValue">ຄົ້ນຫາ</label>
        <input
          type="text"
          className="form-control form-control-lg mt-2"
          placeholder="ຄົ້ນຫາ..."
          onChange={onSearch}
        />
      </div>
      <div className="flex">
        <div className="float-left ml-2">
          <span>
            ສະເເດງ {numberRows * numberPage - numberRows + 1} {"-"}{" "}
            {numberRows * numberPage} ລາຍການ ໃນຂໍ້ມູນທັງໜົດ{" "}
            {currency(total ?? "")} ລາຍການ
          </span>
        </div>

        <div className="mb-2 form-inline justify-content-end">
          <label for="sel-rows">ສະແດງ:</label>
          <div style={{ padding: "4px" }} />
          <select
            id="sel-rows"
            className="form-control form-control-lg ml-2"
            onChange={(e) => {
              onChangeRows(e);
            }}
            value={numberRows}
          >
            <option value={""} selected={numberRows === "" ? true : false}>
              ທັງໝົດ
            </option>
            <option value="50" selected={numberRows === 50 ? true : false}>
              50 ລາຍການ
            </option>
            <option value="100" selected={numberRows === 100 ? true : false}>
              100 ລາຍການ
            </option>
            <option value="500" selected={numberRows === 500 ? true : false}>
              500 ລາຍການ
            </option>
            <option value="1000" selected={numberRows === 1000 ? true : false}>
              1,000 ລາຍການ
            </option>
            <option value="5000" selected={numberRows === 5000 ? true : false}>
              5,000 ລາຍການ
            </option>
            <option
              value="10000"
              selected={numberRows === 100000 ? true : false}
            >
              10,000 ລາຍການ
            </option>
            <option
              value="100000"
              selected={numberRows === 1000000 ? true : false}
            >
              100,000 ລາຍການ
            </option>
          </select>
        </div>
      </div>
    </>
  );
}
