import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import useReactRouter from "use-react-router";
export default function NotificationPanel({ params, index }) {
  const { history, location } = useReactRouter();
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
                    className="btn btn-list"
                    data-dismiss="modal"
                    onClick={() => history.push(`/history/detail/${params}`)}
                  >
                    <span>ເບິ່ງລາຍລະອຽດ</span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list"
                    onClick={() => history.push(`/tracking-once/${params}`)}
                    data-dismiss="modal"
                  >
                    <span>ຢືນຢັນ</span>
                  </a>
                </li>
                <li className="action-divider" />
                <li className="w-100 text-center">
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list text-danger w-100 text-center"
                    data-dismiss="modal"
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    <center>ປິດ</center>
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
