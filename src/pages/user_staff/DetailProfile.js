import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import useReactRouter from "use-react-router";
import {
  currency,
  formatDateDash,
  ITEM_PER_PAGE,
  loadingData,
  messageError,
  messageSuccess,
  setGender,
  userStatus,
} from "../../helper";
import female from "../../img/female.png";
import male from "../../img/male.png";
import * as ROUTES from "../../routes/app";
import Notiflix from "notiflix";
import { QUERY_USER_STAFF } from "./apollo";

export default function DetailProfile() {
  const { history, location, match } = useReactRouter();
  const getId = match?.params?._id;
  // get query search
  const query = new URLSearchParams(location.search);
  const rows = parseInt(query.get("rows"));
  const [numberRows, setNumberRows] = useState(rows ? rows : ITEM_PER_PAGE);
  const [dataUserStaff, setDataUserStaff] = useState([]);
  const [newLoadData, setNewLoadData] = useState(false);

  const [getUserStaff, { data: resUserStaffData, loading }] = useLazyQuery(
    QUERY_USER_STAFF,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    getUserStaff({
      variables: {
        where: {
          _id:parseInt(getId),
        },
        limit: 1,
      },
    });
  }, [getId]);
  useEffect(() => {
    if (resUserStaffData) {
      setDataUserStaff(resUserStaffData?.users?.data);
    }
  }, [resUserStaffData]);
  //pageination
  const countData = resUserStaffData?.users?.total;
  const countPage = [];
  for (var i = 1; i <= Math.ceil(countData / numberRows); i++) {
    countPage.push(i);
  }

  return (
    <>
      <div classNameName="content__header content__boxed overlapping">
        <div classNameName="content__wrap">
          <h3 classNameName="page-title mb-2 text-white">
            ລາຍລະອຽດໂປຮໄຟລ໌ພະນັກງານ
          </h3>
        </div>
      </div>
      <div classNameName="content__boxed">
        <div classNameName="content__wrap">
          <div classNameName="row">
            <div classNameName="col-md-12">
              <div classNameName="row card">
                <div classNameName="card-body">
                  <div classNameName="table-responsive">
                    <table classNameName="table table-striped table-sm">
                      <tbody>
                        {resUserStaffData?.users?.data &&
                          resUserStaffData?.users?.data?.map((data, index) => (
                            <>
                              <div classNameName="col-md-2">
                                {data?.profileImage ? (
                                  <></>
                                ) : (
                                  <>
                                    <img
                                      src={male}
                                      style={{
                                        width: "170px",
                                        height: "180px",
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                              <tr>
                                <td classNameName="text-left">ຊື ແລະ ນາມສະກຸມ</td>
                                <td classNameName="text-end">
                                  {data?.firstName ? data?.firstName : "-"}{" "}
                                  {data?.lastName ? data?.lastName : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>ເພດ:</td>
                                <td classNameName="text-end">
                                  {setGender(data?.gender ? data?.gender : "-")}
                                </td>
                              </tr>
                              <tr>
                                <td>ອາຍຸ:</td>
                                <td classNameName="text-end">
                                  {data?.phoneNumber ? data?.phoneNumber : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>ແຂວງ:</td>
                                <td classNameName="text-end">
                                  {data?.province?.provinceName
                                    ? data?.province?.provinceName
                                    : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>ເມືອງ:</td>
                                <td classNameName="text-end">
                                  {data?.district?.title
                                    ? data?.district?.title
                                    : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>ບ້ານ:</td>
                                <td classNameName="text-end">
                                  {data?.village?.title
                                    ? data?.village?.title
                                    : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>ບັດປະຈຳຕົວ ຫລື ສຳມະໂນຄົວ:</td>
                                <td classNameName="text-end">
                                  {data?.carSign ? data?.carSign : "-"}
                                </td>
                              </tr>
                              <tr>
                                <td>ຕຳແຫນ່ງ:</td>
                                <td classNameName="text-end">
                                  {userStatus(data?.role ? data?.role : "-")}
                                </td>
                              </tr>
                              <tr>
                                <td>ເງິນເດືອນພື້ນຖານ:</td>
                                <td classNameName="text-end">
                                  {currency(
                                    data?.basicSalary ? data?.basicSalary : 0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>ວັນທີ່ເລີ່ມງານ:</td>
                                <td classNameName="text-end">
                                  {formatDateDash(
                                    data?.startWorkTime
                                      ? data?.startWorkTime
                                      : 0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>ວັນທີອອກວຽກ:</td>
                                <td classNameName="text-end">
                                  {formatDateDash(
                                    data?.endWorkTime ? data?.endWorkTime : 0
                                  )}
                                </td>
                              </tr>
                            </>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
