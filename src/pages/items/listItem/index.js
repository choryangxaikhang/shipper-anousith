/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { detectPhoneNumber, getLocalHouse, getStaffLogin } from "../../../helper";
import SelectLocalHouse from "../../../helper/components/SelectLocalHouse";
import { DETAIL_DATA_LIST, HOME_PAGE } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";


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

	const message = "ສະບາຍດີ"
	const url = encodeURI(
		`https://wa.me/${detectPhoneNumber(76968194
			//   item?.receiverPhone
		)}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`
	);

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
						<select className="form-control-sm">
							<option className="#">--ເລືອກຄ່າເລີ່ມຕົ້ນ--</option>
							<option className="#">ສົ່ງໄລຍະໃກ້</option>
							<option className="#">ສົ່ງໄລຍະທົ່ວໄປ</option>
							<option className="#">ສົ່ງໄລຍະໄກ</option>
						</select>
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
						<i className="fa-solid fa-search fa-2 ms-2" />
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
						</div>
					</div>
				</div>
				<div className="mt-2">
					<div className="section">
						<div className="section-heading">
							<p className="title">ສະແດງ 1 - 50 ລາຍການ</p>
						</div>
						<div className="transactions">
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down fa-2x mr-2"
										onClick={() => history.push(`${DETAIL_DATA_LIST}/1`)}
									/>
									<div className="text-nowrap">
										<strong>ANS-3939484245</strong>
										<p>ເຄື່ອງທົ່ວໄປ</p>
										<p>ຊື່: ດວງດີrerrerefdf</p>
										<p>
											<a className="text-link" target="_blank" href={url}>
												<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
											</a>
										</p>
									</div>
								</div>
							</a>
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down fa-2x mr-2"
										onClick={() => history.push(`${DETAIL_DATA_LIST}/1`)}
									/>
									<div className="text-nowrap">
										<strong>ANS-3939484245</strong>
										<p>ເຄື່ອງທົ່ວໄປ</p>
										<p>ຊື່: ດວງດີrerrerefdf</p>
										<p>
											<a className="text-link" target="_blank" href={url}>
												<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
											</a>
										</p>
									</div>
								</div>
							</a>
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down fa-2x mr-2"
										onClick={() => history.push(`${DETAIL_DATA_LIST}/1`)}
									/>
									<div className="text-nowrap">
										<strong>ANS-3939484245</strong>
										<p>ເຄື່ອງທົ່ວໄປ</p>
										<p>ຊື່: ດວງດີrerrerefdf</p>
										<p>
											<a className="text-link" target="_blank" href={url}>
												<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
											</a>
										</p>
									</div>
								</div>
							</a>
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down fa-2x mr-2"
										onClick={() => history.push(`${DETAIL_DATA_LIST}/1`)}
									/>
									<div className="text-nowrap">
										<strong>ANS-3939484245</strong>
										<p>ເຄື່ອງທົ່ວໄປ</p>
										<p>ຊື່: ດວງດີrerrerefdf</p>
										<p>
											<a className="text-link" target="_blank" href={url}>
												<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
											</a>
										</p>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
				<BottomNav />
			</div>
		</>
	);
}
