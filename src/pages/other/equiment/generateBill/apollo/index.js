import { gql } from "@apollo/client";
export const ADD_BILL = gql`
  mutation CreateBillEquiment($data: BillEquimentInput!) {
    createBillEquiment(data: $data) {
      _id
    }
  }
`;
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

export const DELETE_EQUIMENT_STOCK = gql`
  mutation DeleteBillEquiment($where: BillEquimentWhereInputOne!) {
    deleteBillEquiment(where: $where) {
      _id
    }
  }
`;
