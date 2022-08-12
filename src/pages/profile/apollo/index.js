import { gql } from "@apollo/client";
export const EMPLOYEE_QUEY = gql`
query Employees($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: EmployeeWhereInput, $noLimit: Boolean) {
  employees(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where, noLimit: $noLimit) {
    total
    data {
      _id
      cvID
      profileImage
      firstName
      lastName
      gender
      dateOfBirth
      age
      phoneNumber
      workStartDate
      workEndDate
      department {
        title_lao
      }
      team {
        title_lao
      }
      province {
        provinceName
      }
      district {
        title
      }
      village
      taxIncome
      basicSalary
      positionSalary
      InsuranceExpense
      status
      role
      createdAt
    }
  }
}
`;
