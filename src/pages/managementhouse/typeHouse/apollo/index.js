import { gql } from "@apollo/client";
export const CREATE_TYPE = gql`
 mutation CreateTypeHouse($data: TypeHouseInput!) {
  createTypeHouse(data: $data) {
    _id
  }
}
`;
export const QUERY_TYPE_HOUSE = gql`
  query TypeHouses($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: TypeHouseWhereInput) {
  typeHouses(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      _id
      title_lao
      title_eng
      createdAt
      createdBy {
        firstName
        lastName
      }
    }
  }
}
`;

export const EDIT_TYPE_HOUSE = gql`
  mutation UpdateTypeHouse($data: TypeHouseInput!, $where: TypeHouseWhereInputOne!) {
  updateTypeHouse(data: $data, where: $where) {
    _id
  }
}
`;

export const DELETE = gql`
 mutation DeleteTypeHouse($where: TypeHouseWhereInputOne!) {
  deleteTypeHouse(where: $where) {
    _id
  }
}
`;
