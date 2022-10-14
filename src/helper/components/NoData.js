import { red } from "@mui/material/colors";
import React from "react";
import { Image } from "react-bootstrap";
import bgImage from "../../img/logo-bg.png";
import noData from "../../img/wrong.png";
export default function NoData({ loading }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(80vh - 40px)",
      }}
    >
      {loading ? (
        // <Image
        //   src={require("../../img/empty.gif").default}
        //   style={{ width: "50%" }}
        // />
        <></>
      ) : (
        <>
          <div
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              minWidth: "100%",
              minHeight: "100%",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.03,
              position: "absolute",
            }}
          ></div>
          <img src={noData}
           width= "15%"
          />
        </>
      )}
    </div>
  );
}
