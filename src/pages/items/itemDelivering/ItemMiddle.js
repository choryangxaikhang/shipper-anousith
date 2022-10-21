/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { detectPhoneNumber, getLocalHouse, getStaffLogin } from "../../../helper";
import { DETAIL_ITEMS_DELIVERING } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";


export default function ItemMiddles() {
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
					</div>
				</div>
			</div>
			<div className="mt-2">
				<div className="section">
					<div className="transactions">
						<a href="#" className="item">
							<div className="detail">
								<i className="fa-solid fa-cart-arrow-down fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS_DELIVERING}/1`)}
								/>
								<div>
									<strong>ANS-551111111</strong>
									<p>fgdfdg</p>
									<p>ຊື່ລູກຄ້າ: ດວງມາລາ</p>
									<p>
										<a className="text-link" target="_blank" href={url}>
											<img style={{ width: 20 }} src={whatsapp} alt="" /> 54411144
										</a>
									</p>
								</div>
							</div>
							<div className="right">
								<button className="btn btn-dark btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
						<a href="#" className="item">
							<div className="detail">
								<i className="fa-solid fa-cart-arrow-down fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS_DELIVERING}/1`)}
								/>
								<div>
									<strong>Apple</strong>
									<p>Appstore Purchase</p>
									<p>ຊື່ລູກຄ້າ: ດວງດີ</p>
									<p>
										<a className="text-link" target="_blank" href={url}>
											<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
										</a>
									</p>
								</div>
							</div>
							<div classNames="right">
								<button className="btn btn-dark btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
						<a href="#" className="item">
							<div className="detail">
								<i className="fa-solid fa-cart-arrow-down fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS_DELIVERING}/1`)}
								/>
								<div>
									<strong>ANS-524515245</strong>
									<p>Transfer</p>
									<p>ຊື່ລູກຄ້າ: ດວງດີ</p>
									<p>
										<a className="text-link" target="_blank" href={url}>
											<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
										</a>
									</p>
								</div>
							</div>
							<div className="right">
								<button className="btn btn-dark btn-sm">
									<i className="fa-solid fa-share-from-square mr-1" />
									ຈັດສົ່ງ
								</button>
							</div>
						</a>
						<a href="#" className="item">
							<div className="detail">
								<i className="fa-solid fa-cart-arrow-down fs-1 mr-2"
									onClick={() => history.push(`${DETAIL_ITEMS_DELIVERING}/1`)}
								/>
								<div>
									<strong>ANS-562412546</strong>
									<p>Transfer</p>
									<p>ຊື່ລູກຄ້າ: ດວງດີ</p>
									<p>
										<a className="text-link" target="_blank" href={url}>
											<img style={{ width: 20 }} src={whatsapp} alt="" /> 5241524
										</a>
									</p>
								</div>
							</div>
							<div className="right">
								<button className="btn btn-dark btn-sm">
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
