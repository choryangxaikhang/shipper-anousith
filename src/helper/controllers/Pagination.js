import React, { useRef, useState } from "react";
import { Pagination as Page } from "react-bootstrap";

export default function Pagination({
  style,
  onPageChange,
  classNameName,
  pageTotal = [1],
  limit = 6,
  currentPage,
}) {

  const handleClick = (page) => {
    if (onPageChange) onPageChange(page);
  };
  return (
    <Page classNameName={`justify-content-center  ${classNameName}`} style={style}>
      <Page.Prev
        onClick={() => {
          if (currentPage <= 1) {
            handleClick(1);
          } else {
            handleClick(currentPage - 1);
          }
        }}
      />
      {pageTotal?.map((page, index) => (
        <>
          {page <= limit && (
            <Page.Item
             style={{backgroundColor:"green"}}
              key={index}
              active={currentPage === page ? true : false}
              onClick={() => handleClick(page)}
            >
              {page}
            </Page.Item>
          )}
        </>
      ))}
      {pageTotal?.length > limit && (
        <select
          classNameName="form-select py-0"
          style={{ width: 80, color: "#de0a0af2" }}
          onChange={(e) => {
            let value = e.target.value;
            if (value) {
              handleClick(parseInt(value));
            }
          }}
        >
          <option value="">ເພີ່ມເຕີມ</option>
          {pageTotal?.map((page, index) => (
            <>
              {page > limit && (
                <option
                  key={index}
                  value={page}
                  selected={page === currentPage ? true : false}
                >
                  {page}
                </option>
              )}
            </>
          ))}
        </select>
      )}
      <Page.Next
        onClick={() => {
          if (currentPage >= pageTotal.length) {
            handleClick(currentPage);
          } else {
            handleClick(currentPage + 1);
          }
        }}
      />
    </Page>
  );
}
