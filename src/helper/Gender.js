import React from "react";
import { Button } from "react-bootstrap";
export default function Gender({ value, onClick, classNameName, style }) {
  return (
    <div classNameName={`text-center ${classNameName}`} style={style}>
      <div classNameName="btn-group">
        <Button
          variant={value === "MALE" ? "primary" : "dark"}
          classNameName="fs-6"
          onClick={() => {
            if (onClick) onClick("MALE");
          }}
        >
          <i classNameName="fa fa-male" /> <span classNameName="ml-1">ຊາຍ</span>
        </Button>
        <Button
          variant={value === "FEMALE" ? "primary" : "dark"}
          classNameName="fs-6"
          onClick={() => {
            if (onClick) onClick("FEMALE");
          }}
        >
          <i classNameName="fa fa-female" /> <span classNameName="ml-1">ຍິງ</span>
        </Button>
        <Button
          variant={value === "OTHER" ? "primary" : "dark"}
          classNameName="fs-6"
          onClick={() => {
            if (onClick) onClick("OTHER");
          }}
        >
          <i classNameName="fa fa-venus-double" />{" "}
          <span classNameName="ml-1">ບໍ່ລະບຸ</span>
        </Button>
      </div>
    </div>
  );
}
