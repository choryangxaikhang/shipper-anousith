/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";

import { Row, Table } from "react-bootstrap";
import Pagination from "../../../helper/controllers/Pagination";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import { getLocalHouse, getStaffLogin } from "../../../helper";
import SelectLocalHouse from "../../../helper/components/SelectLocalHouse";
import { HOME_PAGE } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";

export default function DataListItem() {
	const { history, location, match } = useReactRouter();
	const jsonObj = getStaffLogin();
	const [localHouse, setLocalHouse] = useState("");
	const userInfo = jsonObj?.data;
	const [numberPage, setNumberPage] = useState(1);
	const [house, setHouse] = useState("");
	const [userData, setUserData] = useState({});
	const [clickButton, setButton] = useState(false);

	// data HouseLoca
	useEffect(() => {
		const _local = getStaffLogin();
		setUserData(_local?.data || {});
		setLocalHouse(getLocalHouse());
		//sidebar min
		const localSideBarMini = localStorage.getItem("SIDEBAR_MINI");
		if (localSideBarMini === "true") {
			document.body.classNameList.add("sidebar-collapse");
		}
	}, []);

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
				{clickButton === true ? (
					<>
						<SelectLocalHouse
							style={{ width: "100%" }}
							value={localHouse?._id}
							onChange={(obj) => {
								if (obj?._id) {
									setLocalHouse(obj);
									localStorage.setItem("HOUSE", JSON.stringify(obj));
									window.location.reload();
								}
							}}
							ownerId={userData?._id}
						/>
					</>
				) : (
					<b className="text-white">ອໍເດີສົ່ງສຳເລັດທັງໝົດ</b>
				)}
				<div
					className="text-white pageTitle text-right text-nowrap pr-0"
					style={{ flex: 1 }}
				>
					<button
						className="btn text-white"
						onClick={(e) => {
							setButton(!clickButton);
						}}
					>
						<i className="fa-solid fa-magnifying-glass fa-2 ms-2" />
					</button>
				</div>
			</div>
			<div className=" body-content-lg" style={{ marginTop: 60 }}>
				<div className="option-section">
					<div className="row col-md-12  mt-4">
						<div className="option-card">
							<div className="row">
								<div className="col-6 mb-2">
									<input
										type="date"
										className="form-control form-control-sm" />
								</div>
								<div className="col-6 mb-2">
									<input
										type="date"
										className="form-control form-control-sm" />
								</div>
								<div className="col-12">
									<div className="input-group">
										<span className="btn btn-secondary">
											<i className="icon-search" />
										</span>
										<input
											type="search"
											className="form-control form-control-sm"
											placeholder="tracking" />
									</div>
								</div>
							</div>
							<div className="option-section mt-1">
								<div className="row gx-2">
									<small style={{ textAlign: 'right' }}>ສະແດງ1-50 ລາຍການ</small>
									<div className="table-responsive">
										<Table className="table  table-sm mb-0">
											<thead>
												<tr>
													<th className="text-start text-nowrap">
														<small>
															ລຳດັບ
														</small>
													</th>
													<th className="text-nowrap text-start">
														<small>
															ລະຫັດພັດສະດຸ
														</small>
													</th>
													<th className="text-nowrap text-start">
														<small>
															ສາຂາ
														</small>
													</th>
													<th className="text-nowrap text-start">
														<small>
															ວັນທີ່
														</small>
													</th>
													{/* {userInfo?.role === "SUPER_ADMIN" ||
														userInfo?.role === "IT" ? ( */}
													<th
														className="text-nowrap text-center"
														width={100}
													>
														<small>
															ຈັດການ
														</small>
													</th>
													{/* ) : null} */}
												</tr>
											</thead>
											<tbody>
												<tr className="text-black">
													<td className="text-start text-nowrap">1</td>
													<td className="text-nowrap text-start">
														<small>
															ANS-12345678
														</small>
													</td>
													<td className="text-center text-nowrap">
														<small>
															ສຳນັກງານໃຫຍ່
														</small>
													</td>
													<td className="text-nowrap" style={{ textAlign: 'left' }}>
														<small>17/10/2022</small>

													</td>
													<td className="text-center text-nowrap">
														<small className="btn btn-danger btn-sm">
															<i className="fa-solid fa-xmark me-2" />
															ຍົກເລິກ</small>
													</td>
												</tr>
												<tr className="text-black">
													<td className="text-start text-nowrap">1</td>
													<td className="text-nowrap text-start">
														<small>
															ANS-12345678
														</small>
													</td>
													<td className="text-center text-nowrap">
														<small>
															ສຳນັກງານໃຫຍ່
														</small>
													</td>
													<td className="text-nowrap" style={{ textAlign: 'left' }}>
														<small>17/10/2022</small>

													</td>
													<td className="text-center text-nowrap">
														<small className="btn btn-danger btn-sm">
															<i className="fa-solid fa-xmark me-2" />
															ຍົກເລິກ</small>
													</td>
												</tr>
												<tr className="text-black">
													<td className="text-start text-nowrap">1</td>
													<td className="text-nowrap text-start">
														<small>
															ANS-12345678
														</small>
													</td>
													<td className="text-center text-nowrap">
														<small>
															ສຳນັກງານໃຫຍ່
														</small>
													</td>
													<td className="text-nowrap" style={{ textAlign: 'left' }}>
														<small>17/10/2022</small>

													</td>
													<td className="text-center text-nowrap">
														<small className="btn btn-danger btn-sm">
															<i className="fa-solid fa-xmark me-2" />
															ຍົກເລິກ</small>
													</td>
												</tr>
												<tr className="text-black">
													<td className="text-start text-nowrap">1</td>
													<td className="text-nowrap text-start">
														<small>
															ANS-12345678
														</small>
													</td>
													<td className="text-center text-nowrap">
														<small>
															ສຳນັກງານໃຫຍ່
														</small>
													</td>
													<td className="text-nowrap" style={{ textAlign: 'left' }}>
														<small>17/10/2022</small>

													</td>
													<td className="text-center text-nowrap">
														<small className="btn btn-danger btn-sm">
															<i className="fa-solid fa-xmark me-2" />
															ຍົກເລິກ</small>
													</td>
												</tr>
												<tr className="text-black">
													<td className="text-start text-nowrap">1</td>
													<td className="text-nowrap text-start">
														<small>
															ANS-12345678
														</small>
													</td>
													<td className="text-center text-nowrap">
														<small>
															ສຳນັກງານໃຫຍ່
														</small>
													</td>
													<td className="text-nowrap" style={{ textAlign: 'left' }}>
														<small>17/10/2022</small>

													</td>
													<td className="text-center text-nowrap">
														<small className="btn btn-danger btn-sm">
															<i className="fa-solid fa-xmark me-2" />
															ຍົກເລິກ</small>
													</td>
												</tr>
											</tbody>
										</Table>
									</div>
									{/* <Pagination
										className="mt-2"
										pageTotal={countPage}
										currentPage={numberPage}
										onPageChange={(page) => {
											history.push({
												search: setParams(`page`, page),
											});
										}}
									/> */}
								</div>
							</div>
						</div>
					</div>
				</div>
				<BottomNav />
			</div>
		</>
	);
}
