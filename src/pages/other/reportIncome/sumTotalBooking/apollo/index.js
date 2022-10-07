import { gql } from "@apollo/client";
export const ADD_PROVINCES = gql`
  mutation CreateProvince($data: ProvinceInput!) {
    createProvince(data: $data) {
      _id
    }
  }
`;
export const QUERY_REPORT_BOOKING = gql`
  query Bookings(
    $where: BookingWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    bookings(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        customer {
          _id
          fullName
        }
        house {
          _id
          houseName
        }
        room {
          _id
          title_lao
        }
        fee
        bookDate
        bookTime
        checkInAt
        feeBooking
        halfPriceTotal
        fullPriceTotal
        incomeKIP
        incomeTHB
        incomeUSD
      }
    }
  }
`;

export const CLEAR_REDIS = gql`
  mutation DeleteRedis($where: RedisWhereInput!) {
    deleteRedis(where: $where) {
      status
    }
  }
`;
export const EDIT_PROVINCES = gql`
  mutation UpdateProvince(
    $data: ProvinceInput!
    $where: ProvinceWhereInputOne!
  ) {
    updateProvince(data: $data, where: $where) {
      _id
    }
  }
`;
export const QUERY_SUM_TOTAL = gql`
  query SummaryBookingTotal($where: BookingWhereInput) {
    summaryBookingTotal(where: $where) {
      bookingTotal
      feeBookingAmount
      halfPriceTotal
      fullPriceTotal
      incomeKIP
      incomeTHB
      incomeUSD
      exChange
    }
  }
`;
