import React, { useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import Imglogo from "../../img/anousith.png";
import SelectLocalHouse from "../../helper/components/SelectLocalHouse";
import { HOME_PAGE } from "../../routes/app";
import BottomNav from "../../layouts/BottomNav";

export default function Commition_ShiPer() {
	const { location, history, match } = useReactRouter();
	const [localHouse, setLocalHouse] = useState("");
	const [clickButton, setButton] = useState(false);

	return (

		<>
			<div className="appHeader text-light border-0 mr-0">
				<div style={{ flex: 1 }} className="text-left">
					<button
						className="btn text-white"
						onClick={() => history.push(`${HOME_PAGE}`)}

					>
						<i className="fa fa-chevron-left fs-4" />
					</button>
				</div>
				{clickButton === true ? (
					<>
				
					</>
				) : (
					<b className="text-white">ຂໍ້ມູນການແບ່ງສ່ວນ</b>
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
						<div style={{ paddingBottom: "20px" }} />
						<div className="listed-detail mt-5">
							<div className="row">
								<div className="col-6 mb-2">
									<input
										type="date"
										className="form-control form-control-sm" />
								</div>
								<div className="col-6 mb-2">
									<input
										type="date"
										className="form-control form-control-sm" />
								</div>
							</div>
						</div>
						<ul className="listview flush transparent simple-listview no-space mt-1">
							<li>
								<strong>ລະຫັດພະນັກງານ(ID)</strong>
								<span>1524</span>
							</li>
							<li>
								<strong>ເງິນຕຳແໜ່ງ</strong>
								<span>0 ກີບ</span>
							</li>
							<li>
								<strong>ເງິນເພິ່ມ</strong>
								<span>0 ກີບ</span>
							</li>
							<li>
								<strong>ອໍເດີສົ່ງສຳເລັດທັງໝົດ</strong>
								<span>125 / 2,500,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງໄລຍະໃກ້</strong>
								<span>50 x 5.500 = 275,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງໄລຍະກາງ</strong>
								<span>30 x 7,000 = 210,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງໄລຍະໄກ</strong>
								<span>60 x 12,000 = 720,000 ກີບ</span>
							</li>
							<li>
								<strong>ສ່ວນແບ່ງອໍເດີ</strong>
								<span><b> 125 x 500 = 65.500 ກີບ</b></span>
							</li>
							<li>
								<strong>ລວມສ່ວນແບ່ງ</strong>
								<span className="text-danger">1,270,500 ກີບ</span>
							</li>
							<li>
								<strong>
									<i className="fa-solid fa-money-bill-wave mr-1" />
									ເງິນເດືອນ 10/2022
								</strong>
								<span className="text-success">1,270,500 ກີບ</span>
							</li>
						</ul>
					</div>
				</div>
				<BottomNav />
			</div>

		</>
	);
}
