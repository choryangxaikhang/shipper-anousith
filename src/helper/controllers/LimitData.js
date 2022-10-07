import React, { useEffect, useState } from "react";
import { currency } from "..";
export default function LimitData({
  numberRows,
  onChangeRows,
  onSearch,
  numberPage,
  total,
  returnValue,
  hiddenSearch,
  col,
}) {
  const [_onSearches, setOnSearch] = useState("`");
  useEffect(() => {
    if (_onSearches === "") {
      onSearch(_onSearches);
    }
  }, [_onSearches]);

  function _onSearch() {
    onSearch(_onSearches);
  }
  const _handleKeypress = (e) => {
    if (e.key === "Enter") {
      _onSearch();
    }
  };

  return (
    <>
      <div
        className={
          hiddenSearch === "HideSearch" ? "col-md-4 pt-2" : "col-md-5 pt-2"
        }
      >
        <span>
           {numberRows * numberPage - numberRows + 1} {"-"}{" "}
          {numberRows * numberPage}ໃນຈຳນວນ {currency(total ?? "")}{" "}
          ລາຍການ
        </span>
      </div>
      <div className={`col-${col}`}></div>
      {hiddenSearch === "HideSearch" ? null : (
        <>
          <div className="col-md-3">
            <div className="input-group">
              <input
                type="search"
                className="form-control form-control-lg"
                placeholder="ຄົ້ນຫາ..."
                onChange={(e) => {
                  setOnSearch(e.target.value);
                }}
                onKeyPress={_handleKeypress}
              />
              <button
                type="button"
                onClick={() => _onSearch()}
                className="btn btn-primary btn-sm"
              >
                <i className="icon-search1" />
              </button>
            </div>
          </div>
        </>
      )}

      <div className="col-md-2">
        <select
          id="sel-rows"
          className="form-control form-control-lg"
          onChange={(e) => {
            onChangeRows(e);
          }}
          defaultValue={numberRows}
        >
          <option
            value={total}
            defaultValue={numberRows === total ? true : false}
          >
            ທັງໝົດ
          </option>
          <option value="50" defaultValue={numberRows === 50 ? true : false}>
            50 ລາຍການ
          </option>
          <option value="100" defaultValue={numberRows === 100 ? true : false}>
            100 ລາຍການ
          </option>
          <option value="500" defaultValue={numberRows === 500 ? true : false}>
            500 ລາຍການ
          </option>
          <option
            value="1000"
            defaultValue={numberRows === 1000 ? true : false}
          >
            1,000 ລາຍການ
          </option>
          <option
            value="5000"
            defaultValue={numberRows === 5000 ? true : false}
          >
            5,000 ລາຍການ
          </option>
          <option
            value="10000"
            defaultValue={numberRows === 100000 ? true : false}
          >
            10,000 ລາຍການ
          </option>
          <option
            value="100000"
            defaultValue={numberRows === 1000000 ? true : false}
          >
            100,000 ລາຍການ
          </option>
        </select>
      </div>
    </>
  );
}
