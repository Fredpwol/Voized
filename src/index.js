import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import { blue } from "@ant-design/colors"
import "antd/dist/antd.css";
import "antd/dist/antd.less"
import "./assets/css/main.css"
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import reducers from "./reducer";
// import reportWebVitals from './reportWebVitals';
const CustomTitleBar = window.require("custom-electron-titlebar");

// const { Menu, MenuItem } = window.require("electron");
const menu = [];
const titleBar = new CustomTitleBar.Titlebar({
  backgroundColor: CustomTitleBar.Color.fromHex(blue.primary),
  menu:null
})
titleBar.updateTitle("Voized")
ReactDOM.render(
    <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk) )}>
      <Router>
        <App />
      </Router>
    </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
