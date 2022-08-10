/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import useReactRouter from "use-react-router";
export default function SignInNow() {
  const { history, location } = useReactRouter();

  return (
    <>
      <button
        type="button"
        data-toggle="modal"
        data-target="#exampleModal"
        className="btn btn-primary w-100 rounded"
      >
        <i className="icon-shopping-cart mr-1" /> ສັ່ງຈອງ
      </button>
      <div
        className="modal fade action-sheet"
        id={"exampleModal"}
        tabIndex={1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          >
            <div className="modal-header">
              <h5 className="modal-title">ກະລຸນາລົງທະບຽນ ຫຼື ເຂົ້າສູ່ລະບົບກ່ອນ</h5>
            </div>
            <div className="modal-body p-2">
                  <button
                    className="btn btn-primary text-center btn-lg rounded w-100"
                    onClick={() => history.push('/login')}
                    style={{ textAlign: "center", justifyContent: "center" }}
                    data-dismiss="modal"
                  >
                   ເຂົ້າສູ່ລະບົບ
                  </button>

                <button
                    className="btn btn-secondary text-center btn-lg rounded w-100 mt-2"
                    onClick={() => history.push('/register')}
                    data-dismiss="modal"
                    style={{ textAlign: "center", justifyContent: "center"}}
                  >
                   ລົງທະບຽນ
                  </button>
                  <hr/>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list text-danger w-100 text-center"
                    data-dismiss="modal"
                    style={{ textAlign: "center", justifyContent: "center" }}
                  >
                    <center>ປິດ</center>
                  </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
