import { gql } from "@apollo/client";
export const ADD_CHECK_IN = gql`
  mutation CreateCheckIn($data: CheckInInput!) {
    createCheckIn(data: $data) {
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
        title_lao
        title_eng
        priceHalf
        priceFull
        status
        detail
        createdAt
        typeRoom {
          title_lao
        }
      }
    }
  }
`;

export const QUERY_SUMMARY_BOOKING = gql`
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

export const QUERY_CHECK_IN = gql`
  query CheckIns(
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: CheckInWhereInput
  ) {
    checkIns(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
      total
    }
  }
`;

export const TOTAL_USER = gql`
query SummaryUsers($where: UserWhereInput) {
  summaryUsers(where: $where) {
    total
    active
    inactive
  }
}
`;

export const SUMMARY_ALL_ROOM = gql`
query SummaryRooms($where: RoomWhereInput) {
  summaryRooms(where: $where) {
    total
    active
    inactive
    bookingTotal
    fullTotal
    feeTotal
  }
}
`;
export const QUERY_HOUSE = gql`
query Houses(
  $where: HouseWhereInput
  $orderBy: OrderByInput
  $skip: Int
  $limit: Int
) {
  houses(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
  }
}

`;

export const QUERY_SUMMARY_BOOKING_CONSOLIDATE = gql`
query SummaryConsolidateBookings($where: ConsolidateBookingWhereInput) {
  summaryConsolidateBookings(where: $where) {
    total
    balanceKIP
    balanceTHB
    balanceUSD
    transferFee
  }
}
`;


