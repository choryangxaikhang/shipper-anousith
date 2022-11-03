import { gql } from "@apollo/client";
export const LOGIN_USER = gql`
mutation Mutation($where: StaffLoginWhere!) {
  staffLogin(where: $where) {
    accessToken
  }
}
`;
