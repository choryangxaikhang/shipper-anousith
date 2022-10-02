import { gql } from "@apollo/client";
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
      }
    }
  }
`;