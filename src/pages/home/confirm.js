
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
	detectPhoneNumber,
	ItemStatus,
	messageError,
	messageSuccess
} from "../../helper";
import { DETAIL_CONFIRM, HOME_PAGE } from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";
import whatsapp from "../../icon/whatsapp.svg";
import Notiflix from "notiflix";
import "./index.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_LIST_ITEM } from "../items/apollo";
import { LIST_SHIPPER_CONFIRMED } from "./apollo";
import moment from "moment";


export default function ShipperConFirm() {
	const { history, location, match } = useReactRouter();
	const [reloadData, setReloadData] = useState(false);
	const today = moment().format("YYY-MM-DD, HH:mm")
	const [_item, setResult] = useState();
	const [updateListItem] = useMutation(UPDATE_LIST_ITEM);
	const [fetchData, { data: result, }] = useLazyQuery(LIST_SHIPPER_CONFIRMED, {
		fetchPolicy: "cache-and-network",
	});
	console.log(today)

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					itemStatus: "REQUESTING"
				},
			},
		})
		setResult(result?.items?.data)
	}, [result, reloadData]);
	const total = result?.items?.total;

	const updateDistance = (id) => {
		Notiflix.Confirm.show(
			"ແຈ້ງເຕືອນ",
			"ທ່ານຕ້ອງການຮັບເຂົ້າ ແທ້ ຫຼື ບໍ່?",
			"ຕົກລົງ",
			"ຍົກເລີກ",
			async () => {
				try {
					const _updateDistance = await updateListItem({
						variables: {
							data: {
								itemStatus: "SHIPPER_CONFIRMED",
							},
							where: {
								_id: parseInt(id),
							},
						},
					});

					if (_updateDistance) {
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
						<p className="title mt-1">ຈຳນວນ {total || 0} ລາຍການ</p>
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
										onClick={() => history.push(`${DETAIL_CONFIRM}/${item?._id} `)}
									/>
									<div className="text-nowrap">
										{/* <strong>{item?.trackingId}</strong> */}
										<strong>ID: {item?.customer?.id_list}</strong>
										<p>ຊື່: {item?.receiverName}</p>
										<p>
											<a className="text-link" target="_blank"
												href={`https://wa.me/${detectPhoneNumber(item?.receiverPhone
												)}?text=${message?.replace(/<br\s*[\/]?>/gi, " ")}`}>
												{/* <img style={{ width: 20 }} src={whatsapp} alt="" /> */}
												<i className="fas fa-phone" />
												{item?.receiverPhone}
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
								<div className="right">
									{item?.itemStatus !== "COMPLETED" ? (
										<button type="button"
											className="btn btn-success w-100 rounded btn-sm"
											data-dismiss="modal"
											onClick={() =>
												updateDistance(item?._id)
											}
										>
											<i className="fa-solid fa-circle-check mr-1" />
											ຢືນຢັນ
										</button>
									) : null}
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
