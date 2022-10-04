import { gql } from "@apollo/client";
export const QUERY_HOUSE = gql`
  query Query(
    $where: HouseWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    houses(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        houseName
        public
        owner{
          _id
          firstName
          lastName
        }
      }
    }
  }
`;
export const UPDATE_HOUSE = gql`
  mutation Mutation($data: HouseInput!, $where: HouseWhereInputOne!) {
    updateHouse(data: $data, where: $where) {
      _id
    }
  }
`;
export const QUERY_BRANCHES = gql`
  query Branches(
    $where: BranchWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    branches(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id_branch
        branch_name
        public
        address_info
        codDay
        map_lat
        map_lng
        powerTime
        percentOfCom
        percentOfPickup
        percentOfCOD
        timeScanOut
        timeScanIn
        provinceID {
        _id
        }
      }
    }
  }
`
export const QUERY_COMMISSIONS_FRANSHISE = gql`
  query Branches(
    $where: BranchWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    branches(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id_branch
        branch_name
        percentOfCom
        percentOfPickup
        percentOfCOD
        mainBranches
      }
    }
  }
`;
export const QUERY_USERS = gql`
  query Users(
    $where: UserWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    users(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        firstName
        lastName
        phoneNumber
        password
        status
        role
      }
    }
  }
`;
export const QUERY_CUSTOMERS = gql`
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
        fullName
        phoneNumber
        password
        status
      }
    }
  }
`;

export const UPDATE_BRANCHES = gql`
mutation UpdateBranch($data: BranchInput!, $where: BranchWhereInputOne!) {
  updateBranch(data: $data, where: $where) {
    id_branch
  }
}
`;
 
export const UPDATE_USERS = gql`
  mutation Mutation($data: UserInput!, $where: UserWhereInputOne!) {
    updateUser(data: $data, where: $where) {
      _id
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




