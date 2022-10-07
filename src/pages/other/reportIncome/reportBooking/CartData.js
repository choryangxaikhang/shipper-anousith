import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
// import Chart from 'react-apexcharts'
import { QUERY_REPORT_BOOKING } from "./apollo";

export default function ReportBooking() {
  const [fetchData, { data: setData, loading: loadingEsySpeed }] = useLazyQuery(
    QUERY_REPORT_BOOKING,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    fetchData({
      variables: {
        where: {
        },
      },
    });
  }, []);
  const getData = setData?.bookings?.total;

  const state = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "1-7",
          "7-14",
          "14-22",
          "22-29",
        ],
      },
    },
    
    series: [
      {
        name: "ຍອດລວມ",
        data: [
          getData,
          5,
          7,
          10,
        ],
      },
      
    ],
  };
  return (
    <div className="row">
            <div className="mixed-chart text-center mt-4">
              {/* <Chart
                width={"100%"}
                height={"400px"}
                options={state.options}
                series={state.series}
                type="bar"
              /> */}
            </div>
          </div>
  )
}