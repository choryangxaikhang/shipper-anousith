import React, { useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import Imglogo from "../../../../img/anousith.png";
import { TAB_MENU_ITEM_IN } from "../../../../routes/app";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { chargeOnShop, currency, formatDateTime } from "../../../../helper";
import { LIST_SHIPPER_ITEM } from "../../apollo";

export default function DetailItems() {
	const { history, match } = useReactRouter();
	const ID = parseInt(match?.params?._id);
	const [_item, setResult] = useState();
	const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_ITEM, {
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
						onClick={() => history.push(`${TAB_MENU_ITEM_IN}/1`)}
					>
						<i className="fa fa-chevron-left fs-4" />
					</button>
				</div>
				<b className="text-white">ລາຍລະອຽດ</b>
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
						</div>
						<ul className="listview flush transparent simple-listview no-space mt-1">
							{_item && _item?.map((item) => (
								<>
									<li>
										<strong>trackingID</strong>
										<span>{item?.trackingId}</span>
									</li>
									<li>
										<strong>ວັນທີ່ສ້າງ</strong>
										<span>{formatDateTime(item?.createdDate) || " "}</span>
									</li>
									<li>
										<strong>ວັນທີ່ຮັບເຂົ້າ</strong>
										<span>{formatDateTime(item?.shipperConfirmDate) || " "}</span>
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
										<span>
											<i className="fas fa-user" />
											ID: {item?.customer?.id_list || " "}
										</span> |
										<span>
											<i className="fas fa-phone" />: {" "}
											{item?.customer?.contact_info || " "}</span>
									</li>
									<li>
										<span>
											<i className="fas fa-user" />
											ຊື່ຜູ້ຮັບ: {item?.receiverName || " "} </span> |
										<span><i className="fas fa-phone" />: {" "}
											{item?.receiverPhone || " "}</span>
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
				<h3 className="text-center mt-3">
					<i className="fas fa-location-dot fs-2 mr-1 text-danger" />
					ທີ່ຢູ່ປາຍທາງ </h3>
				<div className="mapouter">
					{_item && _item?.map((item) => (
						<div className="gmap_canvas">
							<iframe
								width={"100%"}
								height={230}
								id="gmap_canvas"
								src={`https://maps.google.com/maps?q=${item?.originBranch?.map_lat
									? item?.originBranch?.map_lat : "-"
									},${item?.originBranch?.map_long
										? item?.originBranch?.map_long : "-"
									}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
								frameBorder={0}
								scrolling="no"
								marginHeight={0}
								marginWidth={0}
							/>
							<br />
							<style
								dangerouslySetInnerHTML={{
									__html:
										".mapouter{position:relative;text-align:right;height:230px;width:100%;}",
								}}
							/>
							<style
								dangerouslySetInnerHTML={{
									__html:
										".gmap_canvas {overflow:hidden;background:none!important;height:230px;width:100%;}",
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
