// // import { useLazyQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import { messageError, messageSuccess } from "../../../helper";
import { UPDATE_LIST_ITEM } from "../apollo";
import { useFormik, } from "formik";
import "../index.css";
import SignatureCanvas from 'react-signature-canvas';
import { Controller } from "react-hook-form";
export default function InsertAmount({ getData, loadData, data }) {
	//form state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const [updateListItem] = useMutation(UPDATE_LIST_ITEM);
	let sigCanvas = useRef({});

	const { handleChange, errors, control, values, handleSubmit, resetForm } =
		useFormik({
			initialValues: {
				amount: data?.amount
			},
			enableReinitialize: false,
			validate: (values) => {
				const errors = {};
				if (!values.amount) {
					errors.amount = "ປ້ອນຈຳນວນ";
				}
				return errors;
			},
			onSubmit: async (values) => {
				try {
					const { data: inputData } = await updateListItem({
						variables: {
							data: {
								amount: parseFloat(values.amount),
							},
						},
					});
					if (inputData) {
						messageSuccess("ດຳເນີນການສຳເລັດ");
						getData(!loadData);
						setTimeout(() => {
							resetForm({ values: "" });
							window.scrollTo(0, 0);
						}, 100);
					} else {
						messageError("ເປີດຫ້ອງບໍ່ສຳເລັດ");
					}
				} catch (error) {
					messageError("ເປີດຫ້ອງບໍ່ສຳເລັດ");
				}
			},
		});

	const formatIntoPng = () => {
		if (sigCanvas.current) {
			const dataURL = sigCanvas.current.toDataURL();
			return dataURL;
		}
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
					<Modal.Title className="fs-5 text-danger">
						<i className="icon-sliders text-danger" /> ID: {data?.customer?.id_list}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<div className="form-group">
							<label>ຈຳນວນພັດສະດຸ </label>
							<input
								type="number"
								name="amount"
								value={values.amount}
								onChange={handleChange}
								className="form-control"
								placeholder="0"
							/>
						</div>
						<div className="form-group">
							<label className="align-top">ລາຍເຊັນ </label>
							{/* <Controller
								name="image"
								control={control}
								render={({ field }) => ( */}
									<SignatureCanvas
										ref={sigCanvas}
										// onEnd={() => field.onChange(formatIntoPng())}
										penColor='blue'
										name="image"
										control={control}
										canvasProps={{
											height: 220,
											width: 300,									
											className: 'sigCanvas border btn-block'
										}}
									/>
									{/* )}
								/> 		 */}
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-success rounded btn-block btn-lg"
						onClick={() => handleSubmit()}
					// onClick={handleSubmit(onSubmit)}
					// disabled={isDisabled}
					>
						<i className="fa-solid fa-circle-check mr-1 fs-2" />
						ຢືນຢືນຮັບເຂົ້າ
					</button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}
