import { gql } from "@apollo/client";
export const USERS = gql`
  query Users(
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $where: UserWhereInput
  ) {
    users(orderBy: $orderBy, skip: $skip, limit: $limit, where: $where) {
      data {
        _id
        profileImage
        firstName
        lastName
        gender
        province {
          provinceName
        }
        district {
          _id
          title
        }
        village {
          _id
          title
        }
        phoneNumber
        status
        carSign
        basicSalary
        role
        startWorkTime
        endWorkTime
      }
    }
  }
`;
