import { gql } from "@apollo/client";

export const CREATE_TYPE = gql`
  mutation CreateEquimentType($data: EquimentTypeInput!) {
    createEquimentType(data: $data) {
      _id
    }
  }
`;

export const QUERY_TYPE = gql`
  query EquimentTypes(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $where: EquimentTypeWhereInput
    $orderBy: OrderByInput
  ) {
    equimentTypes(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      where: $where
      orderBy: $orderBy
    ) {
      total
      data {
        _id
        title
        house {
          _id
          houseName
        }
      }
    }
  }
`;

export const UPDATE_TYPE = gql`
  mutation UpdateEquimentType(
    $data: EquimentTypeInput!
    $where: EquimentTypeWhereInputOne
  ) {
    updateEquimentType(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_TYPE = gql`
  mutation DeleteEquimentType($where: EquimentTypeWhereInputOne!) {
    deleteEquimentType(where: $where) {
      _id
    }
  }
`;
