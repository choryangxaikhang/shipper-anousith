/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  getLocalHouse,
  getStaffLogin,
  ITEM_PER_PAGE,
  loadingScreen,
  messageConfirm,
  messageError,
  messageSuccess,
} from "../../../../helper";
import { EDIT_BILL, QUERY_EQUIMENT_OUT, UPDATE_EQUIMENT_OUT } from "./apollo";
import { Table } from "react-bootstrap";
import Notiflix from "notiflix";
import Export from "./Export";
import _ from "lodash";
import { TAB_EQUIMENT } from "../../../../routes/app";

export default function ListEquimentOut({ onSuccess }) {
  const { history, location, match } = useReactRouter();
  const jsonObj = getStaffLogin();
  const userInfo = jsonObj?.data;
  const numberPage = match?.params?.page;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [searchValue, setSearchValue] = useState();
  const [updateEquimentOut] = useMutation(UPDATE_EQUIMENT_OUT);
  const [updateBill] = useMutation(EDIT_BILL);
  const [localHouse, setLocalHouse] = useState("");
  const [newLoadData, setLoadData] = useState(false);
  const [listData, setDataList] = useState();

  const [queryOut, { data: setData, loading }] = useLazyQuery(
    QUERY_EQUIMENT_OUT,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    setLocalHouse(getLocalHouse()?._id);
  }, []);
  useEffect(() => {
    queryOut({
      variables: {
        where: {
          createdBy: userInfo?._id,
          house: localHouse,
          status: "GETIN",
        },
        limit: searchValue ? 1000 : numberRows,
        orderBy: "createdAt_DESC",
      },
    });
  }, [localHouse, onSuccess, newLoadData]);

  useEffect(() => {
    setDataList(setData?.equimentOuts?.data[0]);
  }, [setData, onSuccess, newLoadData]);

  const sumTotal = {
    outTotal: _.sumBy(setData?.equimentOuts?.data, "outTotal"),
    finalPrice: _.sumBy(setData?.equimentOuts?.data, "finalPrice"),
  };

  const upDataBill = async () => {
    try {
      const _data = setData?.equimentOuts?.data;
      for (const item of _data) {
        await updateBill({
          variables: {
            data: {
              status: "FULL",
            },
            where: {
              _id: listData?.billEquiment?._id,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
      Notiflix.Loading.remove();
      messageError("ມີຂໍ້ຜິດພາດ");
    }
  };

  const closeBill = () => {
    messageConfirm("ທ່ານຕ້ອງການປິດ ແທ້ ຫຼື ບໍ່?", async () => {
      loadingScreen();
      try {
        const _data = setData?.equimentOuts?.data;
        for (const item of _data) {
          await updateEquimentOut({
            variables: {
              data: {
                status: "CLOSE",
              },
              where: {
                _id: item?._id,
              },
            },
          });
        }
        Notiflix.Loading.remove();
        upDataBill();
        messageSuccess("ປິດບິນສຳເລັັດ");
        history.push(`${TAB_EQUIMENT}/Type?tab=equiment`);
        setLoadData(!newLoadData);
      } catch (error) {
        console.log(error);
        Notiflix.Loading.remove();
        messageError("ມີຂໍ້ຜິດພາດ");
      }
    });
  };
  return (
    <>
      <div className="col-md-4">
        <div className="border  mt-4 mt-lg-0 rounded">
          <table className="table table-bordered table-sm mb-0 text-black">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th className="text-nowrap">ລາຍການ</th>
                <th className="text-nowrap text-end">ຈຳນວນ</th>
                <th className="text-nowrap text-end">ລາຄາ/ອັນ</th>
                <th className="text-nowrap text-end">ລວມ</th>
              </tr>
            </thead>
            <tbody>
              {setData?.equimentOuts?.data?.map((data, index) => (
                <>
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-nowrap text-start">
                      {data?.equmentID?.title}
                    </td>
                    <td className="text-end text-nowrap">
                      {currency(data?.outTotal ? data?.outTotal : 0)}
                    </td>
                    <td className="text-end text-nowrap">
                      {currency(data?.price ? data?.price : 0)}
                    </td>
                    <td className="text-end text-nowrap">
                      {currency(
                        parseInt(data?.outTotal ? data?.outTotal : 0) *
                          parseInt(data?.price ? data?.price : 0)
                      )}
                    </td>
                  </tr>
                </>
              ))}
              <tr style={{ backgroundColor: "#fafafa" }}>
                <td className=" text-center fs-5" colSpan={3}>
                  ລວມທັງຫມົດ :
                </td>
                <td className="text-end fs-5">
                  {currency(sumTotal?.outTotal ? sumTotal?.outTotal : 0)}
                </td>
                <td className="text-end fs-5">
                  {currency(sumTotal?.finalPrice ? sumTotal?.finalPrice : 0)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="row">
            <Export _data={setData} />
            <button
              className="col-5 btn-primary text-center mt-2 bg-danger"
              onClick={(e) => {
                closeBill();
              }}
            >
              <h3 className="text-white">
                <i class="fa-solid fa-power-off me-1 p-2 pt-3" />
                ປິດໃບເບີກນີ້
              </h3>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
