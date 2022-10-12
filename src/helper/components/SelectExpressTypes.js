import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { getLocalHouse } from "..";

const QUERY = gql`
  query ExpenseTypes($where: ExpenseTypeWhereInput) {
  expenseTypes(where: $where) {
    data {
      id_expense
      expenseTitle
    }
  }
}
`;
export default function SelectExpressTypes({
  className,
  style,
  onChange,
  disabled,
  value,
}) {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fetchData, { data: data, loading: loading }] = useLazyQuery(QUERY, {
    fetchPolicy: "network-only",
  });
  const [localHouse, setLocalHouse] = useState("");
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
    const results = data?.expenseTypes?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?.id_expense,
          label: item?.expenseTitle,
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
      const result = items?.filter((item) => item?.id_expense === value);
      setSelectedOption(result[0] || null);
    } else {
      setSelectedOption(null);
    }
  }, [items, value]);

  return (
    <div style={{ width: "100%", color: "black", fontSize: 16 }}>
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກປະເພດລາຍຈ່າຍ"}
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
