import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import reducers from "./reducer"

export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));