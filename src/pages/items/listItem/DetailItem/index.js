import React, { useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import Imglogo from "../../../../img/anousith.png";
import SelectLocalHouse from "../../../../helper/components/SelectLocalHouse";
import { TAB_MENU_LIST } from "../../../../routes/app";
import { useLazyQuery } from "@apollo/client";
import { QUERY_LIST_ITEM } from "../apollo";
import { useEffect } from "react";
import { chargeOnShop, formatDateTime, currency } from "../../../../helper";

export default function DetailDataList() {
	const { location, history, match } = useReactRouter();
	const ID = parseInt(match?.params?._id);
	const [localHouse, setLocalHouse] = useState("");
	const [clickButton, setButton] = useState(false);
	const [_item, setResult] = useState();
	const [fetchData, { data: result, }] = useLazyQuery(QUERY_LIST_ITEM, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					_id: ID,
				},
			},
		})
		setResult(result?.items?.data)
	}, [result]);

	return (

		<>
			<div className="appHeader text-light border-0 mr-0">
				<div style={{ flex: 1 }} className="text-left">
					<button
						className="btn text-white"
						onClick={() => history.push(`${TAB_MENU_LIST}/1`)}
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
						/>
					</>
				) : (
					<b className="text-white">ລາຍງານ</b>
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
						<div style={{ paddingBottom: "10px" }} />
						<div className="listed-detail mt-5">

							<img
								src={Imglogo}
								alt="logo"
								className="logo p-2"
								style={{
									width: 120,
									height: 60,
								}}
							/>
							<h3 className="text-center">ບິນຝາກເຄື່ອງ</h3>
						</div>


						<ul className="listview flush transparent simple-listview no-space mt-1">
							{_item && _item?.map((item) => (
								<>
									<li>
										<strong>ລະຫັດພັດສະດຸ</strong>
										<span>{item?.trackingId}</span>
									</li>
									<li>
										<strong>ວັນທີ່ສ້າງ</strong>
										<span>{formatDateTime(item?.createdDate) || " "}</span>
									</li>
									<li>
										<strong>ສາຂາຕົ້ນທາງ</strong>
										<span>{item?.originBranch?.title || " "}</span>
									</li>
									<li>
										<strong>ສາຂາປາຍທາງ</strong>
										<span>{item?.destBranch?.title || " "}</span>
									</li>
									<li>
										<strong>ຊື່ຜູ້ຮັບ</strong>
										<span className="text-success">{item?.receiverName || " "}</span>
									</li>
									<li>
										<strong>ເບີໂທ</strong>
										<span>{item?.receiverPhone || " "}</span>
									</li>
									<li>
										<strong>ຂະໜາດ:</strong>
										<span>{item?.width || " "}</span> |
										<strong>ນ້ຳໜັກ:</strong>
										<span>{item?.weight || " "}</span>
									</li>
									<li>
										<strong>ຄ່າບໍລິການ:</strong>
										<h3 className="m-0">{currency(item?.deliveryPrice || 0)} ກີບ</h3> |
										<span>{chargeOnShop(item?.chargeOnShop)}</span>
									</li>
									<li>
										<strong>ເງິນ COD: </strong>
										<span>{currency(item?.itemValueKIP || 0)} ກີບ</span> |
										<span>{currency(item?.itemValueTHB || 0)} ບາດ</span> |
										<span>{currency(item?.itemValueUSD || 0)} ໂດລາ</span>
									</li>
									<li>
										<strong>ລວມທັງໝົດ: </strong>
										<h3>{currency(item?.itemValueKIP + item?.deliveryPrice || 0)} ກີບ</h3>
									</li>
								</>
							))}
						</ul>
					</div>
				</div>
				<h3 className="text-center mt-3">ຂອບໃຈທີ່ໃຊ້ບໍລິການ </h3>
			</div>
		</>
	);
}
