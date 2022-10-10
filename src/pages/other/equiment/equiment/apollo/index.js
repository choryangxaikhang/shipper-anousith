import { gql } from "@apollo/client";
export const ADD_EQUIMENT = gql`
  mutation CreateEquiment($data: EquimentInput!) {
    createEquiment(data: $data) {
      _id
    }
  }
`;
export const QUERY_EQUIMENT = gql`
  query Equiments(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: EquimentWhereInput
  ) {
    equiments(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        equimentType {
          _id
          title
        }
        title
        unit
        size
        price
        receiptDate
        status
        details
        createdAt
        total
      }
    }
  }
`;
export const EDIT_EQUIMENT = gql`
  mutation UpdateEquiment(
    $data: EquimentInput!
    $where: EquimentWhereInputOne
  ) {
    updateEquiment(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_EQUIMENT = gql`
  mutation DeleteEquiment($where: EquimentWhereInputOne!) {
    deleteEquiment(where: $where) {
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
