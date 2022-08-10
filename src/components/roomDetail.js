/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  aws_url_image,
  currency,
} from "../helper";
import cover1 from "../img/cover.jpeg";
export default function RoomDetail({ data, index, cover }) {
  return (
    <>
      <a
        href="javascript:void(0)"
        data-toggle="modal"
        data-target={"#actionSheetInset2" + index}
      >
        <img
          src={data?.images ? aws_url_image + data.images : cover}
          alt="image"
          className="imaged w-100"
          style={{ height: 120 }}
        />
      </a>
      <div
        className="modal fade action-sheet"
        id={"actionSheetInset2" + index}
        tabIndex={1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          >
            <div className="modal-header">
              <h5 className="modal-title">ລາຍລະອຽດຫ້ອງ</h5>
            </div>
            <div className="modal-body">
              <img src={data?.images ? aws_url_image + data.images : cover} alt="image" className="w-100"  style={{maxHeight:180}}/>
              <ul className="action-button-list">
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ເຮືອນພັກ</span>
                    <span className="text-primary">
                      {data?.house?.houseName
                        ? data?.house?.houseName
                        : "- / " + data?.house?.houseName_en
                        ? data?.house?.houseName_en
                        : "-"}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ປະເພດຫ້ອງ</span>
                    <span className="text-primary">
                      {data?.typeRoom
                        ? data?.typeRoom?.title_lao
                        : "- / " + data?.typeRoom?.title_eng
                        ? data?.title_eng
                        : "-"}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ຫ້ອງ</span>
                    <span className="text-primary">
                      {data?.title_lao
                        ? data?.title_lao
                        : "- / " + data?.title_eng
                        ? data?.title_eng
                        : "-"}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ລາຄາຊົວຄາວ</span>
                    <span className="text-success">
                      {data?.priceHalf ? currency(data?.priceHalf) : 0}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ລາລາເຕັມ</span>
                    <span className="text-success">
                    {data?.priceHalf ? currency(data?.priceFull) : 0}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ສະຖານະ</span>
                    <span className="text-success">
                      {data?.status === "FULL" ? "ເຕັມ" : "ວ່າງ"}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ແຂວງ</span>
                    <span className="text-primary">
                      {data?.province?.provinceName}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ເມືອງ</span>
                    <span className="text-primary">
                      {data?.district?.title}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)" className="btn btn-list">
                    <span>ອັບເດດເມື່ອ</span>
                    <span className="text-primary">
                      {data?.district?.title}
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
