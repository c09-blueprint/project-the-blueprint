import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Auth0ProviderNavigate } from "./components/auth0/auth0ProviderNavigate";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <Auth0ProviderNavigate>
        <App />
      </Auth0ProviderNavigate>
    </Router>
  </Provider>
);
