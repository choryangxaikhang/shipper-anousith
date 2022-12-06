// // import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";

export default function Locations({ data, disabled }) {
	const [show, setShow] = useState(false);

	return (
		<React.Fragment>
			<button
				type="button"
				className="btn btn-right right btn-block rounded border btn-xs me-2 mt-2 w-100"
				onClick={() => setShow(true)}
				style={{background:'#ccc'}}
			>
			<i class="fa-solid fa-location-dot mr-2 fs-2 text-danger" /> ທີ່ຢູ່ປາຍທາງ
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
					<i class="fa-solid fa-location-dot mr-1 fs-2 text-danger" /> ທີ່ຢູ່ປາຍທາງ
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="mapouter">		
							<div className="gmap_canvas">
								<iframe
									width={"100%"}
									height={230}
									id="gmap_canvas"
									src={`https://maps.google.com/maps?q=${data?.mapLat
										? data?.mapLat : "-"
										},${data?.mapLong
											? data?.mapLong : "-"
										}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
									frameBorder={0}
									scrolling="no"
									marginHeight={0}
									marginWidth={0}
								/>
								<br />
								<style
									dangerouslySetInnerHTML={{
										__html:
											".mapouter{position:relative;text-align:right;height:100%;width:100%;}",
									}}
								/>
								<style
									dangerouslySetInnerHTML={{
										__html:
											".gmap_canvas {overflow:hidden;background:none!important;height:100%;width:100%;}",
									}}
								/>
							</div>			
					</div>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
}
