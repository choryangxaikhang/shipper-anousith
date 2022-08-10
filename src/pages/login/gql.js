import { gql } from "@apollo/client";
export const EMPLOYEE_LOGIN = gql`
mutation EmployeeLogin($where: EmployeeLoginInput) {
  employeeLogin(where: $where) {
    accessToken
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
      role
    }
  }
}
`;