import { RINGING, SET_OFFER, STOP_RINGING, SET_ANSWER, CLEAR_RECIPIENT, SET_PEER, SET_CALL_STATUS, SET_CALL_ID, SET_CALLS, LOGOUT_USER } from "../actions/constants";

const initialState = {calls: [], onCall: false, ringing: false, peer:{}, timeElapsed: 0, recipient: [], offer: {}, answer:{}, callId:null }

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
        case SET_CALL_STATUS:
            return {...state, onCall: action.payload}
        case SET_CALL_ID:
            return { ...state, callId: action.payload}
        case SET_CALLS:
            return {...state, calls: action.payload }
        case LOGOUT_USER:
            return initialState;
        default:
            return state;        
    }
}