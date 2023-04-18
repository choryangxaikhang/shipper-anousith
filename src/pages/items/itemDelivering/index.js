/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
  chargeOnShop,
  detectPhoneNumber,
  formatDateDash,
  getStaffLogin,
  ItemStatus,
  messageError,
  messageSuccess,
} from "../../../helper";
import { DETAIL_ITEMS_DELIVERING, HOME_PAGE } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";
import Notiflix from "notiflix";
import { useLazyQuery, useMutation } from "@apollo/client";
import CODCompleted from "../codCompleted";
import { LIST_SHIPPER_ITEM, UPDATE_ITEMS } from "../apollo";

export default function ItemDelivering() {
  const { history } = useReactRouter();
  const [reloadData, setReloadData] = useState(false);
  const [_item, setResult] = useState();
  const [searchValue, setValue] = useState("");
  const [_sentStatus, setSentStatus] = useState(null);
  const userState = getStaffLogin();
  const [updateItems] = useMutation(UPDATE_ITEMS);
  const [fetchData, { data: result }] = useLazyQuery(LIST_SHIPPER_ITEM, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    fetchData({
      variables: {
        where: {
          shipper: userState?._id,
          itemStatus: "ASSIGNED_SHIPPER",
          trackingId: searchValue ? searchValue : undefined,
        },
        orderBy: "DESC",
        limit: searchValue ? 0 : 0,
      },
    });
  }, [searchValue, reloadData]);

  useEffect(() => {
    if (result) {
      setResult(result?.items?.data);
    }
  }, [result]);

  const total = result?.items?.total;

  //ສົ່ງບໍ່ໄດ້
  const _updateItems = (id) => {
    Notiflix.Confirm.show(
      "ແຈ້ງເຕືອນ",
      "ອໍເດີຂອງທ່ານລົ້ມເຫຼວ ແທ້ ຫຼື ບໍ່?",
      "ຕົກລົງ",
      "ຍົກເລີກ",
      async () => {
        try {
          const _updateResult = await updateItems({
            variables: {
              data: {
                sentStatus: _sentStatus?.value,
                shipper: parseInt(userState?._id),
              },
              where: {
                _id: parseInt(id),
              },
            },
          });

          if (_updateResult) {
            messageSuccess("ດຳເນີນການສຳເລັດ");
            setReloadData(!reloadData);
          }
        } catch (error) {
          console.log(error);
          messageError("ດຳເນີນການບໍ່ສຳເລັດ");
        }
      },
      () => {
        return false;
      }
    );
  };

  const message = "ສະບາຍດີ";

  return (
    <>
      <div className="appHeader text-light border-0 mr-0">
        <div style={{ flex: 1 }} className="text-left">
          <button
            className="btn text-white"
            onClick={() => history.push(HOME_PAGE)}
          >
            <i className="fa fa-chevron-left fs-4" />
          </button>
        </div>
        <b className="text-white">ອໍເດີກຳລັງຈັດສົ່ງ</b>
        <div
          className="text-white pageTitle text-right text-nowrap pr-0"
          style={{ flex: 1 }}
        ></div>
      </div>
      <div className=" body-content-lg" style={{ marginTop: 60 }}>
        <div className="option-section">
          <div className="col-12">
            <div className="input-group">
              <button
                type="button"
                className="btn btn-dark"    
              >
                <i className="icon-search1" />
              </button>
              <input
                type="search"
                className="form-control form-control-sm"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                placeholder="tracking"
              />
            </div>
            <p className="title mt-1">ຈຳນວນ {total || 0} ລາຍການ</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className="section">
          <div className="transactions_item">
            {_item?.map((item) => (
              <a href="#" className="item text-nowrap">
                <div className="detail text-nowrap">
                  <div className="align-top">
                    <i
                      className="fa-solid fa-cart-arrow-down fa-2x mr-1"
                      onClick={() =>
                        history.push(`${DETAIL_ITEMS_DELIVERING}/${item?._id} `)
                      }
                    />
                  </div>

                  <div className="text-nowrap">
                    <h4>TK: {item?.trackingId}</h4>
                    <strong>
                      ຈາກ ID: {item?.customer?.id_list}
                    </strong>
                    <p>ຊື່: {item?.customer?.full_name}</p>
                    <strong>ຜູ້ຮັບ: {item?.receiverName}</strong>
                    <p>
                      <a
                        className="text-link"
                        target="_blank"
                        href={`https://wa.me/${detectPhoneNumber(
                          item?.receiverPhone
                        )}?text=${message?.replace(
                          /<br\s*[\/]?>/gi,
                          " "
                        )} trackingID:${item?.trackingId}`}
                      >
                        <img
                          style={{ width: 20 }}
                          src={whatsapp}
                          alt=""
                          className="me-2"
                        />
                        {item?.receiverPhone}
                      </a>
                    </p>
                    <p>ວັນທີຮັບ: {formatDateDash(item?.shipperConfirmDate)}</p>
                    <p className="mb-1">
                    <span>{chargeOnShop(item?.chargeOnShop)}</span>
                    </p>
                    <p>
                      <input
                        type="radio"
                        className=" mr-2 mb-1"
                        value="NOT_ANSWER_CALL"
                        name="sentStatus"
                        onClick={(e) =>
                          setSentStatus({
                            value: e.target.value,
                            itemID: item?._id,
                          })
                        }
                      />
                      <i className="fas fa-phone text-info " />{" "}
                      <small>ໂທບໍ່ຮັບສາຍ</small>
                    </p>
                    <p>
                      <input
                        type="radio"
                        value="CAN_NOT_CONTACT"
                        name="sentStatus"
                        onClick={(e) =>
                          setSentStatus({
                            value: e.target.value,
                            itemID: item?._id,
                          })
                        }
                        className=" mr-2 mb-1"
                      />
                      <i className="fas fa-phone text-info " />{" "}
                      <small>ບໍ່ສາມາດຕິດຕໍ່ໄດ້</small>
                    </p>
                    <p>
                      <input
                        type="radio"
                        value="CAN_NOT_SENT"
                        name="sentStatus"
                        onClick={(e) =>
                          setSentStatus({
                            value: e.target.value,
                            itemID: item?._id,
                          })
                        }
                        className=" mr-2"
                      />
                      <i class="fa-solid fa-exclamation text-danger" />{" "}
                      <small>ບໍ່ສາມາດສົ່ງໄດ້</small>
                    </p>
                    <p>
                      <input
                        type="radio"
                        value={null}
                        name="sentStatus"
                        onClick={(e) =>
                          setSentStatus({
                            value: e.target.value,
                            itemID: null,
                          })
                        }
                        className=" mr-2"
                      />
                      <i class="fa-solid fa-circle-xmark text-danger" />{" "}
                      <small>ຍົກເລີກ</small>
                    </p>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6">
                    <CODCompleted
                      disabled={_sentStatus?.itemID === item?._id}
                      data={item}
                      loadData={reloadData}
                      getData={(data) => {
                        setReloadData(data);
                      }}
                    />
                  </div>
                  {/* <br /> */}
                  <div className="col-6">
                    <button
                      disabled={_sentStatus?.itemID !== item?._id}
                      type="button"
                      className="btn btn-secondary w-100 right rounded btn-xs text-nowrap"
                      onClick={() => _updateItems(item?._id)}
                    >
                      <i class="fa-solid fa-circle-exclamation me-1" />
                      ອັບເດດການສົ່ງ
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
