import { gql } from "@apollo/client";
export const QUERY_BILL = gql`
  query BillEquiments(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: BillEquimentWhereInput
  ) {
    billEquiment(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        billNo
        details
        house {
          _id
          houseName
        }
        status
        createdAt
      }
    }
  }
`;

export const QUERY_EQUIMENT_OUT = gql`
  query EquimentOuts(
    $where: EquimentOutWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    equimentOuts(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        outTotal
        transactionDate
        createdAt
        price
        finalPrice
        details
        status
        billEquiment {
          _id
          billNo
          details
          status
        }
        house {
          _id
          houseName
          contactPhone
        }
        equmentID {
          _id
          title
          price
        }
        createdBy {
          _id
          firstName
        }
      }
    }
  }
`;
