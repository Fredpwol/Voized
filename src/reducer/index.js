import { combineReducers } from "redux";
import authReducer from "./authReducer";
import appDataReducer from "./appDataReducer";
import userDataReducer from "./userDataReducer";

export default combineReducers({
    auth: authReducer,
    appData: appDataReducer,
    userData: userDataReducer
})