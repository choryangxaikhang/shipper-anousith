import React, { useRef } from "react";
export default function InputSearch({
  className,
  style,
  onChange,
  loading,
  placeholder,
}) {
  const inputRef = useRef();
  return (
    <div className={`d-flex align-items-center ${className}`} style={style}>
      <div className="form-group input-group ">
        <input
          type={"search"}
          ref={inputRef}
          className="form-control text-center form-control-lg bg-white"
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
