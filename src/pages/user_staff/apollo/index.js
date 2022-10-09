import { gql } from "@apollo/client";

export const QUERY_USER_STAFF = gql`
 query Users($noLimit: Boolean, $limit: Int, $skip: Int, $orderBy: OrderByInput, $where: UserWhereInput) {
  users(noLimit: $noLimit, limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      _id
      profileImage
      firstName
      lastName
      gender
      phoneNumber
      password
      carSign
      status
      basicSalary
      role
      province {
      _id
        provinceName
      }
      district {
      _id
        title
      }
      village {
      _id
        title
      }
      house {
        houseName
        _id
      }
      startWorkTime
      endWorkTime
    }
  }
}
`;
export const ADD_USERSTAFF = gql`
  mutation CreateUser($data: UserInput!) {
    createUser(data: $data) {
      _id
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($data: UserInput!, $where: UserWhereInputOne!) {
    updateUser(data: $data, where: $where) {
      _id
    }
  }
`;
export const DELETE_USER = gql`
  mutation DeleteUser($where: UserWhereInputOne!) {
    deleteUser(where: $where) {
      _id
    }
  }
`;
