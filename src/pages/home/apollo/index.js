import { gql } from "@apollo/client";

export const LIST_ITEM_DELIVERYS = gql`
  query Query($where: ItemDeliveryLogWhereInput, $skip: Int, $limit: Int) {
    itemDeliveryLogs(where: $where, skip: $skip, limit: $limit) {
      total
      data {
        _id
        shipper {
          _id
          firstName
          lastName
        }
        item {
          _id
          trackingId
          itemName
          receiverPhone
          receiverName
        }
        status
        createdDate
      }
    }
  }
`;

export const QUERY_COMMISSION = gql`
  query Query($where: SummariesShipperWhereInput!) {
    summariesShippers(where: $where) {
      receive {
        total
        commission
      }
      sent {
        general {
          total
          commission
        }
        near {
          total
          commission
        }
        farAway {
          total
          commission
        }
      }
    }
  }
`;

export const UPDATE_PAYROLL = gql`
  mutation UpdateSummaryPayroll(
    $data: SummaryPayrollInput!
    $where: WhereById!
  ) {
    updateSummaryPayroll(data: $data, where: $where) {
      _id
    }
  }
`;

export const QUERY_PAYROLL_SUMMARY = gql`
  query SummaryPayrollPayment(
    $where: SummaryPayrollWhereInput
    $orderBy: SummaryPayrollOrderBy
    $skip: Int
    $limit: Int
  ) {
    summaryPayroll(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        _id
        empID {
          _id
          cvID
          firstName
          lastName
        }
        consolidatedAt
        basicSalary
        positionSalary
        livingSalary
        extraIncome
        otIncome
        bonusIncome
        diligentIncome
        deductionExpense
        borrowExpense
        taxIncome
        InsuranceExpense
        finalIncome
        confirmStatus
        confirmedDate
        paidStatus
        paidDate
        note
        position {
          _id
          title_lao
          title_eng
        }
      }
    }
  }
`;

export const LIST_SHIPPER_ITEM = gql`
  query Query(
    $where: ItemWhereInput
    $orderBy: OrderByItem
    $limit: Int
    $skip: Int
  ) {
    items(where: $where, orderBy: $orderBy, limit: $limit, skip: $skip) {
      total
      data {
        _id
        category
        trackingId
        itemName
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
        shipper {
          _id
          firstName
          lastName
        }
      }
    }
  }
`;

export const LIST_SHIPPER_CONFIRMED = gql`
  query PickupOfItems(
    $where: PickupOfItemWhereInput
    $orderBy: OrderByPickupOfItem
    $limit: Int
    $skip: Int
  ) {
    pickupOfItems(
      where: $where
      orderBy: $orderBy
      limit: $limit
      skip: $skip
    ) {
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
      status
    }
  }
`;

export const UPDATE_ITEMS = gql`
  mutation UpdateItem($data: ItemInput!, $where: WhereById!) {
    updateItem(data: $data, where: $where) {
      status
    }
  }
`;

export const CREATE_SIGNATURE = gql`
  mutation Mutation($data: PickupOfItemSignatureInput!) {
    createPickupOfItemSignature(data: $data) {
      status
    }
  }
`;
