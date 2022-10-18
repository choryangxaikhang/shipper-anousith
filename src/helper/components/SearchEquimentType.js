import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { getLocalHouse } from "..";

const QUERY = gql`
  query EquimentTypes($where: EquimentTypeWhereInput) {
    equimentTypes(where: $where) {
      data {
        title
        _id
      }
    }
  }
`;
export default function SearchEquimentType({
  classNameName,
  style,
  onChange,
  disabled,
  value,
}) {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  // const [fetchData, { data, loading }] = useLazyQuery(QUERY);
  const [localHouse, setLocalHouse] = useState("");
  const [fetchData, { data: data, loading: loading }] = useLazyQuery(QUERY, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    setLocalHouse(getLocalHouse());
  }, []);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          house: localHouse?._id,
        },
      },
    });
  }, [localHouse]);

  useEffect(() => {
    const results = data?.equimentTypes?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?._id,
          label: item?.title,
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
    <div style={{ minWidth: 200, color: "black", fontSize: 16 }}>
      <Select
        styles={style}
        classNameName={classNameName}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກຫມວດຊັບສິນ"}
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
