import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";

const QUERY = gql`
  query Provinces {
    provinces {
      data {
        _id
        provinceName
      }
    }
  }
`;

export default function SelectProvince({
  className,
  style,
  onChange,
  disabled,
  value,
}) {
  const [getData, setData] = useState([]);
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
    const results = data?.provinces?.data || [];
    if (results?.length > 0) {
      const _results = results.map((_data) => {
        const object = {
          ..._data,
          value: _data?._id,
          label: _data?.provinceName,
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
      const result = getData?.filter((_data) => _data?._id === value);
      setSelectedOption(result[0] || null);
    } else {
      setSelectedOption(null);
    }
  }, [getData, value]);

  return (
    <div style={{ width: "100%", color:"black",fontSize:16 }}>
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກແຂວງ"}
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
