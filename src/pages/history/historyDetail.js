/* eslint-disable jsx-a11y/iframe-has-title */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { QUERY_BRANCHES } from "./apollo";
import { loadingData } from "../../helper";

export default function HistoryDetailScreen({ history, match, location }) {
  const branchID = parseInt(match?.params?.id);
  const [listBranch, setListBranch] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [branches, { data: branchData, loading }] = useLazyQuery(
    QUERY_BRANCHES,
    { fetchPolicy: "cache-and-network" }
  );

  useEffect(() => {
    branches({
      variables: {
        where: {
          id_branch: branchID,
        },
        skip: 0,
        limit: 1,
      },
    });
  }, [branchID, reloadData]);

  useEffect(() => {
    if (branchData) {
      setListBranch(branchData?.branches?.data[0]);
    }
  }, [branchData]);

  return (
    <>
      <div id="appCapsule">
        <div className="justify-content-md-center">
          <div className="appHeader text-light border-0">
            <div style={{ flex: 1 }} className="text-left">
              <button
                className="btn text-white"
                onClick={() => history.goBack()}
              >
                <i className="icon-x fs-4" />
              </button>
            </div>
            ລາຍລະອຽດສາຂາ
            <div
              className="text-white pageTitle text-right text-nowrap pr-0"
              style={{ flex: 1 }}
            >
              <button
                type="button"
                className="btn text-white mr-0"
                onClick={() => setReloadData(!reloadData)}
              >
                {loading ? (
                  loadingData(23)
                ) : (
                  <i className="icon-refresh-ccw fs-4" />
                )}
              </button>
            </div>
          </div>
          {loading ? (
            <center className="mt-2">
              {loadingData(25, "ກຳລັງໂຫຼດຂໍ້ມູນ...")}
            </center>
          ) : (
            <>
              <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    width={"100%"}
                    height={230}
                    id="gmap_canvas"
                    src={`https://maps.google.com/maps?q=${
                      listBranch?.map_lat ? listBranch?.map_lat : "-"
                    },${
                      listBranch?.map_lng ? listBranch?.map_lng : "-"
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
                        ".mapouter{position:relative;text-align:right;height:230px;width:100%;}",
                    }}
                  />
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        ".gmap_canvas {overflow:hidden;background:none!important;height:230px;width:100%;}",
                    }}
                  />
                </div>
              </div>
              <div className="section mt-2">
                <div className="listview-title ml-0">
                  <h3>
                    {listBranch?.branch_name ? listBranch?.branch_name : "-"}
                  </h3>
                </div>
                <ul className="listview image-listview card text rounded pr-1">
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ສະຖານະ</div>
                        <div
                          className={`custom-control custom-switch ${
                            listBranch?.public == 1
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {listBranch?.public == 1
                            ? "ເປີດບໍລິການປົກກະຕິ"
                            : "ປິດບໍລິການ"}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ບ້ານ</div>
                        <div className="custom-control custom-switch">
                          {listBranch?.branch_address
                            ? listBranch?.branch_address
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div> ເມືອງ</div>
                        <div className="custom-control custom-switch">
                          {listBranch?.districtName
                            ? listBranch?.districtName
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <div className="in">
                        <div>ແຂວງ</div>
                        <div className="custom-control custom-switch">
                          {listBranch?.provinceID?.provinceName
                            ? listBranch?.provinceID?.provinceName
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="listview-title ml-0 mt-2">
                  <h3>ຂໍ້ມູນຕິດຕໍ່ ແລະ ທີ່ຢູ່</h3>
                </div>
                <ul className="listview image-listview card text rounded pr-1">
                  <li>
                    <div className="item">
                      <div className="in">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: listBranch?.address_info
                              ? listBranch?.address_info
                              : "-",
                          }}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
