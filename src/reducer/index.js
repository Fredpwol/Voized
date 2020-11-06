import { combineReducers } from "redux";
import authReducer from "./authReducer";
import appDataReducer from "./appDataReducer";

export default combineReducers({
    auth: authReducer,
    appData: appDataReducer
})