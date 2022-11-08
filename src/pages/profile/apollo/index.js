import { gql } from "@apollo/client";
export const USERS = gql`
 query Users($where: UserWhereInput, $limit: Int, $skip: Int) {
  users(where: $where, limit: $limit, skip: $skip) {
    total
    data {
      _id
      cvID
      profileImage
      firstName
      lastName
      gender
      age
      phoneNumber
      workStartDate
      province {
        _id
        title
      }
      district {
        _id
        title
      }
      village {
        _id
        title
      }
      branch {
        _id
        title
      }
      status
      role
    }
  }
}
`;
