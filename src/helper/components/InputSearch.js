import React, { useRef } from "react";
export default function InputSearch({
  classNameName,
  style,
  onChange,
  loading,
  placeholder,
}) {
  const inputRef = useRef();
  return (
    <div classNameName={`d-flex align-items-center ${classNameName}`} style={style}>
      <div classNameName="form-group input-group ">
        <input
          type={"search"}
          ref={inputRef}
          classNameName="form-control text-center form-control-lg bg-white"
          placeholder={placeholder ? placeholder : "ຄົ້ນຫາ..."}
          onChange={onChange ? onChange : undefined}
          onInput={(e) => {
            if (!e.target.value) {
              inputRef.current.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
