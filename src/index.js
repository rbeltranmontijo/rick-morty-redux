import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.css";
import { Provider } from "react-redux";
import gereateStore from "./redux/store";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

let store = gereateStore();
let client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql"
});

let WithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

let WhithStore = () => (
  <Provider store={store}>
    <WithRouter />
  </Provider>
);

let WhiteApollo = () => (
  <ApolloProvider client={client}>
    <WhithStore />
  </ApolloProvider>
);

ReactDOM.render(<WhiteApollo />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
