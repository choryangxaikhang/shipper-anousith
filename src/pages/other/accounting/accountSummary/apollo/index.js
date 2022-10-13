import { gql } from "@apollo/client";
export const CREATE_ACCOUNT_SUMMARY = gql`
mutation CreateAccountingSummary($data: AccountingSummaryInput!) {
  createAccountingSummary(data: $data) {
    _id
  }
}
`;

export const QUERY_SUMMARY_ACCOUNT = gql`
  query AccountingSummaries($where: AccountingSummaryWhereInput, $limit: Int, $skip: Int, $orderBy: OrderByInput) {
  accountingSummaries(where: $where, limit: $limit, skip: $skip, orderBy: $orderBy) {
    total
    data {
      _id
      incomeKIP
      incomeTHB
      incomeUSD
      expenseKIP
      expenseTHB
      expenseUSD
      endBalanceKIP
      endBalanceTHB
      endBalanceUSD
      accountingDate
      createdAt
      house {
          _id
          houseName
          houseCode
          contactPhone
          type{
          title_lao
          title_eng
          }
        }
      createdBy {
        firstName
        lastName
      }
    }
  }
}
`;

export const DELETE_ACCOUNT_SUMMARY = gql`
mutation DeleteAccountingSummary($where: AccountingSummaryWhereInputOne!) {
  deleteAccountingSummary(where: $where) {
    _id
  }
}
`;

export const UPDATE_ACCOUNT_SUMMARY = gql`
mutation UpdateAccountingSummary($data: AccountingSummaryInput!, $where: AccountingSummaryWhereInputOne!) {
  updateAccountingSummary(data: $data, where: $where) {
    _id
  }
}
`;
