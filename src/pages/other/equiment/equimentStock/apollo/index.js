import { gql } from "@apollo/client";
export const ADD_EQUIMENT_STOCK = gql`
  mutation CreateEquimentStock($data: EquimentStockInput!) {
    createEquimentStock(data: $data) {
      _id
    }
  }
`;
export const QUERY_EQUIMENT_STOCK = gql`
  query EquimentStocks(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: EquimentStockWhereInput
  ) {
    equimentStocks(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        equmentID {
          title
          _id
          price
          unit
        }
        inTotal
        outTotal
        endTotal
        transactionDate
        createdAt
      }
    }
  }
`;
export const EDIT_EQUIMENT_STOCK = gql`
  mutation UpdateEquimentStock(
    $data: EquimentStockInput!
    $where: EquimentStockWhereInputOne
  ) {
    updateEquimentStock(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_EQUIMENT_STOCK = gql`
  mutation DeleteEquiment($where: EquimentWhereInputOne!) {
    deleteEquiment(where: $where) {
      _id
    }
  }
`;

export const CREATE_EQUIMENT_OUT = gql`
  mutation CreateEquimentOut($data: EquimentOutInput!) {
    createEquimentOut(data: $data) {
      _id
    }
  }
`;
export const UPDATE_EQUIMENT_OUT = gql`
  mutation UpdateEquimentOut(
    $data: EquimentOutInput!
    $where: EquimentOutWhereInputOne
  ) {
    updateEquimentOut(data: $data, where: $where) {
      _id
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
      }
    }
  }
`;

export const QUERY_BILL = gql`
  query BillEquiment($where: BillEquimentWhereInput, $limit: Int) {
    billEquiment(where: $where, limit: $limit) {
      data {
        _id
        billNo
        status
      }
    }
  }
`;
export const EDIT_BILL = gql`
  mutation UpdateBillEquiment(
    $data: BillEquimentInput!
    $where: BillEquimentWhereInputOne
  ) {
    updateBillEquiment(data: $data, where: $where) {
      _id
    }
  }
`;
// equiment
export const QUERY_EQUIMENT = gql`
  query Data($where: EquimentWhereInput) {
  equiments(where: $where) {
    data {
      _id
      total
    }
  }
}
`;

