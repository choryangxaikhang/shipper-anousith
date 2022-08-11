import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import Imglogo from "../../img/logo-bg.png";
import cover1 from "../../img/cover.jpeg";
import { QUERY_PAYROLL_SUMMARY } from "./apollo";
import {
    aws_url_image,
    currency,
    formatDateTime,
    loadingData,
} from "../../helper";
import BookingNow from "../../components/BookingNow";
import { AppContext } from "../../App";
import QRCode from "react-qr-code";
import OtherMoney from "./OtherMoney";

export default function ListMoney() {
    const { history } = useReactRouter();
    const { userState, titleDispatch } = useContext(AppContext);
    const userData = userState?.data;
    const [fetchAnsItem, { data: dataPayrollSummary, loading }]
        = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
            fetchPolicy: "cache-and-network",
        });
    useEffect(() => {
        fetchAnsItem({
            variables: {
                where: {
                    empID: parseInt(userData?._id),
                },
                orderBy: "createdAt_DESC",
            },
        });
    }, []);
    // useEffect(() => {
    //     setDataPayrollSummary(dataPayrollSummary?.payrollSummaries?.data[0]);
    // }, [dataPayrollSummary]);

    return (
        <>
            {/* <div className="monthly-bill-section pb-15 row">
                <div className="section-header">
                    <h2>ການເຄື່ອນໄຫວລ່າສຸດ</h2>
                    <div className="view-all">
                        <a href="monthly-bills.html">ເບີ່ງທັງຫມົດ</a>
                    </div>
                </div>
                {dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                    console.log("data", data),
                    <div className="row">
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div
                                className="bill-box mb-2"
                            >
                                <div className="row">
                                    <div className="listed-detail">
                                        <div className="icon-wrapper">
                                            <i className="fa-solid fa-dollar-sign text-success fa-3x" />
                                        </div>
                                        <h4 className="text-center mt-1">ເດືອນ: </h4>
                                        <h3 className="text-center user-select-all">
                                        </h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ລາຍລະອຽດ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        ຈຳນວນເງິນ
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderTop"
                                    >
                                        ເງິນເດືອນພື້ນຖານ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        KIP
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderTop"
                                    >
                                        ເງິນຕຳແຫນ່ງ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        THB
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນອາກອນ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        USD
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນເພີ່ມ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນໂອທີ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນໂບນັດ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນເບີກລ່ວງຫນ້າ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ຍອດເງິນທີ່ຈະໄດ້ຮັບ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </div> */}
            <div className="monthly-bill-section pb-15">
                <div className="section-header">
                    <h2>Monthly Bills</h2>
                    <div className="view-all">
                        <a href="monthly-bills.html">View All</a>
                    </div>
                </div>


                {dataPayrollSummary?.payrollSummaries?.data?.map((data, index) => (
                    console.log("data", data),
                    <div className="row gx-3">
                        <div className="col-4 pb-15">
                            <div className="monthly-bill-card monthly-bill-card-green">
                                <div className="monthly-bill-thumb">


                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ລາຍລະອຽດ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        ຈຳນວນເງິນ
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderTop"
                                    >
                                        ເງິນເດືອນພື້ນຖານ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        KIP
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderTop"
                                    >
                                        ເງິນຕຳແຫນ່ງ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        THB
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນອາກອນ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                        USD
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນເພີ່ມ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນໂອທີ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນໂບນັດ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ເງິນເບີກລ່ວງຫນ້າ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div
                                        className="col-6 fontSize text-left"
                                        id="borderLeft"
                                    >
                                        ຍອດເງິນທີ່ຈະໄດ້ຮັບ
                                    </div>
                                    <div
                                        className="col-6 fontSize text-right"
                                        id="borderTop"
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
