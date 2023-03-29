import { gql } from "@apollo/client";

export const QUERY_ITEM = gql`
query Items($where: ItemWhereInput, $orderBy: OrderByItem, $limit: Int) {
  items(where: $where, orderBy: $orderBy, limit: $limit) {
    total
  }
}
`;

