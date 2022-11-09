
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
	detectPhoneNumber,
	ShipperStatus,
	messageError,
	messageSuccess,
	ItemStatus,
	getStaffLogin
} from "../../../helper";
import { DETAIL_CONFIRM, HOME_PAGE } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import Notiflix from "notiflix";
import "../index.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
	LIST_SHIPPER_CONFIRMED,
	LIST_SHIPPER_ITEM,
	UPDATE_ITEMS
} from "../apollo";
import InsertAmount from "./amount";

export default function ShipperConFirm() {
	const { history } = useReactRouter();
	const [reloadData, setReloadData] = useState(false);
	const [_item, setResult] = useState();
	const [_dataItem, setData] = useState();
	const userState = getStaffLogin();

	const [updateItem] = useMutation(UPDATE_ITEMS);
	const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_CONFIRMED, {
		fetchPolicy: "cache-and-network",
	});
	const [fetchResult, { data: resultData, }] = useLazyQuery(LIST_SHIPPER_ITEM, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					// shipper: userState?._id,
					status: "REQUESTING"
				},
			},
		});

		fetchResult({
			variables: {
				where: {
					// shipper: userState?._id,
					itemStatus: "REQUESTING"
				},
			},
		});

		setResult(result?.pickupOfItems?.data);
		setData(resultData?.items?.data);

	}, [reloadData, resultData, result]);

	//ຈຳນວນທັງໝົດ
	const total = result?.pickupOfItems?.total;
	const totalItem = resultData?.items?.total;

	//ຢືນຢັນຮັບເຄື່ອງ ITEM
	const _updateItems = (id) => {
		Notiflix.Confirm.show(
			"ແຈ້ງເຕືອນ",
			"ທ່ານຕ້ອງການຮັບເຂົ້າ ແທ້ ຫຼື ບໍ່?",
			"ຕົກລົງ",
			"ຍົກເລີກ",
			async () => {
				try {
					const _updateResult = await updateItem({
						variables: {
							data: {
								itemStatus: "SHIPPER_CONFIRMED"
							},
							where: {
								_id: parseInt(id),
							},
						},
					});

					if (_updateResult) {
						messageSuccess("ດຳເນີນການສຳເລັດ");
						setReloadData(!reloadData);
					}
				} catch (error) {
					console.log(error)
					messageError("ດຳເນີນການບໍ່ສຳເລັດ");
				}
			},
			() => {
				return false;
			}
		);
	};

	const message = "ສະບາຍດີ"

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
				{/* {houseId?.houseName ? houseId?.houseName : "ລາຍງານຂໍ້ມູນ"} */}
				<b className="text-white">ອໍເດີໃໝ່</b>
				<div
					className="text-white pageTitle text-right text-nowrap pr-0"
					style={{ flex: 1 }}
				></div>
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
						<p className="title mt-1">ຈຳນວນ {total + totalItem || 0} ລາຍການ</p>
					</div>
				</div>
			</div>
			<div className="mt-2">
				<div className="section">
					<div className="transactions">
						{_dataItem && _dataItem?.map((item) => (
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down text-black fa-2x mr-2"
										onClick={() => history.push(`${DETAIL_CONFIRM}/${item?._id} `)}
									/>
									<div className="text-nowrap">
										<strong>TK: {item?.trackingId || " "}</strong>
										<p>ຊື່: {item?.receiverName || " "}</p>
										<p>
											<a className="text-link" target="_blank"
												href={`https://wa.me/${detectPhoneNumber(item?.receiverPhone
												)}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
												<i className="fas fa-phone" />
												{item?.receiverPhone}
											</a>
										</p>
										<>
											<small className="text-danger">
												{ItemStatus(item?.itemStatus)}
											</small>
										</>
									</div>
								</div>
								<div className="right">
									<button type="button"
										className="btn btn-success right rounded btn-xs"
										data-dismiss="modal"
										onClick={() =>
											_updateItems(item?._id)
										}
									>
										<i className="fa-solid fa-circle-check mr-1" />
										ຢືນຢັນ
									</button>
								</div>
							</a>
						))}

						{_item && _item?.map((item) => (
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-triangle-exclamation fa-2x mr-2"
									// onClick={() => history.push(`${DETAIL_CONFIRM}/${item?._id} `)}
									/>
									<div >
										<strong>ID: {item?.customer?.id_list}</strong>
										<p>ຊື່: {item?.customer?.full_name}</p>
										<p>
											<a className="text-link" target="_blank"
												href={`https://wa.me/${detectPhoneNumber(item?.customer?.contact_info
												)}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
												<i className="fas fa-phone" />
												{item?.customer?.contact_info}
											</a>
										</p>
										<strong>ຈຳນວນ: {item?.amount || 0}</strong>
										<>
											<small className="text-danger">
												{ShipperStatus(item?.status)}
											</small>
										</>
									</div>
								</div>
								<div className="right">
									<InsertAmount
										data={item}
										loadData={reloadData}
										getData={(data) => {
											setReloadData(data);
										}}
									/>
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
