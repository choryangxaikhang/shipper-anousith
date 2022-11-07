import { gql } from "@apollo/client";
export const LOGIN_USER = gql`
mutation Mutation($data: UserLoginInput!) {
  userLogin(data: $data) {
    accessToken
  }
}
`;
