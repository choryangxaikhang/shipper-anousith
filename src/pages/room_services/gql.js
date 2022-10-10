import { gql } from "@apollo/client";

export const BOOKINGS = gql`
  query Bookings($where: BookingWhereInput) {
    bookings(where: $where) {
      total
      data {
        _id
      }
    }
  }
`;
