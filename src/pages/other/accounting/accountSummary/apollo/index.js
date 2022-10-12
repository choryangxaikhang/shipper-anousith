import { gql } from "@apollo/client";
export const CREATE_ACCOUNT_SUMMARY = gql`
mutation CreateAccountingSummary($data: AccountingSummaryInput!) {
  createAccountingSummary(data: $data) {
    _id
  }
}
`;
// error
export const QUERY_BRANCH = gql`
  query Data(
    $where: BranchWhereInput
    $skip: Int
    $limit: Int
    $orderBy: OrderByInput
  ) {
    branches(where: $where, skip: $skip, limit: $limit, orderBy: $orderBy) {
      data {
        id_branch
        branch_name
        branch_address
        branch_code
        address_info
        provinceID {
          id_state
          provinceName
          provinceCode
          province_map_lat
          province_map_lng
          addressInfo
        }
        mainBranches
        districtName
        public
        sameday_public
        branch_type
        districtNextDay {
          id_district
          districtName
        }
        percentOfCOD
        percentOfPickup
        percentOfCom
      }
      total
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
