/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import "./index.css";
import BottomNav from "../../layouts/BottomNav";
import Imglogo from "../../img/logo-bg.png";
import cover1 from "../../img/cover.jpeg";
import { QUERY_ROOMS } from "./apollo";
import {
  aws_url_image,
  currency,
  formatDateTime,
  loadingData,
} from "../../helper";
import BookingNow from "../../components/BookingNow";
import { AppContext } from "../../App";

export default function Home() {
  const { history } = useReactRouter();
  const { userState, titleDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [listRoom, setListRoom] = useState([]);
  const [queryRoom, { data, loading, error }] = useLazyQuery(QUERY_ROOMS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    queryRoom({
      variables: {
        where: {
          status: "FEE",
          province: parseInt(userData?.province?._id),
          district: parseInt(userData?.district?._id),
        },
        orderBy: "createdAt_DESC",
        limit: 20,
      },
    });
  }, []);

  useEffect(() => {
    if (data) {
      setListRoom(data?.rooms?.data);
    }
  }, [data]);

  return (
    <>
      <body>
        <div
          id="appCapsule"
          style={{
            backgroundColor: "#eb6572",
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          <div className="appHeader text-light border-0 mb-3 text-right">
            <div style={{ flex: 1 }} className="text-left">
              {/* <a className="ml-3">
                <i className="icon-search1" style={{ fontSize: 20 }} />
              </a> */}
            </div>
            ໜ້າຫຼັກ
            <div
              className="text-white pageTitle text-center text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <a className="mr-3 float-right">
                <i className="icon-bell" style={{ fontSize: 20 }} />
              </a>
            </div>
          </div> 
          <div className="body-content body-content-lg mt-5">
            <div className="container">
              <div className="add-card section-to-header mb-30">
                <div className="add-card-inner">
                  <div className="add-card-item add-card-info">
                    <p>ເງິນເດືອນພື້ນຖານ</p>
                    <h3>$1,450.50</h3>
                  </div>
                  <div
                    className="add-card-item add-balance"
                    data-bs-toggle="modal"
                    data-bs-target="#addBalance"
                  >
                    <a href="#">
                      <i className="icon-user" />
                    </a>
                    <p>ID: 001</p>
                  </div>
                </div>
              </div>
              <div className="option-section mb-15">
                <div className="row gx-2">
                  <div className="col-6 pb-15">
                    <div className="option-card option-card-violet">
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#withdraw"
                      >
                        <div className="option-card-icon">
                          <i className="flaticon-down-arrow" />
                        </div>
                        <p>Withdraw</p>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 pb-15">
                    <div className="option-card option-card-blue">
                      <a href="my-cards.html">
                        <div className="option-card-icon">
                          <i className="flaticon-credit-card" />
                        </div>
                        <p>Cards</p>
                      </a>
                    </div>
                  </div>
                  <div className="col-12 pb-15">
                    <div className="option-card option-card-red">
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#exchange"
                      >
                        <div className="option-card-icon">
                          <i className="flaticon-exchange-arrows" />
                        </div>
                        <p>Exchange</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feature-section mb-15">
                <div className="row gx-3">
                  <div className="col col-sm-6 pb-15">
                    <div className="feature-card feature-card-red">
                      <div className="feature-card-thumb">
                        <i className="flaticon-income" />
                      </div>
                      <div className="feature-card-details">
                        <p>Income</p>
                        <h3>$485.50</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col col-sm-6 pb-15">
                    <div className="feature-card feature-card-blue">
                      <div className="feature-card-thumb">
                        <i className="flaticon-expenses" />
                      </div>
                      <div className="feature-card-details">
                        <p>Expenses</p>
                        <h3>$95.50</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="saving-goals-section pb-15">
                <div className="section-header">
                  <h2>Saving Goals</h2>
                  <div className="view-all">
                    <a href="my-savings.html">View All</a>
                  </div>
                </div>
                <div className="progress-card progress-card-red mb-15">
                  <div className="progress-card-info">
                    <div className="circular-progress" data-note="50.85">
                      <svg width={55} height={55} className="circle-svg">
                        <circle
                          cx={28}
                          cy={27}
                          r={25}
                          className="circle-progress circle-progress-path"
                        />
                        <circle
                          cx={28}
                          cy={27}
                          r={25}
                          className="circle-progress circle-progress-fill"
                        />
                      </svg>
                      <div className="percent">
                        <span className="percent-int">0</span>%
                      </div>
                    </div>
                    <div className="progress-info-text">
                      <h3>New Gadget</h3>
                      <p>Lifestyle</p>
                    </div>
                  </div>
                  <div className="progress-card-amount">$250.00</div>
                </div>
                <div className="progress-card progress-card-blue mb-15">
                  <div className="progress-card-info">
                    <div className="circular-progress" data-note={25}>
                      <svg width={55} height={55} className="circle-svg">
                        <circle
                          cx={28}
                          cy={27}
                          r={25}
                          className="circle-progress circle-progress-path"
                        />
                        <circle
                          cx={28}
                          cy={27}
                          r={25}
                          className="circle-progress circle-progress-fill"
                        />
                      </svg>
                      <div className="percent">
                        <span className="percent-int">0</span>%
                      </div>
                    </div>
                    <div className="progress-info-text">
                      <h3>New Apartment</h3>
                      <p>Living</p>
                    </div>
                  </div>
                  <div className="progress-card-amount">$5000.00</div>
                </div>
                <div className="progress-card progress-card-green mb-15">
                  <div className="progress-card-info">
                    <div className="circular-progress" data-note={75}>
                      <svg width={55} height={55} className="circle-svg">
                        <circle
                          cx={28}
                          cy={27}
                          r={25}
                          className="circle-progress circle-progress-path"
                        />
                        <circle
                          cx={28}
                          cy={27}
                          r={25}
                          className="circle-progress circle-progress-fill"
                        />
                      </svg>
                      <div className="percent">
                        <span className="percent-int">0</span>%
                      </div>
                    </div>
                    <div className="progress-info-text">
                      <h3>Education</h3>
                      <p>Lifestyle</p>
                    </div>
                  </div>
                  <div className="progress-card-amount">$1250.00</div>
                </div>
              </div>
              <div className="monthly-bill-section pb-15">
                <div className="section-header">
                  <h2>Monthly Bills</h2>
                  <div className="view-all">
                    <a href="monthly-bills.html">View All</a>
                  </div>
                </div>
                <div className="row gx-3">
                  <div className="col-6 pb-15">
                    <div className="monthly-bill-card monthly-bill-card-green">
                      <div className="monthly-bill-thumb">
                        <img src="assets/images/cm-logo-1.png" alt="logo" />
                      </div>
                      <div className="monthly-bill-body">
                        <h3>
                          <a href="#">Envato.com</a>
                        </h3>
                        <p>Debit Services Subscribtion</p>
                      </div>
                      <div className="monthly-bill-footer monthly-bill-action">
                        <a href="#" className="btn main-btn">
                          Pay Now
                        </a>
                        <p className="monthly-bill-price">$99.99</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 pb-15">
                    <div className="monthly-bill-card monthly-bill-card-green">
                      <div className="monthly-bill-thumb">
                        <img src="assets/images/cm-logo-2.png" alt="logo" />
                      </div>
                      <div className="monthly-bill-body">
                        <h3>
                          <a href="#">Oban.com</a>
                        </h3>
                        <p>Credit Services Subscribtion</p>
                      </div>
                      <div className="monthly-bill-footer monthly-bill-action">
                        <a href="#" className="btn main-btn">
                          Pay Now
                        </a>
                        <p className="monthly-bill-price">$75.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 pb-15">
                    <div className="monthly-bill-card monthly-bill-card-green">
                      <div className="monthly-bill-thumb">
                        <img src="assets/images/cm-logo-3.png" alt="logo" />
                      </div>
                      <div className="monthly-bill-body">
                        <h3>
                          <a href="#">Nezox.com</a>
                        </h3>
                        <p>Internet Monthly Subscribtion</p>
                      </div>
                      <div className="monthly-bill-footer monthly-bill-action">
                        <a href="#" className="btn main-btn">
                          Pay Now
                        </a>
                        <p className="monthly-bill-price">$50.50</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 pb-15">
                    <div className="monthly-bill-card monthly-bill-card-green">
                      <div className="monthly-bill-thumb">
                        <img src="assets/images/cm-logo-4.png" alt="logo" />
                      </div>
                      <div className="monthly-bill-body">
                        <h3>
                          <a href="#">Depan.com</a>
                        </h3>
                        <p>Depan Monthly Subscribtion</p>
                      </div>
                      <div className="monthly-bill-footer monthly-bill-action">
                        <a href="#" className="btn main-btn">
                          Pay Now
                        </a>
                        <p className="monthly-bill-price">$100.99</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </body>
    </>
  );
}
