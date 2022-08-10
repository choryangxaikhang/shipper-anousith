import { gql } from "@apollo/client";

export const PROVINCES = gql`
query Provinces($where: ProvinceWhereInput, $orderBy: OrderByInput, $skip: Int) {
  provinces(where: $where, orderBy: $orderBy, skip: $skip) {
    total
    data {
      provinceName
      _id
      provinceCode
      province_map_lat
      province_map_lng
      addressInfo
      createdAt
    }
  }
}
`;

export const DISTRICTS = gql`
query Districts($where: DistrictWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  districts(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      _id
      title
      distCode
      createdAt
    }
  }
}
`;
export const ROOM = gql`
  query Rooms(
    $where: RoomWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    rooms(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        title_lao
        title_eng
      }
    }
  }
`;
