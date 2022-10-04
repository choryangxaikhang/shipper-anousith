import { gql } from "@apollo/client";
export const QUERY_BOOKING = gql`
 query Data(
  $limit: Int
  $skip: Int
  $orderBy: OrderByInput
  $where: BookingWhereInput
) {
  bookings(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    total
    data {
      _id
      houseCode
      status
      bookDate
      bookDay
      bookTime
      inTime
      checkInAt
      checkOutAt
      fee
      feeBooking
      paidStatus
      bookingType
      updatedAt
      halfPriceTotal
      fullPriceTotal
      isDeleted
      bookCode
      images
      incomeKIP
      incomeTHB
      incomeUSD
      exChange
      consolidateID
      customer {
        _id
        gender
        age
        phoneNumber
        fullName
      }
      acceptBy {
        firstName
        lastName
      }
      updatedBy {
        firstName
        lastName
      }
      room {
        title_lao
        title_eng
        priceHalf
        priceFull
        _id
      }
      house {
        _id
        houseName
        contactPhone
      }
    }
  }
}

`;

export const UPDATE_CHECK_IN = gql`
mutation UpdateRoom($data: RoomInput!, $where: RoomWhereInputOne!) {
  updateRoom(data: $data, where: $where) {
    _id
  }
}
`;

export const UPDATE_BOOKING_STATUS = gql`
mutation UpdateBooking($data: BookingInput!, $where: BookingWhereInputOne!) {
  updateBooking(data: $data, where: $where) {
    _id
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