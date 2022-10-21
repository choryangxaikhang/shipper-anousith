import { gql } from "@apollo/client";
export const CUSTOMER = gql`
  query Customers(
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: CustomerWhereInput
    $noLimit: Boolean
  ) {
    customers(
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        fullName
        phoneNumber
      }
    }
  }
`;

export const PROVINCES = gql`
  query Provinces(
    $where: ProvinceWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    provinces(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      data {
        _id
        provinceName
        provinceCode
        province_map_lat
        province_map_lng
        addressInfo
      }
    }
  }
`;

export const DISTRICTS = gql`
  query Data($where: DistrictWhereInput) {
    districts(where: $where) {
      data {
        _id
        title
        province {
          _id
          provinceName
        }
      }
    }
  }
`;

export const USER = gql`
  query Users($where: UserWhereInput) {
  users(where: $where) {
    data {
      _id
      firstName
      lastName
    }
  }
}
`;