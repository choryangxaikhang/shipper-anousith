import React, { useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { sprinerLoading } from "../..";
const GQL = gql`
  query Branch($where: BranchWhereInputOne!) {
    branch(where: $where) {
      branchName
    }
  }
`;

export default function GetBranchNameById({ id }) {
  const [fetchData, { data, loading }] = useLazyQuery(GQL, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: { _id: id },
      },
    });
  }, [id]);

  return (
    <span>
      {isBranchOrEmpty(data?.branch?.branchName)}{" "}
      {loading && sprinerLoading("danger")}
    </span>
  );
}

const isBranchOrEmpty = (value) => {
  if (!value) {
    return "___";
  } else if (value?.search("ສາຂາ") !== -1) {
    return value;
  } else {
    return "ສາຂາ " + value;
  }
};
