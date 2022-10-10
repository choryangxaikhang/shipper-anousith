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

export const HOUSE = gql`
query Houses($where: HouseWhereInput, $limit: Int) {
  houses(where: $where, limit: $limit) {
    data {
      type {
        title_lao
        title_eng
      }
      _id
    }
  }
}
`;
