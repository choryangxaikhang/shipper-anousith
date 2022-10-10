import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";

const QUERY = gql`
  query Equiments($where: EquimentWhereInput) {
    equiments(where: $where) {
      data {
        title
        _id
      }
    }
  }
`;
export default function SelectEquiment({
  className,
  style,
  onChange,
  disabled,
  value,
}) {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fetchData, { data, loading }] = useLazyQuery(QUERY);
  useEffect(() => {
    fetchData({
      variables: {
        where: {},
      },
    });
  }, []);

  useEffect(() => {
    const results = data?.equiments?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?._id,
          label: item?.title,
        };
        return object;
      });
      setItems(_results);
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
        width: "60%",
        color: "black",
        fontSize: 16,
        position: "fixed",
        zIndex: 999,
      }}
    >
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກຊື່ຊັບສິນ"}
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
