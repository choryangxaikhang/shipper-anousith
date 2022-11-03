/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { detectPhoneNumber, getLocalHouse, getStaffLogin, ItemStatus } from "../../../helper";
import { DETAIL_DATA_LIST } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import { useLazyQuery } from "@apollo/client";
import { QUERY_LIST_ITEM } from "./apollo";
import whatsapp from "../../../icon/whatsapp.svg";

export default function DataListItem() {
	const { history, location, match } = useReactRouter();
	const jsonObj = getStaffLogin();
	const [localHouse, setLocalHouse] = useState("");
	const userInfo = jsonObj?.data;
	const [numberPage, setNumberPage] = useState(1);
	const [house, setHouse] = useState("");
	const [userData, setUserData] = useState({});
	const [_item, setResult] = useState();
	const [clickButton, setButton] = useState(false);

	const [fetchData, { data: result, }] = useLazyQuery(QUERY_LIST_ITEM, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					// isDeleted: 1,
				},
			},
		})
		setResult(result?.items?.data)
	}, [result]);

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

	return (
		<>
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
						<p className="title mt-1">ສະແດງ 1 - 50 ລາຍການ</p>
					</div>
				</div>
			</div>
			<div className="mt-2">
				<div className="section">
					<div className="transactions">
						{_item && _item?.map((item) => (
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down fa-2x mr-2"
										onClick={() => history.push(`${DETAIL_DATA_LIST}/${item?._id} `)}
									/>
									<div className="text-nowrap">
										<strong>{item?.trackingId}</strong>
										<p>ຊື່: {item?.receiverName}</p>
										<p>
											<a className="text-link" target="_blank"
												href={`https://wa.me/${detectPhoneNumber(item?.receiverPhone
												)}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
												<img style={{ width: 20 }} src={whatsapp} alt="" />{item?.receiverPhone}
											</a>
										</p>

										<>
											{item?.itemStatus === "COMPLETED" ? (
												<small className="text-success">
													{ItemStatus(item?.itemStatus)}
												</small>
											) : (
												<small className="text-danger">
													{ItemStatus(item?.itemStatus)}
												</small>
											)}
										</>

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
