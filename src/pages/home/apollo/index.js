import { gql } from "@apollo/client";

export const QUERY_ROOMS = gql`
  query Rooms(
    $where: RoomWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    rooms(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        house {
          _id
          houseName
          houseName_en
          houseCode
          map_lat
          map_lng
        }
        coverImage
        images
        typeRoom {
          _id
          title_lao
        }
        title_lao
        title_eng
        priceHalf
        priceFull
        status
        detail
        createdAt
        createdBy {
          _id
          profileImage
          lastName
          phoneNumber
        }
        province {
          _id
          provinceName
        }
        district {
          _id
          title
        }
      }
    }
  }
`;
