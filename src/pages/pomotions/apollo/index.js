import { gql } from "@apollo/client"

export const QUERY_PROMOTION = gql`
  query Query(
    $where: PromotionWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    promotions(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        title
        percent
        status
        house {
          _id
          houseName
        }
        createdAt
        createdBy {
          _id
          firstName
          lastName
        }
      }
    }
  }
`;
export const CREATE_PROMOTION = gql`
  mutation Mutation($data: PromotionInput!) {
    createPromotion(data: $data) {
      _id
    }
  }
`;
export const DELETE_PROMOTION = gql`
  mutation Mutation($where: PromotionWhereInputOne!) {
    deletePromotion(where: $where) {
      _id
    }
  }
`;
export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion(
    $data: PromotionInput!
    $where: PromotionWhereInputOne!
  ) {
    updatePromotion(data: $data, where: $where) {
      _id
    }
  }
`;
