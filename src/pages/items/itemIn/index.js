/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import {
	aws_url_images,
	detectPhoneNumber,
	formatDateDash,
	ItemStatus,
	messageError,
	messageSuccess,
	ShipperStatus,
	startMonth
} from "../../../helper";
import { DETAIL_ITEMS } from "../../../routes/app";
import BottomNav from "../../../layouts/BottomNav";
import image from "../../../img/Nodata.png"
import Notiflix from "notiflix";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
	QUERY_LIST_ITEM,
	UPDATE_ITEMS,
	UPDATE_LIST_ITEM
} from "../apollo";


export default function ItemIn() {
	const { history, location, match } = useReactRouter();
	const [reloadData, setReloadData] = useState(false);
	const [_item, setResult] = useState();
	const [_dataItem, setData] = useState();
	const [searchValue, setValue] = useState()
	const [_search, setOnSearch] = useState("")
	const [startDateValue, setStartDateValue] = useState(startMonth());
	const [endDateValue, setEndDateValue] = useState(new Date());
	const [updateListItem] = useMutation(UPDATE_LIST_ITEM);
	const [updateItem] = useMutation(UPDATE_ITEMS);

	const [fetchData, { data: result, }] = useLazyQuery(QUERY_LIST_ITEM, {
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		fetchData({
			variables: {
				where: {
					customer: _search ? _search : undefined,
					status: "RECEIVED",
					receivedDateBetween:[startDateValue, endDateValue ]
				},
			},
		})
		setResult(result?.pickupOfItems?.data);
	}, [result, _search, startDateValue, endDateValue, reloadData]);

	const total = result?.pickupOfItems?.total;

	//ປຸ່ມກົດຄົ້ນຫາ
	function onSearch() {
		setOnSearch(searchValue);
	}

	const updateDistance = (id) => {
		Notiflix.Confirm.show(
			"ແຈ້ງເຕືອນ",
			"ທ່ານຕ້ອງການຈັດສົ່ງ ແທ້ ຫຼື ບໍ່?",
			"ຕົກລົງ",
			"ຍົກເລີກ",
			async () => {
				try {
					const _updateDistance = await updateListItem({
						variables: {
							data: {
								status: "DEPARTURE"
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
			<div className=" body-content-lg" style={{ marginTop: 60 }}>
				<div className="option-section">
					<div className="col-12">
						<div className="listed-detail">
							<div className="row">
								<div className="col-6 mb-1">
									<input
										type="date"
										className="form-control form-control-sm"
										value={formatDateDash(startDateValue)}
										onChange={(e) => {
											setStartDateValue(e.target.value);
										}}
									/>
								</div>
								<div className="col-6 mb-1">
									<input
										type="date"
										className="form-control form-control-sm"
										value={formatDateDash(endDateValue)}
										onChange={(e) => {
											setEndDateValue(e.target.value);
										}}
									/>
								</div>
							</div>
						</div>
						<div className="input-group">
							<button
								type="button"
								className="btn btn-dark"
								onClick={() => onSearch()}
							>
								<i className="icon-search1" />
							</button>
							<input
								type="search"
								className="form-control form-control-sm"
								onChange={(e) => {
									setValue(e.target.value);
								}}
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
										// onClick={() => history.push(`${DETAIL_ITEMS}/${item?._id} `)}
										/>
									</div>

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
										<p>ຈຳນວນ: {item?.amount}</p>
										<p>ວັນທີ່: {formatDateDash(item?.receivedDate || " ")}</p>
										<>
											<small className="text-success">
												{ShipperStatus(item?.status)}
											</small>
										</>
									</div>
								</div>
								<div className="right border">
									<img
										className="img-xl rounded-circle"
										src={
											item?.signature?.length
												? item?.signature[item?.signature?.length - 1]?.image
												: image
										}
										style={{
											width: 100,
											height: 100,
											borderRadius: "40%",
											border: "2px solid de0a0af2",
										}}
									// alt="Profile Picture"
									// loading="lazy"
									/>

									{/* <button type="button" className="btn btn-dark right rounded mt-1 text-nowrap btn-block"
										onClick={() =>
											updateDistance(item?._id)
										}
									>
										<i className="fa-solid fa-share-from-square mr-1" />
										ຈັດສົ່ງ
									</button> */}
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
