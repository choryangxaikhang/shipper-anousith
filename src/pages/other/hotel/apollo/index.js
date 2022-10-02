import { gql } from "@apollo/client";
export const QUERY_ROOM = gql`
 query Data($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: RoomWhereInput) {
  rooms(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    data {
      _id
      typeRoom {
        title_lao
      }
      title_lao
      title_eng
      priceHalf
      priceFull
      status
      detail
      createdAt
      isPublic
      house {
        _id
        houseName
        type{
        title_lao
        title_eng
        }
      }
    }
  }
}
`;

export const QUERY_BOOKING = gql`
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
      status
      bookDate
      bookTime
      bookingType
      updatedAt
      checkInAt
      checkOutAt
      room {
        title_lao
        priceHalf
        priceFull
      }
    }
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

export const ADD_CHECK_IN = gql`
mutation CreateBooking($data: BookingInput!) {
  createBooking(data: $data) {
    _id
  }
}
`;


export const QUERY_ROOMS = gql`
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
          powerTime
          type{
          title_lao
          title_eng
          }
        }
        coverImage
        images
        createdBy {
          lastName
        }
        updatedAt
        updatedBy {
          firstName
        }
        isPublic
      }
    }
  }
  `;
export const EDIT_BOOKING = gql`
  mutation UpdateBooking($data: BookingInput!, $where: BookingWhereInputOne!) {
    updateBooking(data: $data, where: $where) {
      _id
    }
  }
`;

export const UPDATE_ROOM = gql`
mutation UpdateRoom($data: RoomInput!, $where: RoomWhereInputOne!) {
  updateRoom(data: $data, where: $where) {
    _id
  }
}
`;
export const ADD_CUSTOMER = gql`
  mutation CreateCustomer($data: CustomerInput!) {
    createCustomer(data: $data) {
      _id
    }
  }
`;
export const CHECKOUT_BOOKING = gql`
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
      bookingType
      room {
        _id
        title_lao
      }
      customer {
        fullName
        _id
        phoneNumber
      }
      paidStatus
    }
  }
}
`;
export const QUERY_RATE = gql`
query RateExchanges($limit: Int, $skip: Int, $orderBy: OrderByInput, $where: RateExchangeWhereInput) {
  rateExchanges(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
    data {
      laoKIP
      laoTHB
      laoUSD
      house {
        _id
        houseCode
      }
      _id
    }
  }
}
`;

export const PROMOTIONS = gql`
query Promotions($where: PromotionWhereInput) {
  promotions(where: $where) {
    data {
      _id
      title
      status
      house {
        _id
        houseName
      }
      percent
    }
  }
}
`;
