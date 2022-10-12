import { gql } from "@apollo/client";


export const QUERY_EXPENSE_TYPE = gql`
  query ExpenseTypes(
    $where: ExpenseTypeWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    expenseTypes(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id_expense
        expenseTitle
      }
    }
  }
`;
export const CREATE_EXPENSE_TYPE = gql`
  mutation CreateExpenseType($data: ExpenseTypeInput!) {
    createExpenseType(data: $data) {
      id_expense
    }
  }
`;


export const UPDATE_EXPENSE_TYPE = gql`
  mutation UpdateExpenseType(
    $data: ExpenseTypeInput!
    $where: ExpenseTypeWhereInputOne
  ) {
    updateExpenseType(data: $data, where: $where) {
      id_expense
    }
  }
`;
export const DELETE_EXPENSE_TYPE = gql`
  mutation DeleteExpenseType($where: ExpenseTypeWhereInputOne!) {
    deleteExpenseType(where: $where) {
      id_expense
    }
  }
`;