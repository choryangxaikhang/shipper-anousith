import { gql } from "@apollo/client"

export const QUERY_RATE_EXCHANGE = gql`
  query Data(
    $where: RateExchangeWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    rateExchanges(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        laoKIP
        laoTHB
        laoUSD
        createdAt
        createdBy {
          _id
          firstName
          lastName
        }
        house {
          _id
          houseName
        }
      }
      total
    }
  }
`;
export const CREATE_RATE_EXCHANGE = gql`
  mutation Mutation($data: RateExchangeInput!) {
    createRateExchange(data: $data) {
      _id
    }
  }
`;
export const DELETE_RATE_EXCHANGE = gql`
  mutation Mutation($where: RateExchangeWhereInputOne!) {
    deleteRateExchange(where: $where) {
      _id
    }
  }
`;
export const UPDATE_RATE_EXCHANGE = gql`
  mutation UpdateRateExchange(
    $data: RateExchangeInput!
    $where: RateExchangeWhereInputOne
  ) {
    updateRateExchange(data: $data, where: $where) {
      _id
    }
  }
`;
