import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useReactRouter from "use-react-router";
import { QUERY_CONSOLIDATE_ITEM } from "./gql";
// export default function ItemDetailScreen({ params, index, getId }) {
export default function ItemDetailScreen({ params, index, getId }) {
  const { history, location } = useReactRouter();
  const [show, setShow] = useState(false);
  const [fetchData, { data: dataInvoices, loading: loading }] = useLazyQuery(
    QUERY_CONSOLIDATE_ITEM,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          itemId: parseInt(getId),
        },
        orderBy: "createdAt_DESC",
        limit: 1,
      },
    });
  }, [getId]);
  return (
    <>
      <div
        className="modal fade action-sheet inset"
        id={"actionSheetInset" + index}
        tabIndex={1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">ຈັດການ</h5>
            </div>
            <div className="modal-body">
              <ul className="action-button-list">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list border-bottom"
                    data-dismiss="modal"
                    onClick={() => history.push(`/history/detail/${params}`)}
                  >
                    <span>
                      {" "}
                      <i className="fas fa-list mr-1" />
                      ເບິ່ງລາຍລະອຽດ
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list border-bottom"
                    onClick={() => history.push(`/billing/timeline/${params}`)}
                    data-dismiss="modal"
                  >
                    <span>
                      <i className="fas fa-search mr-1" />
                      ກວດສອບສະຖານະ
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list border-bottom"
                    onClick={() => history.push(`/tracking-once/${params}`)}
                    data-dismiss="modal"
                  >
                    <span>
                      <i class="fa-solid fa-angle-right mr-1" />
                      ເບິ່ງບິນຝາກເຄື່ອງ
                    </span>
                  </a>
                </li>
                {dataInvoices?.consolidateItems?.data?.map(
                  (data, index) => (
                    (
                      <>
                        <li key={index}>
                          <a
                            href="javascript:void(0)"
                            className="btn btn-list border-bottom"
                            onClick={() =>
                              history.push(
                                `/management_cod?NumberBill=${data?.ConsolidateId?.ConsolidateNumber}`
                              )
                            }
                            data-dismiss="modal"
                          >
                            <span>
                              <i class="fa-solid fa-dollar-sign mr-1"></i>
                              {data?.id_list}
                              {data?.ConsolidateNumber}
                              ເບິ່ງບິນສະຫຼຸບ COD
                            </span>
                          </a>
                        </li>
                      </>
                    )
                  )
                )}

                <li className="action-divider" />
                <li className="w-100 text-center">
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list text-danger w-100 text-center"
                    data-dismiss="modal"
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    <center>
                      <b>ປິດ</b>
                    </center>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
