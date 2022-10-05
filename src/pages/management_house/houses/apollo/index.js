import { gql } from "@apollo/client";
export const ADD_HOUSE = gql`
  mutation CreateHouse($data: HouseInput!) {
    createHouse(data: $data) {
      _id
    }
  }
`;
export const QUERY_HOUSE = gql`
query Houses(
  $noLimit: Boolean
  $limit: Int
  $skip: Int
  $orderBy: OrderByInput
  $where: HouseWhereInput
) {
  houses(
    noLimit: $noLimit
    limit: $limit
    skip: $skip
    orderBy: $orderBy
    where: $where
  ) {
    total
    data {
      _id
      houseName
      houseCode
      powerTime
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
      map_lat
      map_lng
      coverImage
      contactPhone
      contactEmail
      contactWebsite
      mainHouses
      public
      type {
      _id
      title_lao
      title_eng
    }
      createdAt
      createdBy {
        firstName
      }
      type {
        _id
        title_lao
        title_eng
      }
    }
  }
}
`;
export const EDIT_HOUSE = gql`
  mutation UpdateHouse($data: HouseInput!, $where: HouseWhereInputOne!) {
    updateHouse(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_HOUSE = gql`
  mutation DeleteHouse($where: HouseWhereInputOne!) {
    deleteHouse(where: $where) {
      _id
    }
  }
`;
export const QUERY_TYPE_HOUSE = gql`
query TypeHouses {
  typeHouses {
    total
    data {
      _id
      title_lao
      title_eng
    }
  }
}
`;
