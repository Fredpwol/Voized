import {
  RINGING,
  SET_STREAM,
  SET_OFFER,
  STOP_RINGING,
  SET_ANSWER,
  CLEAR_RECIPIENT,
  SET_PEER,
  SET_CALL_STATUS,
  SET_CALL_ID,
  SET_CALLS,
  LOGOUT_USER,
  SET_TRACKS,
  SET_ICE_CANDIDATE,
} from "../actions/constants";

const initialState = {
  calls: [],
  onCall: false,
  ringing: false,
  peer: null,
  timeElapsed: 0,
  recipient: [],
  offer: {},
  answer: {},
  callId: null,
  stream: null,
  tracks: [],
  iceCandidate: null
};

export default function CallReducer(state = initialState, action) {
  switch (action.type) {
    case RINGING:
      return {
        ...state,
        ringing: true,
        recipient: [...state.recipient, action.payload],
      };
    case SET_OFFER:
      return { ...state, offer: action.payload };
    case STOP_RINGING:
      return { ...state, ringing: false };
    case SET_ICE_CANDIDATE:
      return {...state, iceCandidate: action.payload}
    case SET_ANSWER:
      return { ...state, answer: action.payload };
    case CLEAR_RECIPIENT:
      return { ...state, recipient: [] };
    case SET_TRACKS:
      return { ...state, tracks: action.payload };
    case SET_PEER:
      return { ...state, peer: action.payload };
    case SET_CALL_STATUS:
      return { ...state, onCall: action.payload };
    case SET_CALL_ID:
      return { ...state, callId: action.payload };
    case SET_STREAM:
      return { ...state, stream: action.payload };
    case SET_CALLS:
      return { ...state, calls: action.payload };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
