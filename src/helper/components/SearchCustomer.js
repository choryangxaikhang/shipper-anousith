import { useApolloClient, useLazyQuery } from "@apollo/client";
import { IconButton, InputBase, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { loadingData } from "..";
import { CUSTOMER } from "./apollo";
import useReactRouter from "use-react-router";

export default function SearchCustomer({ response, error, roomID }) {
  const { history, location, match } = useReactRouter();
  const query = new URLSearchParams(location.search);
  const _phone = parseInt(query.get("phone"));
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(_phone);

  const [queryCustomer, { data: customerData, loading }] = useLazyQuery(
    CUSTOMER,
    { fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    if (phoneNumber) {
      setLoadingPhone(true);
      queryCustomer({
        variables: {
          where: {
            phoneNumber: parseInt(_phone) || null,
          },
          limit: 1,
          orderBy: "createdAt_DESC",
        },
      });
      setLoadingPhone(false);
    }
  }, [_phone]);

  useEffect(() => {
    if (customerData) {
      response(customerData.customers.data[0]);
    }
  }, [customerData]);

  return (
    <>
      {/* <TextField
            type="search"
            className="inputLabel"
            label="ປ້ອນເບີໂທ" variant="outlined"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                history.push(`/hotel/${roomID}/?phone=${phoneNumber}`);
              }
            }}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber || ""}
            sx={{ m: 0, backgroundColor: "#fafafa", width:"100%" }}
            error={error}
          /> */}
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{
            m: 0,
            width: "100%",
            height: "55px",
          }}
          type={"search"}
          placeholder="ຄົ້ນຫາ"
          className="ms-2"
          onWheel={(e) => e.target.blur()}
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber || ""}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              history.push(`/hotel/${roomID}/?phone=${phoneNumber}`);
            }
          }}
        />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
          onClick={() => {
            history.push(`/hotel/${roomID}/?phone=${phoneNumber}`);
          }}
        >
          {loadingPhone ? (
            loadingData(20)
          ) : (
            <i className="icon-search1  me-1" />
          )}{" "}
          ຄົ້ນຫາ
        </IconButton>
      </Paper>
    </>
  );
}
