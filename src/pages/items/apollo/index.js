import { gql } from "@apollo/client";

export const LIST_SHIPPER_ITEM = gql`
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
      width
      height
      itemStatus
      receiverName
      receiverPhone
      customer {
        id_list
        full_name
        contact_info
      }
      isSummary
      chargeOnShop
      isDeposit    
      receiverVillage {
        _id
        title
      }
      isCustomerCreated
      createdDate
      description
      originBranch {
        _id
        title
      }
      destBranch {
        _id
        title
      }     
      moreExpense
      originReceiveDate
      createdBy {
        _id
        firstName
        lastName
      }
      deliveryCompletedBy {
        _id
        firstName
        lastName
      }
      deliveryCompletedDate
      realValueKIP
      realValueTHB
      realValueUSD
      sentStatus
      shipper {
        _id
        firstName
        lastName
      }
    }
  }
}
`;

export const QUERY_LIST_ITEM = gql`
query PickupOfItems($where: PickupOfItemWhereInput, $orderBy: OrderByPickupOfItem, $limit: Int, $skip: Int) {
  pickupOfItems(where: $where, orderBy: $orderBy, limit: $limit, skip: $skip) {
    total
    data {
      _id
      amount
      customer {
        id_list
        full_name
        contact_info
      }
      shipper {
        cvID
        firstName
        lastName
        phoneNumber
      }
      branch {
        _id
        title
      }
      isCustomerCreated
      status
      provinceToPickup {
        _id
        title
      }
      districtToPickup {
        _id
        title
      }
      villageToPickup {
        _id
        title
      }    
      isSignature
      description
      updatedDate
      createdDate
      receivedDate
      canceledDate
      signature {
        _id
        image
      }
    }
  }
}
`;

export const UPDATE_LIST_ITEM = gql`
mutation UpdatePickupOfItem($data: PickupOfItemInput!, $where: WhereById!) {
  updatePickupOfItem(data: $data, where: $where) {
    _id
  }
}
`;
export const UPDATE_ITEMS = gql`
mutation UpdateItem($data: ItemInput!, $where: WhereById!) {
  updateItem(data: $data, where: $where) {
    _id
  }
}
`;