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
      forMonth
      forYear
      confirmStatus
      confirmedDate
      ibankID {
        _id
      }
    }
  }
}
`;
