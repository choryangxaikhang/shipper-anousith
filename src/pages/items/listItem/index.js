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
						<a href="#" className="item">
							<div className="detail">
								<i className="fa-solid fa-cart-arrow-down fa-2x mr-2"
									onClick={() => history.push(`${DETAIL_DATA_LIST}/1`)}
								/>
								<div className="text-nowrap">
									<strong>ANS-3939484245</strong>
									<p>ເຄື່ອງທົ່ວໄປ</p>
									<p>ຊື່: ດວງດີrerrerefdf</p>
									<p className="text-success">
										ສົ່ງສຳເລັດ
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
									<p className="text-success">
										ສົ່ງສຳເລັດ
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
									<p className="text-success">
										ສົ່ງສຳເລັດ
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
									<p className="text-success">
										ສົ່ງສຳເລັດ
									</p>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
			<BottomNav />
		</>
	);
}
