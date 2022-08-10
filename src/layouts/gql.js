import { gql } from "@apollo/client";

export const ALL_ITEMS = gql`
query ItemsV2(
  $where: ItemV2WhereInput
  $orderBy: OrderByItem
  $skip: Int
  $limit: Int
  $noLimit: Boolean
) {
  itemsV2(
    where: $where
    orderBy: $orderBy
    skip: $skip
    limit: $limit
    noLimit: $noLimit
  ) {
    total
    data {
      trackingId
    }
  }
}
`;
export const SUM_CONSOLIDATE_LIST = gql`
query ConsolidateLists(
    $where: ConsolidateListWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    consolidateLists(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id_list
        AmountOfItem
        IncomingBalanceInKip
        IncomingBalanceInBaht
        IncomingBalanceInDollar
        BalanceOfFeeFromCOD
        isCustomerConfirmed
        Customer_Id {
          full_name
          contact_info
          id_list
        }
      }
    }
  }
`;
