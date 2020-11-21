import { RINGING, SET_OFFER, STOP_RINGING, SET_ANSWER, CLEAR_RECIPIENT, SET_PEER } from "../actions/constants";

const initialState = {calls: [], onCall: false, ringing: false, peer:{}, timeElapsed: 0, recipient: [], offer: {}, answer:{} }

export default function CallReducer(state=initialState, action){
    switch (action.type){
        case RINGING :
            return { ...state, ringing: true, recipient: [...state.recipient, action.payload] };
        case SET_OFFER:
            return {...state, offer: action.payload}
        case STOP_RINGING:
            return {...state, ringing: false }
        case SET_ANSWER:
            return {...state, answer: action.payload}
        case CLEAR_RECIPIENT:
            return {...state, recipient: {}}
        case SET_PEER:
            return {...state, peer: action.payload}
        default:
            return state;        
    }
}