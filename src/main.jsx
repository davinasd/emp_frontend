
import React from "react";
import ReactDOM from "react-dom/client";
import WrappedApp from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <WrappedApp />
        <ToastContainer />
      </React.StrictMode>
    </Router>
  </Provider>
);
