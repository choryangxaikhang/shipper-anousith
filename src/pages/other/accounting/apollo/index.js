import { gql } from "@apollo/client";
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

export const QUERY_EXTRA_EXPENSE = gql`
 query ExtraExpenses(
    $where: ExtraExpenseWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    extraExpenses(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id_list
        detail
        incomeKIP
        expenseKIP
        endBalanceKIP
        accountantDate
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
        StaffFullName
        extraType
        fileUpload
        createdAt
        updatedAt
        confirmStatus
        confirmDate
        confirmBy {
          _id
          firstName
          lastName
        }
      }
    }
  }
`;

export const QUERY_SUMMARY_EXPENSE = gql`
 query SummaryExtraExpense($where: ExtraExpenseWhereInput) {
  summaryExtraExpense(where: $where) {
    totalIncome
    totalExpense
    totalEndBalance
  }
}
`;

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


export const UPDATE_EXTRA_EXPENSE = gql`
  mutation UpdateExtraExpense(
    $data: ExtraExpenseInput!
    $where: ExtraExpenseWhereInputOne!
  ) {
    updateExtraExpense(data: $data, where: $where) {
      id_list
    }
  }
`;
export const DELETE_EXTRA_EXPENSE = gql`
  mutation DeleteExtraExpense($where: ExtraExpenseWhereInputOne!) {
    deleteExtraExpense(where: $where) {
      id_list
    }
  }
`;


export const CREATE_EXPENSES = gql`
  mutation CreateExtraExpense($data: ExtraExpenseInput!) {
    createExtraExpense(data: $data) {
      id_list
    }
  }
`;

export const SUMMARY_EXTRA_EXPENSE = gql`
 query ExtraExpenses(
    $where: ExtraExpenseWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    extraExpenses(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id_list
        incomeKIP
        expenseKIP
        endBalanceKIP
        accountantDate
        extraType
      }
    }
  }
`;