import { gql } from "@apollo/client";

export const QUERY_LIST_ITEM = gql`
query Query($where: ItemWhereInput, $orderBy: OrderByItem, $limit: Int, $skip: Int) {
  items(where: $where, orderBy: $orderBy, limit: $limit, skip: $skip) {
    total
    data {
      _id
      category
      trackingId
      itemName
      deliveryPrice
      itemValueKIP
      itemValueTHB
      itemValueUSD
      realValueKIP
      realValueTHB
      realValueUSD
      width
      height
      weight
      itemStatus
      receiverName
      receiverPhone
      customer {
        id_list
        full_name
      }
      isSummary
      shipper
      chargeOnShop
      isDeposit
      receiverProvince {
        _id
        title
      }
      receiverDistrict {
        _id
        title
      }
      receiverVillage {
        _id
        title
      }
      isCustomerCreated
      isExtraItem
      isCOD
      createdDate
      shipperConfirmDate
      deliveryCompletedDate
      description
      originBranch {
        _id
        title
        map_lat
        map_long
      }
      destBranch {
        _id
        title
        map_lat
        map_long
      }
      sentBranch {
        _id
        title
        map_lat
        map_long
      }
      createdBy {
        id_user
        first_name
        last_name
      }
      moreExpense
      originReceiveDate
      originSendDate
      destReceiveDate
      deliveryCompletedBy {
        id_user
        first_name
        last_name
      }
      isADrop
    }
  }
}
`;

export const UPDATE_LIST_ITEM = gql`
mutation UpdateItem($data: ItemInput!, $where: WhereById!) {
  updateItem(data: $data, where: $where) {
    _id
  }
}
`;