import { gql } from "@apollo/client";

export const QUERY_BOOKING = gql`
  query Data(
    $where: BookingWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    bookings(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      data {
        _id
        room {
          _id
          title_lao
          title_eng
          priceHalf
          priceFull
          detail
        }
        status
        bookDate
        bookTime
        bookingType
      }
      total
    }
  }
`;

export const QUERY_BRANCHES = gql`
query Branches($where: BranchWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  branches(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      id_branch
      branch_name
      branch_address
      branch_code
      map_lat
      map_lng
      address_info
      mainBranches
      districtName
      public
      sameday_public
      branch_type
      provinceID {
        id_state
        provinceName
        provinceCode
        province_map_lat
        province_map_lng
        addressInfo
      }
      districtNextDay {
        id_district
        districtName
      }
    }
  }
}
`;
export const CHECK_OUTS = gql`
  query CheckOuts(
    $where: CheckOutWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    checkOuts(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        customer {
          _id
        }
        room {
          _id
          title_lao
          title_eng
          priceHalf
          priceFull
        }
        checkOutDate
        checkOutTime
        checkOutType
      }
    }
  }
`;
