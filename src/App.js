import React, { useEffect, useReducer, useState } from "react";
import "moment/locale/lo";
import "./index.css";
import { clearLocalStorage, startOfMonth, TOKEN } from "./helper";
import _ from "lodash";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Routes from "./routes";
import { pageTitleReducer, userReducer, dateReducer } from "./store";
const api = "https://api.services.anousith.express/graphql";
const AppContext = React.createContext();
export default function App() {
  const [userState, userDispatch] = useReducer(userReducer, null);
  const [titleState, titleDispatch] = useReducer(pageTitleReducer, null);
  const [dateState, dateDispatch] = useReducer(dateReducer, {
    startDate: new Date(),
    endDate: new Date(),
  });

  const authLink = setContext((_, { headers }) => {
    const _local = localStorage.getItem(TOKEN);
    let token = JSON.parse(_local);
    token = token?.accessToken;
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    const isError1 = _.some(graphQLErrors, {
      message: "Error: TokenExpiredError: jwt expired",
    });
    const isError2 = _.some(graphQLErrors, {
      message: "Error: JsonWebTokenError: jwt must be provided",
    });
    const isError3 = _.some(graphQLErrors, {
      message: "Error: DO_NOT_HAVE_PERMISSION",
    });
    let message = "";
    if (isError1) {
      window.location.replace("/login");
    }
    if (isError2) {
      message = "ຂໍອະໄພ ມີຂໍ້ຜິດພາດ ກະລຸນາເຂົ້າລະບົບໃໝ່ອີກຄັ້ງ";
    }
    if (isError3) {
      message = "ຂໍອະໄພ ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າໃຊ້ງານ";
    }

    if (isError1) {
        window.location.replace("/login");
    }
  });

  const client = new ApolloClient({
    link: from([
      errorLink,
      authLink.concat(
        createHttpLink({
          uri: api,
        })
      ),
    ]),
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
  return (
    <AppContext.Provider
      value={{
        userState,
        userDispatch,
        titleState,
        titleDispatch,
        dateState,
        dateDispatch,
      }}
    >
      <ApolloProvider client={client}>
        <div className="app-container">
          <Routes />
        </div>
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export { AppContext };
