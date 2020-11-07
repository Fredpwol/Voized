/* eslint-disable import/no-anonymous-default-export */
import { NEW_REGISTER } from "../actions/constants";

const initialState = { newRegister: false}

export default function (state = initialState, action){
    switch (action.type){
        case NEW_REGISTER:
            return {
                ...state,
                newRegister: !state.newRegister
            }
        default:
            return state
    }
}