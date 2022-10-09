import React from "react";
import { Button } from "react-bootstrap";
export default function Gender({ value, onClick, className, style }) {
  return (
    <div className={`text-center ${className}`} style={style}>
      <div className="btn-group">
        <Button
          variant={value === "MALE" ? "primary" : "dark"}
          className="fs-6"
          onClick={() => {
            if (onClick) onClick("MALE");
          }}
        >
          <i className="fa fa-male" /> <span className="ml-1">ຊາຍ</span>
        </Button>
        <Button
          variant={value === "FEMALE" ? "primary" : "dark"}
          className="fs-6"
          onClick={() => {
            if (onClick) onClick("FEMALE");
          }}
        >
          <i className="fa fa-female" /> <span className="ml-1">ຍິງ</span>
        </Button>
        <Button
          variant={value === "OTHER" ? "primary" : "dark"}
          className="fs-6"
          onClick={() => {
            if (onClick) onClick("OTHER");
          }}
        >
          <i className="fa fa-venus-double" />{" "}
          <span className="ml-1">ບໍ່ລະບຸ</span>
        </Button>
      </div>
    </div>
  );
}
