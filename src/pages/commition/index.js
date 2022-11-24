import React, { useEffect, useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import { HOME_PAGE } from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import {
	endOfMonth,
	formatDateDash,
	getStaffLogin,
	startMonth
} from "../../helper";
import { useLazyQuery } from "@apollo/client";
import { QUERY_USER } from "../home/apollo";

export default function Commition_ShiPer() {
	const { location, history, match } = useReactRouter();
	const [clickButton, setButton] = useState(false);
	const useInfo = getStaffLogin();
	const [dataUser, setResult] = useState();
	const [startDate, setStartDate] = useState(startMonth());
	const [endDate, setEndDate] = useState(endOfMonth())

	const [fetchData, { data: result, }] = useLazyQuery(QUERY_USER, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					status: "ACTIVE",
					role: "SHIPPER",
					// _id: parseInt(useInfo?._id)
				},
			},
		});
	}, [startDate, endDate]);

	useEffect(() => {
		setResult(result?.managePayroll?.data);
	}, [result])

	const total = result?.managePayroll?.total;

	return (

		<>
			<div className="appHeader text-light border-0 mr-0">
				<div style={{ flex: 1 }} className="text-left">
					<button
						className="btn text-white"
						onClick={() => history.push(`${HOME_PAGE}`)}

					>
						<i className="fa fa-chevron-left fs-4" />
					</button>
				</div>
				{clickButton === true ? (
					<>

					</>
				) : (
					<b className="text-white">ຂໍ້ມູນການແບ່ງສ່ວນ</b>
				)}
				<div
					className="text-white pageTitle text-right text-nowrap pr-0"
					style={{ flex: 1 }}
				>

				</div>
			</div>
			<div className="container-min">
				<div className="card">
					<div className="col-12">
						<div style={{ paddingBottom: "20px" }} />
						<div className="listed-detail mt-5">
							<div className="row">
								<div className="col-6 mb-2">
									<input
										type="date"
										value={formatDateDash(startDate)}
										onChange={(e) => {
											setStartDate(e.target.value);
										}}
										className="form-control form-control-sm" />
								</div>
								<div className="col-6 mb-2">
									<input
										type="date"
										value={formatDateDash(endDate)}
										onChange={(e) => {
											setEndDate(e.target.value);
										}}
										className="form-control form-control-sm" />
								</div>
							</div>
						</div>
						{/* {dataUser && dataUser?.map((item, index)=>( */}
						<ul className="listview flush transparent simple-listview no-space mt-1">
							<li>
								<strong>cvID:</strong>
								{/* <span> {item?.cvID}</span> */}
							</li>
							<li>
								<strong>ເງິນຕຳແໜ່ງ</strong>
								<span>0 ກີບ</span>
							</li>
							<li>
								<strong>ເງິນເພິ່ມ</strong>
								<span>0 ກີບ</span>
							</li>
							<li>
								<strong>ອໍເດີສົ່ງສຳເລັດທັງໝົດ</strong>
								<span>125 / 2,500,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງໄລຍະໃກ້</strong>
								<span>50 x 5.500 = 275,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງໄລຍະກາງ</strong>
								<span>30 x 7,000 = 210,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງໄລຍະໄກ</strong>
								<span>60 x 12,000 = 720,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງອໍເດີ</strong>
								<span><b> 125 x 500 = 65.500 ກີບ</b></span>
							</li>
							<li>
								<strong>ລວມສ່ວນແບ່ງ</strong>
								<span className="text-danger">1,270,500 ກີບ</span>
							</li>
							<li>
								<strong>
									<i className="fa-solid fa-money-bill-wave mr-1" />
									ເງິນເດືອນ 10/2022
								</strong>
								<span className="text-success">1,270,500 ກີບ</span>
							</li>
						</ul>
						{/* ))} */}

					</div>
				</div>
				<BottomNav />
			</div>
		</>
	);
}
