/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from "react";
import { Modal, Row } from "react-bootstrap";
import { aws_url_images} from "../../helper";
function PreviewImage({ image }) {
  const [show, setShow] = useState(false);
  return (
    <React.Fragment>
      <button className="btn btn-sm btn-light" disabled={image?false:true} onClick={() => setShow(true)}>
        <i className="icon-receipt" />
      </button>

      <Modal
        size="xl"
        show={show}
        onHide={() => setShow(false)}
        animation={false}
      >
        <Modal.Body className="">
          <a
            href="javaScript:void(0)"
            className="pull-right"
            style={{ textDecoration: "none" }}
            onClick={() => setShow(false)}
          >
            <i className="icon-x fa-2x text-danger" />
          </a>
          {!image ? (
            <div className="text-center">
              <h3>ບໍ່ມີບິນ</h3>
            </div>
          ) : (
            <img src={aws_url_images + image} className="w-100" />
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default PreviewImage;
