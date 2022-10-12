import { gql } from "@apollo/client";

export const QUERY_INCOME_TYPE = gql`
  query IncomeTypes(
    $where: IncomeTypeWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    incomeTypes(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id_income
        incomeTitle
      }
    }
  }
`;
export const CREATE_INCOME_TYPE = gql`
  mutation CreateIncomeType($data: IncomeTypeInput!) {
    createIncomeType(data: $data) {
      id_income
    }
  }
`;
export const UPDATE_INCOME_TYPE = gql`
  mutation UpdateIncomeType(
    $data: IncomeTypeInput!
    $where: IncomeTypeWhereInputOne
  ) {
    updateIncomeType(data: $data, where: $where) {
      id_income
    }
  }
`;

export const DELETE_INCOME_TYPE = gql`
  mutation DeleteIncomeType($where: IncomeTypeWhereInputOne!) {
    deleteIncomeType(where: $where) {
      id_income
    }
  }
`;