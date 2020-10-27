import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import "antd/dist/antd.css";
import "antd/dist/antd.less"
import "./assets/css/main.css"
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducer";
// import reportWebVitals from './reportWebVitals';
const CustomTitleBar = window.require("custom-electron-titlebar");

const titleBar = new CustomTitleBar.Titlebar({
  backgroundColor: CustomTitleBar.Color.fromHex("#478bff"),
})
titleBar.updateTitle("Voized")

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(reducers)}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
