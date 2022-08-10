/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import sound from "../../audio/beep.mp3";

export default function ScannerScreen({ history }) {
  const [data, setData] = useState("");
  const [userModel, setUserModel] = useState("environment");

  useEffect(() => {
    if (data) {
      const audioEl = document.getElementsByClassName("audio-element")[0];
      audioEl.play();
    }
  }, [data]);

  const handleSwhich = () => {
    if (userModel === "environment") {
      setUserModel("user");
    } else {
      setUserModel("environment");
    }
  };

  console.log({userModel})
  return (
    <>
      <div className="appHeader text-light border-0 d-flex nav-container">
        <div style={{ flex: 1 }} className="text-left">
          <button
            className="btn text-white mr-2"
            onClick={() => history.goBack()}
          >
            <i className="icon-x fs-4" />
          </button>
        </div>
        ສະແກນ QR ເພື່ອສະແດງຂໍ້ມູນ
        <div
          className="text-white pageTitle text-center text-nowrap pr-0"
          style={{ flex: 1 }}
        >
          <a
            href="javascript:void(0)"
            className="btn text-white"
            onClick={() => handleSwhich()}
          >
            <i className="icon-refresh-cw fs-4 text-white"></i>
          </a>
        </div>
      </div>
      <audio className="audio-element">
        <source src={sound}></source>
      </audio>
      <QrReader
      onClick={() =>  handleSwhich()}
        className="qr-reader rounded w-100"
        videoId="reader"
        constraints={{
          facingMode: userModel === true ? "user" : "environment",
          frameRate: { ideal: 60, max: 80 },
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          aspectRatio: { ideal: 1, max: 2 },
        }}
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        scanDelay={500}
        videoStyle={{
          width: "100%",
          height: 500,
          borderRadius: "15px",
          marginTop: "10px",
        }}
      />

      <p>{data}</p>
    </>
  );
}
