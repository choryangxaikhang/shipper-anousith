import React, { useState } from "react";
import _ from "lodash";
import useReactRouter from "use-react-router";
import Imglogo from "../../../../img/anousith.png";
import SelectLocalHouse from "../../../../helper/components/SelectLocalHouse";
import { TAB_MENU_COMPLETED } from "../../../../routes/app";

export default function DetailICompleted() {
	const { location, history, match } = useReactRouter();
	const [localHouse, setLocalHouse] = useState("");
	const [clickButton, setButton] = useState(false);

	return (

		<>
			<div className="appHeader text-light border-0 mr-0">
				<div style={{ flex: 1 }} className="text-left">
					<button
						className="btn text-white"
						onClick={() => history.push(`${TAB_MENU_COMPLETED}/1`)}
					>
						<i className="fa fa-chevron-left fs-4" />
					</button>
				</div>
				<b className="text-white">ລາຍງານ</b>
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
							<li>
								<strong>ລະຫັດພັດສະດຸ</strong>
								<span>2221245125412</span>
							</li>
							<li>
								<strong>ວັນທີ່ຝາກ</strong>
								<span>10/10/2022 10:45 AM</span>
							</li>
							<li>
								<strong>ສາຂາຕົ້ນທາງ</strong>
								<span>ຈອມມະນີໃຕ້</span>
							</li>
							<li>
								<strong>ສາຂາປາຍທາງ</strong>
								<span>ວຽງຈະເລີນ</span>
							</li>
							<li>
								<strong>ຊື່ລູກຄ້າ</strong>
								<span className="text-success">ຈ່ອຍ ອິນທະວົງ</span>
							</li>
							<li>
								<strong>ເບີໂທ</strong>
								<span>54562542</span>
							</li>
							<li>
								<strong>ຂະໜາດ:</strong>
								<span>150 cm</span> |
								<strong>ນ້ຳໜັກ:</strong>
								<span>14 Kg</span>

							</li>
							<li>
								<strong>ຄ່າບໍລິການ:</strong>
								<h3 className="m-0">25000 ກີບ</h3> |
								<span>ຈ່າຍປາຍທາງ</span>
							</li>
							<li>
								<strong>ເງິນ COD: </strong>
								<span>500000 ກີບ</span> |
								<span>2500 ບາດ</span> |
								<span>100 ໂດລາ</span>
							</li>
							<li>
								<strong>ລວມທັງໝົດ: </strong>
								<h3>500000 ກີບ</h3>
							</li>
						</ul>
					</div>
				</div>
				<h3 className="text-center mt-3">ຂອບໃຈທີ່ໃຊ້ບໍລິການ </h3>
			</div>
		</>
	);
}
