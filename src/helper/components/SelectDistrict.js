import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";

const QUERY = gql`
  query Districts($where: DistrictWhereInput) {
    districts(where: $where) {
      data {
        title
        id_list
        id_state {
          id_state
          provinceName
        }
      }
    }
  }
`;

export default function SelectDistrict({
  className,
  style,
  onChange,
  disabled,
  value,
  provinceId,
}) {
  const [getData, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [fetchData, { data, loading }] = useLazyQuery(QUERY);

  console.log("data", data);
  console.log("provinceId", provinceId);

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          // id_state: "1",
        },
      },
    });
  }, [provinceId]);

  useEffect(() => {
    const results = data?.districts?.data || [];
    console.log("dataRR", results);
    if (results?.length > 0) {
      const _results = results.map((_data) => {
        const object = {
          ..._data,
          value: _data?.id_list,
          label: _data?.title,
        };
        return object;
      });
      setData(_results);
    } else {
      setData([]);
    }
  }, [data]);

  //set value
  useEffect(() => {
    if (value) {
      const result = getData?.filter((_data) => _data?.id_list === value);
      setSelectedOption(result[0] || null);
    } else {
      setSelectedOption(null);
    }
  }, [getData, value]);

  return (
    <div style={{ width: "100%", color: "black", fontSize: 16 }}>
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກເມືອງ"}
        onChange={(res) => {
          setSelectedOption(res);
          if (onChange) {
            onChange(res);
          }
        }}
        options={getData}
      />
    </div>
  );
}
