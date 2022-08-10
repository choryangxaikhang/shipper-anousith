import { gql } from "@apollo/client";
export const UPDATE_ROOM = gql`
  mutation UpdateRoom($data: RoomInput!, $where: RoomWhereInputOne!) {
    updateRoom(data: $data, where: $where) {
      _id
    }
  }
`;
export const CREATE_BOOKING = gql`
  mutation CreateBooking($data: BookingInput!) {
    createBooking(data: $data) {
      _id
    }
  }
`;
