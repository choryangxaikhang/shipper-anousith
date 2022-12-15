
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
	detectPhoneNumber,
	ShipperStatus,
	messageError,
	messageSuccess,
	getStaffLogin
} from "../../../helper";
import { HOME_PAGE } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import Notiflix from "notiflix";
import "../index.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
	LIST_SHIPPER_CONFIRMED,
	UPDATE_LIST_ITEM
} from "../apollo";
import InsertAmount from "./amount";
import Locations from "./location";

export default function ShipperConFirm() {
	const { history } = useReactRouter();
	const [reloadData, setReloadData] = useState(false);
	const [_item, setResult] = useState();
	const [_dataItem, setData] = useState();
	const userState = getStaffLogin();

	const [updatePickupOfItem] = useMutation(UPDATE_LIST_ITEM);
	const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_CONFIRMED, {
		fetchPolicy: "cache-and-network",
	});
	useEffect(() => {
		fetchData({
			variables: {
				where: {
					shipper: userState?._id,
					status: "DEPARTURE"
				},
			},
		});

	}, [reloadData, result]);

	useEffect(() => {
		if (result) {
			setResult(result?.pickupOfItems?.data);
		}
	}, [result])

	//ຈຳນວນທັງໝົດ
	const total = result?.pickupOfItems?.total;

	//ຢືນຢັນຮັບເຄື່ອງ ITEM
	const _updateItems = (id) => {
		Notiflix.Confirm.show(
			"ແຈ້ງເຕືອນ",
			"ທ່ານຕ້ອງການຮັບເຂົ້າ ແທ້ ຫຼື ບໍ່?",
			"ຕົກລົງ",
			"ຍົກເລີກ",
			async () => {
				try {
					const _updateResult = await updatePickupOfItem({
						variables: {
							data: {
								status: "CANCELED"
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
				<b className="text-white">ອໍເດີໃໝ່</b>
				<div
					className="text-white pageTitle text-right text-nowrap pr-0"
					style={{ flex: 1 }}
				></div>
			</div>
			<div className=" body-content-lg" style={{ marginTop: 60 }}>
				<div className="option-section">
					<p className="title mt-1 mr-1">ຈຳນວນ {total || 0} ລາຍການ</p>
				</div>
			</div>
			<div className="mt-2">
				<div className="section">
					<div className="transactions">
						{_item && _item?.map((item) => (
							<a href="#" className="item">
								<div className="detail">
									<i className="fa-solid fa-cart-arrow-down fa-2x mr-1" />
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
										<Locations
											data={item}
										/>
									</div>
								</div>
								<div className="right">
									<InsertAmount
										data={item}
										loadData={reloadData}
										getData={(data) => {
											setReloadData(data);
										}}
									/><br />
									<button
										type="button"
										className="btn btn-danger right rounded btn-xs text-nowrap mt-2"
										onClick={() => _updateItems(item?._id)}
									>
										<i class="fa-solid fa-circle-exclamation me-1" />
										ລົ້ມແຫຼວ
									</button>
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
