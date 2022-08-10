/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_BRANCHES } from "./apollo";
import { aws_url_image, formatDateTime, loadingData } from "../../helper";
import { AppContext } from "../../App";
import { QUERY_ROOMS } from "../home/apollo";
import BookingNow from "../../components/BookingNow";
import cover1 from "../../img/cover.jpeg";
import RoomDetail from "../../components/roomDetail";
import SignInNow from "../../components/signInNow";
import ModalAddress from "../../helper/components/ModalAddress";
export default function FeeRoomScreen({ history }) {
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [listRoom, setListRoom] = useState([]);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState("");
  const [address, setAddress] = useState({});
  const [queryRoom, { data, loading, error }] = useLazyQuery(QUERY_ROOMS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    queryRoom({
      variables: {
        where: {
          status: "FEE",
          title_lao: searchValue ? searchValue : undefined,
          province: address?.province?._id
            ? parseInt(address?.province?._id)
            : userData?.province?._id
            ? parseInt(userData?.province?._id)
            : undefined,
          district: address?.district?._id
            ? parseInt(address?.district?._id)
            : parseInt(userData?.district?._id)
            ? userData?.district?._id
            : undefined,
        },
        orderBy: "createdAt_DESC",
        limit: limit,
      },
    });
  }, [searchValue,address,limit]);

  useEffect(() => {
    if (data) {
      setListRoom(data?.rooms?.data);
    }
  }, [data]);

  return (
    <>
      <div id="appCapsule">
        <div className="justify-content-md-center">
          <div className="appHeader text-light border-0">
            <div style={{ flex: 1 }} className="text-left">
              <button
                className="btn text-white mr-2"
                onClick={() => history.goBack()}
              >
                <i className="icon-x fs-4" />
              </button>
            </div>
            ຫ້ອງກຳລັງວ່າງ
            <div
              className="text-white pageTitle text-right text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <ModalAddress data={(data) => setAddress(data)} />
            </div>
          </div>
          <div className="section mt-2">
            <div className="form-group basic">
              <input
                type="search"
                className="form-control form-control-lg mb-2"
                placeholder="ຄົ້ນຫາ"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="section-heading">
              <h4>
                ທັງໝົດ{" "}
                {loading ? 0 : data?.rooms?.total ? data?.rooms?.total : 0} ຫ້ອງ
              </h4>
              <small
                className="text-primary"
                onClick={() => setLimit(data?.rooms?.total)}
              >
                ເບິ່ງທັງໝົດ
              </small>
            </div>
          </div>
          <div className="section mt-2 mb-2">
            <div className="row">
              {loading ? (
                <div className="col-12 text-center">{loadingData(23)}</div>
              ) : (
                listRoom.map((item, index) => (
                  <div className="col-6 mb-2">
                    <a href="javascript:void(0)">
                      <div className="blog-card">
                        <RoomDetail data={item} index={index} cover={cover1} />
                        <div className="text">
                          <h6 className="title">
                            {item?.title_lao ? item?.title_lao : "-"} /
                            <small>
                              {" "}
                              {item?.title_eng ? item?.title_eng : "-"}{" "}
                            </small><br/>
                          <small className="text-secondary mt-0">
                            <strong className="m-0">
                              {" "}
                              {item?.house?.houseName
                                ? item?.house?.houseName
                                : "-"}{" "}
                              /{" "}
                              <small>
                                {" "}
                                {item?.houseName_en ? item?.houseName_en : "-"}
                              </small>
                            </strong>
                          </small>
                          </h6>
                        </div>
                        <div className="p-1">
                          {userData?._id ? (
                            <BookingNow
                              size="w-100"
                              params={item?._id}
                              houseID={item?.house?._id}
                              index={index}
                              priceHalf={item?.priceHalf}
                              priceFull={item?.priceFull}
                            />
                          ) : (
                            <SignInNow />
                          )}
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              )}
            </div>
            {data?.rooms?.total > 10 && (
              <div>
                <button
                  type="button"
                  onClick={() => setLimit(data?.rooms?.total)}
                  className="btn btn-block btn-primary btn-lg rounded mt-1"
                >
                  ເບິ່ງເພີ່ມເຕີມ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
