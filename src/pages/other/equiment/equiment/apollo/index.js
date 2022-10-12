import { gql } from "@apollo/client";
export const ADD_EQUIMENT = gql`
  mutation CreateEquiment($data: EquimentInput!) {
    createEquiment(data: $data) {
      _id
    }
  }
`;
export const QUERY_EQUIMENT = gql`
  query Equiments(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: EquimentWhereInput
  ) {
    equiments(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        equimentType {
          _id
          title
        }
        title
        unit
        size
        price
        receiptDate
        status
        details
        createdAt
        total
      }
    }
  }
`;
export const EDIT_EQUIMENT = gql`
  mutation UpdateEquiment(
    $data: EquimentInput!
    $where: EquimentWhereInputOne
  ) {
    updateEquiment(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_EQUIMENT = gql`
  mutation DeleteEquiment($where: EquimentWhereInputOne!) {
    deleteEquiment(where: $where) {
      _id
    }
  }
`;
export const QUERY_TYPE_HOUSE = gql`
  query TypeHouses {
    typeHouses {
      total
      data {
        _id
        title_lao
        title_eng
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

export const CREATE_ORDER_OUT = gql`
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
