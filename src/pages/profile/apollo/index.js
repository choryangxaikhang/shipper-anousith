import { gql } from "@apollo/client";

export const QUERY_PROFILE = gql`
  query Customers(
    $where: CustomerWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    customers(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        profileImage
        fullName
        gender
        phoneNumber
        province {
          provinceName
          _id
        }
        district {
          _id
          title
        }
        village
        status
        point
        note
        createdAt
        createdBy {
          _id
          profileImage
          firstName
          lastName
          phoneNumber
        }
      }
    }
  }
`;
export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer(
    $data: CustomerInput!
    $where: CustomerWhereInputOne!
  ) {
    updateCustomer(data: $data, where: $where) {
      _id
    }
  }
`;
export const QUERY_CUSTOMER = gql`
  query Customers(
    $where: CustomerWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    customers(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        profileImage
        fullName
        gender
        phoneNumber
        password
        province {
          _id
          provinceName
        }
        district {
          _id
          title
        }
        village
        status
        note
        createdAt
      }
    }
  }
`;
