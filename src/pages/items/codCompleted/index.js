// // import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import { messageError, messageSuccess } from "../../../helper";
import Notiflix from "notiflix";
import { UPDATE_LIST_ITEM } from "../apollo";

export default function CODCompleted({ getData, loadData, data }) {
	//form state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const [updateListItem] = useMutation(UPDATE_LIST_ITEM);
	const [valueKIP, setValueKIP] = useState(data?.itemValueKIP)
	const [valueTHB, setValueTHB] = useState(data?.itemValueTHB)
	const [valueUSD, setValueUSD] = useState(data?.itemValueUSD)
	
	const updateDistance = (id) => {
		Notiflix.Confirm.show(
			"ແຈ້ງເຕືອນ",
			"ທ່ານຕ້ອງການຢືນຢັນ ແທ້ ຫຼື ບໍ່?",
			"ຕົກລົງ",
			"ຍົກເລີກ",
			async () => {
				try {
					const _updateDistance = await updateListItem({
						variables: {
							data: {
								itemStatus: "COMPLETED"
							},
							where: {
								_id: parseInt(id),
							},
						},
					});

					if (_updateDistance) {
						messageSuccess("ດຳເນີນການສຳເລັດ");
						getData(!loadData);
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

	return (
		<React.Fragment>
			<button
				type="button"
				className="btn btn-success right rounded btn-xs me-2"
				onClick={() => setShow(true)}
			>
				<i className="fa-solid fa-circle-check mr-1 left" /> ຢືນຢັນ
			</button>
			<Modal
				centered
				show={show}
				onHide={() => setShow(false)}
				animation={false}
				backdrop="static"
				size="lx"
			>
				<Modal.Header closeButton>
					<Modal.Title className="fs-5">
						<i className="icon-sliders" /> tranking: {data?.trackingId}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<div className="form-group">
							<label>ເງິນcod KIP </label>
							<input
								type="number"
								disabled
								name="realValueKIP"
								defaultValue={valueKIP || 0}
								className="form-control"
								placeholder="0"
							/>
						</div>
						<div className="form-group">
							<label>ເງິນcod THB </label>
							<input
								type="number"
								disabled
								defaultValue={valueTHB || 0}
								className="form-control"
								placeholder="0"
							/>
						</div>
						<div className="form-group">
							<label>ເງິນcod USD </label>
							<input
								type="number"
								disabled
								defaultValue={valueUSD || 0}
								className="form-control"
								placeholder="0"
							/>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-success rounded btn-block btn-lg"
						onClick={() => updateDistance(data?._id)}
					>
						<i className="fa-solid fa-circle-check mr-1 fs-2" />
						ຢຶນຢັນສົ່ງສຳເລັດ
					</button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}
