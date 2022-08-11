import { gql } from "@apollo/client";
export const QUERY_PAYROLL_SUMMARY = gql`
query PayrollSummaries($noLimit: Boolean, $limit: Int, $skip: Int, $orderBy: OrderByInput, $where: PayrollSummaryWhereInput) {
  payrollSummaries(noLimit: $noLimit, limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      _id
      empID {
        cvID
        _id
        profileImage
      }
      consolidatedAt
      basicSalary
      positionSalary
      livingSalary
      extraIncome
      otIncome
      bonusIncome
      diligentIncome
      deductionExpense
      borrowExpense
      taxIncome
      InsuranceExpense
      finalIncome
      approveStatus
      approvedDate
      approvedBy {
        cvID
        profileImage
      }
      paidStatus
      paidDate
      ibankID
      forMonth
      forYear
      confirmStatus
      confirmedDate
    }
  }
}
`;

export const UPDATE = gql`
mutation UpdatePayrollSummary($data: PayrollSummaryInput!, $where: PayrollSummaryWhereInputOne) {
  updatePayrollSummary(data: $data, where: $where) {
    _id
  }
}
`;

export const QUERY_EXTRA = gql`
query ExtraIncomes($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: ExtraIncomeWhereInput) {
  extraIncomes(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      note
    }
  }
}
`;
