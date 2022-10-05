import { gql } from "@apollo/client";
export const CREATE_TYPE = gql`
  mutation CreateTypeRoom($data: TypeRoomInput!) {
    createTypeRoom(data: $data) {
      _id
    }
  }
`;
export const QUERY_TYPE_ROOM = gql`
  query TypeRooms(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: TypeRoomWhereInput
  ) {
    typeRooms(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
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

export const EDIT_ROOM = gql`
  mutation UpdateTypeRoom(
    $data: TypeRoomInput!
    $where: TypeRoomWhereInputOne!
  ) {
    updateTypeRoom(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE = gql`
  mutation DeleteTypeRoom($where: TypeRoomWhereInputOne!) {
    deleteTypeRoom(where: $where) {
      _id
    }
  }
`;
