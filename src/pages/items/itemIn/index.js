/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { getLocalHouse, getStaffLogin } from "../../../helper";
import SelectLocalHouse from "../../../helper/components/SelectLocalHouse";
import { DETAIL_ITEMS, HOME_PAGE } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import DetailItems from "./DetailItem";

export default function ItemIn() {
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
					<b className="text-white">ອໍເດີຮັບເຂົ້າ</b>
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
			<div className="mt-2">
				<div className="section">
					<div className="section-heading">
						<strong className="title">ລາຍງານ</strong>
					</div>
					<div className="transactions">
						<a href="app-transaction-detail.html" className="item">
							<div className="detail">
								<i className="icon-shopping-cart1 fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS}/1`)}
								/>
								<div>
									<strong>ANS-3939484245</strong>
									<p>ເຄື່ອງທົ່ວໄປ</p>
								</div>
							</div>
							<div className="right">
								<button className="btn btn-primary btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
						<a href="app-transaction-detail.html" className="item">
							<div className="detail">
								<i className="icon-shopping-cart1 fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS}/1`)}
								/>
								<div>
									<strong>Apple</strong>
									<p>Appstore Purchase</p>
								</div>
							</div>
							<div classNames="right">
								<button className="btn btn-primary btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
						<a href="app-transaction-detail.html" className="item">
							<div className="detail">
								<i className="icon-shopping-cart1 fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS}/1`)}
								/>
								<div>
									<strong>Alex Ljung</strong>
									<p>Transfer</p>
								</div>
							</div>
							<div className="right">
								<button className="btn btn-primary btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
						<a href="app-transaction-detail.html" className="item">
							<div className="detail">
								<i className="icon-shopping-cart1 fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS}/1`)}
								/>
								<div>
									<strong>Beatriz Brito</strong>
									<p>Transfer</p>
								</div>
							</div>
							<div className="right">
								<button className="btn btn-primary btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
					</div>
				</div>
			</div>
			<BottomNav />
		</>
	);
}
