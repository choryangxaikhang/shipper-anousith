import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { getLocalHouse } from "..";

const SELECT_ROOM = gql`
  query TypeRooms($where: TypeRoomWhereInput) {
    typeRooms(where: $where) {
      total
      data {
        _id
        title_lao
        title_eng
      }
    }
  }
`;
export default function SearchTypeRoom({
  className,
  style,
  onChange,
  disabled,
  value,
}) {
  const [items, setItems] = useState([]);
  const [localHouse, setLocalHouse] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [fetchData, { data: data, loading: loading }] = useLazyQuery(
    SELECT_ROOM,
    { fetchPolicy: "network-only" }
  );
  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          // house:localHouse,
        },
      },
      orderBy: "createdAt_DESC",
    });
  }, [localHouse]);

  useEffect(() => {
    const results = data?.typeRooms?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?._id,
          label: item?.title_lao + " / " + item?.title_eng,
        };
        return object;
      });
      setItems([{ value: "", label: "ທັງຫມົດ" }, ..._results]);
    } else {
      setItems([]);
    }
  }, [data]);

  //set value
  useEffect(() => {
    if (value) {
      const result = items?.filter((item) => item?._id === value);
      setSelectedOption(result[0] || null);
    } else {
      setSelectedOption(null);
    }
  }, [items, value]);
  return (
    <div
      style={{
        width: "100%",
        fontSize: 16,
        color: "black",
      }}
    >
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກປະເພດຫ້ອງ"}
        onChange={(res) => {
          setSelectedOption(res);
          if (onChange) {
            onChange(res);
          }
        }}
        options={items}
      />
    </div>
  );
}
