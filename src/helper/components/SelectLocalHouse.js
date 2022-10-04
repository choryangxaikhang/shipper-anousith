import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { getStaffLogin } from "..";
const QUERY = gql`
  query Data($where: HouseWhereInput) {
    houses(where: $where) {
      data {
        _id
        type {
          title_lao
          title_eng
        }
        houseName
      }
    }
  }
`;
export default function SelectLocalHouse({
  className,
  style,
  onChange,
  value,
  ownerId,
}) {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchValue, setSearchValue] = useState();
  const userState = getStaffLogin();
  const userData = userState?.data;

  const [fetchData, { data, loading }] = useLazyQuery(QUERY);

  useEffect(() => {
    let whereData = {};
    whereData = {
      houseName: searchValue ? searchValue : undefined,
      owner: ownerId,
    };
    if (userData?.role === "SUPER_ADMIN") {
      delete whereData.owner;
    }
    fetchData({
      variables: {
        where: {
          ...whereData,
        },
      },
    });
  }, [ownerId]);


  useEffect(() => {
    const results = data?.houses?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?._id,
          label: item?.houseName,
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
    <div style={{ width: "100%", color: "black", fontSize: 16 }}>
      <Select
        styles={style}
        className={className}
        value={selectedOption}
        placeholder={loading ? "ກຳລັງໂຫຼດ..." : "ເລືອກຊື່ກິດຈະການ"}
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
