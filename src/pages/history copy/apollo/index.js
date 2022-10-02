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
      ibankID {
      _id
      }
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
export const QUERY_OT = gql`
query OtIncomes($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: OtIncomeWhereInput) {
  otIncomes(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      note
    }
  }
}
`;
export const QUERY_BONUS = gql`
query BonusIncomes($where: BonusIncomeWhereInput, $skip: Int, $orderBy: OrderByInput, $limit: Int) {
  bonusIncomes(where: $where, skip: $skip, orderBy: $orderBy, limit: $limit) {
    total
    data {
      note
    }
  }
}
`;

export const QUERY_DEDUCTION = gql`
query Deductions($where: DeductionWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  deductions(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      note
    }
  }
}
`;
export const QUERY_BORROW = gql`
query BorrowOfPayrolls($where: BorrowOfPayrollWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  BorrowOfPayrolls(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      note
    }
  }
}
`;
export const QUERY_DILiGENT = gql`
query DiligentIncomes($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: DiligentIncomeWhereInput) {
  diligentIncomes(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      amountOf
      note
    }
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

