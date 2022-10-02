import { gql } from "@apollo/client";
export const LOGIN_USER = gql`
mutation StaffLogin($where: StaffLoginInput!) {
  staffLogin(where: $where) {
    accessToken
    data {
      _id
      profileImage
      firstName
      lastName
      phoneNumber
      house {
        _id
        houseName
        houseName_en
        houseCode
        contactPhone
        contactEmail
        contactWebsite
        coverImage
        map_lat
        map_lng
        province {
          _id
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
        powerTime
        createdAt
        type {
          title_lao
          title_eng
        }
      }
      carSign
      status
      role
      province {
        provinceName
        _id
      }
      district {
        title
        _id
      }
      village {
        _id
        title
      }
    }
  }
}
`;
