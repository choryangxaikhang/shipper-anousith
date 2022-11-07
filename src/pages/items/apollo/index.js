import { gql } from "@apollo/client";

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