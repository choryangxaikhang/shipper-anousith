import React, { useEffect, useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import { HOME_PAGE } from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import {
	endOfMonth,
	formatDateDash,
	getStaffLogin,
	startMonth,
	currency
} from "../../helper";
import { useLazyQuery } from "@apollo/client";
import { QERY_COMMITION, QUERY_PAYROLL_SUMMARY } from "../home/apollo";

export default function Commition_ShiPer() {
	const { location, history, match } = useReactRouter();
	const [clickButton, setButton] = useState(false);
	const useInfo = getStaffLogin();
	const [dataUser, setResult] = useState();
	const [dataSummary, setResultSummary] = useState();

	const [startDate, setStartDate] = useState(startMonth());
	const [endDate, setEndDate] = useState(endOfMonth())

	const [fetchData, { data: result, }] = useLazyQuery(QUERY_PAYROLL_SUMMARY, {
		fetchPolicy: "cache-and-network",
	});
	const [fetchSummary, { data: resultSummary, }] = useLazyQuery(QERY_COMMITION, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					empID: parseInt(useInfo?._id)
				},
				orderBy: "_idDESC",
				limit: 1
			},
		});

		fetchSummary({
			variables: {
				where: {
					shipper: parseInt(useInfo?._id),
					dateBetween: [startDate, endDate]
				},
			},
		});

	}, [startDate, endDate]);

	useEffect(() => {
		setResult(result?.summaryPayroll?.data);
	}, [result]);

	useEffect(() => {
		setResultSummary(resultSummary?.summariesShippers);
	}, [resultSummary]);

	let _total = dataSummary?.sent?.total;
	const totalCommitsion = _total >= 200 ? 100000 : 0;
	const totalCommitsion2 = _total >= 240 ? 100000 : 0;


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
						{dataUser && dataUser?.map((item, index) => (
							<ul className="listview flush transparent simple-listview no-space mt-1">
								<li>
									<strong>cvID:</strong>
									<span> {item?.empID?.cvID}</span>
								</li>
								<li>
									<strong>ເງິນເດືອນພື້ນຖານ</strong>
									<span>{currency(item?.basicSalary || 0)} ກີບ</span>
								</li>
								<li>
									<strong>ເງິນຕຳແໜ່ງ</strong>
									<span>{currency(item?.positionSalary || 0)} ກີບ</span>
								</li>
								{item?.extraIncome !== 0 ? (
									<li>
										<strong>ເງິນເພິ່ມ</strong>
										<span>
											{currency(item?.extraIncome || 0)} ກີບ
										</span>
									</li>
								) : null}

								{item?.otIncome !== 0 ? (
									<li>
										<strong>ເງິນໂອທີ</strong>
										<span>
											{currency(item?.otIncome || 0)} ກີບ
										</span>
									</li>
								) : null}

								{item?.bonusIncome !== 0 ? (
									<li>
										<strong>ເງິນໂບນັດ</strong>
										<span>
											{currency(item?.bonusIncome || 0)} ກີບ
										</span>
									</li>
								) : null}

								{item?.diligentIncome !== 0 ? (
									<li>
										<strong>ເງິນຂະຫຍັນ</strong>
										<span>
											{currency(item?.diligentIncome || 0)} ກີບ
										</span>
									</li>
								) : null}

								{item?.borrowExpense !== 0 ? (
									<li>
										<strong>ເງິນເບິກລ່ວງໜ້າ</strong>
										<span>
											{currency(item?.borrowExpense || 0)} ກີບ
										</span>
									</li>
								) : null}

								{item?.deductionExpense !== 0 ? (
									<li>
										<strong>ເງິນຫັກ</strong>
										<span>
											{currency(item?.deductionExpense || 0)} ກີບ
										</span>
									</li>
								) : null}

								<li>
									<strong>ອໍເດີສົ່ງສຳເລັດທັງໝົດ</strong>
									<span>{dataSummary?.sent?.total} / {currency(dataSummary?.sent?.commission)} ກີບ</span>
								</li>
								<li>
									<strong>ອໍເດີຮັບເຂົ້າທັງໝົດ</strong>
									<span>{dataSummary?.receive?.total} / {currency(dataSummary?.receive?.commission)} ກີບ</span>
								</li>
								<li>
									<strong>ເງິນເປົ້້າ</strong>
									<span> {totalCommitsion} ກີບ</span>
								</li>
								<li>
									<strong>ຄ່າອາກອນ</strong>
									<span>{currency(item?.taxIncome || 0)} ກີບ</span>
								</li>							
								<li>
									<strong>
										<i className="fa-solid fa-money-bill-wave mr-1" />
										ເງິນເດືອນທີ່ໄດ້ 
									</strong>
									<span className="text-success">{ currency(item?.finalIncome || 0)} ກີບ</span>
								</li>
							</ul>
						))}
					</div>
				</div>
				<BottomNav />
			</div>
		</>
	);
}
