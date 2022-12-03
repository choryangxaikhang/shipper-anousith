// // import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { useApolloClient, useMutation } from "@apollo/client";
import { messageError, messageSuccess } from "../../../helper";
import Notiflix from "notiflix";
import { UPDATE_ITEMS } from "../apollo";
import { useFormik } from "formik";

export default function CODCompleted({ getData, loadData, data, disabled }) {
	//form state
	const client = useApolloClient();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const [updateListItem] = useMutation(UPDATE_ITEMS);
	const [valueKIP, setValueKIP] = useState(data?.itemValueKIP);
	const [valueTHB, setValueTHB] = useState(data?.itemValueTHB);
	const [valueUSD, setValueUSD] = useState(data?.itemValueUSD);

	const { handleChange, handleSubmit, values } = useFormik({
		initialValues: {
			realValueKIP: 0,
			realValueTHB: 0,
			realValueUSD: 0,
			description: "",
		},
		onSubmit: async (values) => {
			try {
				await client.mutate({
					mutation: UPDATE_ITEMS,
					variables: {
						data: {
							description: values?.description,
							itemStatus: "COMPLETED",
							realValueKIP: parseInt(valueKIP),
							realValueTHB: parseInt(valueTHB),
							realValueUSD: parseInt(valueUSD),
						},
						where: {
							_id: parseInt(data?._id),
						},
					},
				});
				messageSuccess("ດຳເນີນການສຳເລັດ");
				getData(!loadData);
				handleClose(!show)
			} catch (error) {
				console.log(error);
				messageError("ການດຳເນິນງານບໍ່ສຳເລັດ");
			}
		},
	});

	return (
		<React.Fragment>
			<button
				disabled={disabled}
				type="button"
				className="btn btn-success right btn-block rounded btn-xs me-2"
				onClick={() => setShow(true)}
			>
				<i className="fa-solid fa-circle-check mr-1 left" /> ສົ່ງສຳເລັດ
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
								defaultValue={valueTHB || 0}
								className="form-control"
								placeholder="0"
							/>
						</div>
						<div className="form-group">
							<label>ເງິນcod USD </label>
							<input
								type="number"
								defaultValue={valueUSD || 0}
								className="form-control"
								placeholder="0"
							/>
						</div>
						<div className="form-group">
							<label>ລາຍຈ່າຍເພິ່ມເຕີມ  </label>
							<textarea
								name="description"
								value={values.description}
								onChange={handleChange}
								rows={2}
								className="form-control"
								placeholder=" "
							/>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-success rounded btn-block btn-lg"
						// onClick={() => updateDistance(data?._id)}
						onClick={handleSubmit}
					>
						<i className="fa-solid fa-circle-check mr-1 fs-2" />
						ຢຶນຢັນສົ່ງສຳເລັດ
					</button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}
