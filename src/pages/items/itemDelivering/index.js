/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
	detectPhoneNumber,
	ItemStatus,
} from "../../../helper";
import { DETAIL_ITEMS_DELIVERING } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import whatsapp from "../../../icon/whatsapp.svg";
import Notiflix from "notiflix";
import { useLazyQuery } from "@apollo/client";
import CODCompleted from "../codCompleted";
import { QUERY_LIST_ITEM } from "../apollo";


export default function ItemDelivering() {
	const { history, location, match } = useReactRouter();
	const [reloadData, setReloadData] = useState(false);
	const [_item, setResult] = useState();
	const [fetchData, { data: result, }] = useLazyQuery(QUERY_LIST_ITEM, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					itemStatus: "ORIGIN_TRANSFERRING"
				},
			},
		})
		setResult(result?.items?.data)
	}, [result, reloadData]);
	const total = result?.items?.total;

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
						<p className="title mt-1">ຈຳນວນ {total || 0} ລາຍການ</p>
					</div>
				</div>
			</div>
			<div className="mt-2">
				<div className="section">
					<div className="transactions ">
						{_item && _item?.map((item) => (
							<a href="#" className="item">
								<div className="detail">
									<div className="align-top"
									>
										<i className="fa-solid fa-cart-arrow-down fa-2x mr-1"
											onClick={() => history.push(`${DETAIL_ITEMS_DELIVERING}/${item?._id} `)}
										/>
									</div>

									<div className="text-nowrap">
										{/* <strong>{item?.trackingId}</strong> */}
										<strong>ID: {item?.customer?.id_list}</strong>
										<strong>TK: {item?.trackingId}</strong>
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
								<div className="center">
									{item?.itemStatus !== "COMPLETED" ? (
										<CODCompleted
											data={item}
											loadData={reloadData}
											getData={(data) => {
												setReloadData(data);
											}}
										/>
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
