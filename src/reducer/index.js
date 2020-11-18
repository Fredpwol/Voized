import { combineReducers } from "redux";
import authReducer from "./authReducer";
import appDataReducer from "./appDataReducer";
import userDataReducer from "./userDataReducer";
import CallReducer from "./callReducer";

export default combineReducers({
    auth: authReducer,
    appData: appDataReducer,
    userData: userDataReducer,
    callData: CallReducer
})