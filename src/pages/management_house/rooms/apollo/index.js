import { gql } from "@apollo/client";
export const CREATE_ROOM = gql`
  mutation CreateRoom($data: RoomInput!) {
    createRoom(data: $data) {
      _id
    }
  }
`;
export const QUERY_ROOM = gql`
  query Rooms(
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: RoomWhereInput
  ) {
    rooms(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        title_lao
        title_eng
        priceHalf
        priceFull
        status
        detail
        createdAt
        typeRoom {
          _id
          title_lao
        }
        house {
          _id
          houseName
        }
        coverImage
        images
      }
    }
  }
`;

export const EDIT_ROOM = gql`
  mutation UpdateRoom($data: RoomInput!, $where: RoomWhereInputOne!) {
    updateRoom(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($where: RoomWhereInputOne!) {
    deleteRoom(where: $where) {
      _id
    }
  }
`;
