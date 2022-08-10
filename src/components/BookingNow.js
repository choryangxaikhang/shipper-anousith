/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import useReactRouter from "use-react-router";
import { AppContext } from "../App";
import { currency, messageError, messageSuccess } from "../helper";
import { CREATE_BOOKING, UPDATE_ROOM } from "./gql";
export default function BookingNow({
  size,
  params,
  houseID,
  index,
  priceHalf,
  priceFull,
}) {
  const { history, location } = useReactRouter();
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [updateRoom] = useMutation(UPDATE_ROOM);

  const _handleConfirm = async (status) => {
    try {
      const { data } = await createBooking({
        variables: {
          data: {
            customer: parseInt(userData?._id),
            room: parseInt(params),
            bookingType: status,
          },
        },
      });
      if (data?.createBooking?._id) {
        const { data } = await updateRoom({
          variables: {
            data: {
              status: "BOOKING",
              house: parseInt(houseID),
            },
            where: {
              _id: parseInt(params),
            },
          },
        });
        if (data?.updateRoom?._id) {
          messageSuccess("ຈອງສຳເລັດ");
          history.push("/home");
        } else {
          messageError("ຈອງບໍ່ສຳເລັດ");
        }
      }
    } catch (error) {
      messageError("ຈອງບໍ່ສຳເລັດ");
    }
  };

  return (
    <>
      <button
        type="button"
        className={`btn btn-primary rounded ${size ? size : ""}`}
        data-toggle="modal"
        data-target={"#actionSheetInset" + index}
      >
        <i className="icon-shopping-cart mr-1" /> ສັ່ງຈອງ
      </button>
      <div
        className="modal fade action-sheet"
        id={"actionSheetInset" + index}
        tabIndex={1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          >
            <div className="modal-header">
              <h5 className="modal-title">ເລືອກແພັກເກັຈ</h5>
            </div>
            <div className="modal-body">
              <ul className="action-button-list">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list"
                    data-dismiss="modal"
                    onClick={() => _handleConfirm("HALF")}
                  >
                    <span>
                      <i className="icon-check-circle mr-1" /> ພັກຊົ່ວຄາວ
                    </span>
                    <span className="text-primary">
                      {currency(priceHalf)} ກີບ
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="btn btn-list"
                    onClick={() => _handleConfirm("FULL")}
                    data-dismiss="modal"
                  >
                    <span>
                      <i className="icon-check-circle mr-1" /> ພັກຄ້າງຄືນ
                    </span>
                    <span className="text-primary">
                      {currency(priceFull)} ກີບ
                    </span>
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
