import { gql } from "@apollo/client";
export const LIST_SHIPPER_CONFIRMED = gql`
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
      createdBy {
        id_user
        first_name
        last_name
      }
      moreExpense
      originReceiveDate   
    }
  }
}
`;


