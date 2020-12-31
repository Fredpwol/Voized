import socket from "socket.io-client";
import { store } from "../store";
import { message } from "antd";
import Peer from "simple-peer";

import {
  CLEAR_RECIPIENT,
  RINGING,
  SET_CALL_ID,
  SET_CALL_STATUS,
  SET_OFFER,
  SET_PEER,
  STOP_RINGING,
} from "../actions/constants";
import { ok } from "../actions";

export const ENDPOINT = "http://localhost:5050";

// let iceConfig = {"iceServers" :[ {"urls": "stun:stun.services.mozilla.com"}] };

// const peerConnection = new RTCPeerConnection(iceConfig);

export const io = socket(ENDPOINT);

const constraints = { audio: true, video: false };

const player = new Audio();

io.on("offer:recieved", (offer) => {
  // when the receiver accepts a call this will be executed on the caller side.
  console.log("offer recievd from client " + offer.from);
  const state = store.getState();
  fetch(`/user/${offer.from}`, {
    headers: new Headers({
      Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === ok) {
        store.dispatch({ type: SET_OFFER, payload: offer });
        store.dispatch({ type: RINGING, payload: data.user });
        store.dispatch({ type: SET_CALL_ID, payload: offer.callID})
      }
    });
});

io.on("call:cutted", () => {
  /**
   * This is called when the call is cutted by the other party.
   */
  const state = store.getState();
  state.callData.peer.removeAllListeners()
  store.dispatch({ type: SET_PEER, payload: null });
  store.dispatch({ type: SET_OFFER, payload: null });
  store.dispatch({ type: STOP_RINGING });
  store.dispatch({type: SET_CALL_STATUS, payload:false})
  store.dispatch({ type: CLEAR_RECIPIENT });
  fetch(`call/${state.callData.callId}/set?status=missed`, {
    method:"PUT",
    headers : new Headers({
    "Authorization": "Basic " + btoa(`${state.auth.token}:no-password`)
  }),} )
  store.dispatch({type: SET_CALL_ID, payload:null})
});

io.on("regected", () => {
    store.dispatch({ type: SET_PEER, payload: null });
    store.dispatch({ type: SET_OFFER, payload: null });
    store.dispatch({ type: STOP_RINGING });
    store.dispatch({ type: CLEAR_RECIPIENT });
  });

io.on("unAvaiblable", (data) => {
  setTimeout(() => {
    store.dispatch({ type: SET_PEER, payload: null });
    store.dispatch({ type: SET_OFFER, payload: null });
    store.dispatch({ type: STOP_RINGING });
    store.dispatch({type: SET_CALL_ID, payload:null})
  }, 2000);
  message.error(data, 3);
});

export function createAnswer() {
  const state = store.getState();
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    store.dispatch({ type: SET_PEER, payload: peer });
    peer.on("signal", (data) => {
      io.emit("answer", { answer: data, to: state.callData.offer.from });
    });
    fetch(`call/${state.callData.callId}/set?status=recieved`, {
      method:"PUT", 
      headers : new Headers({
      "Authorization": "Basic " + btoa(`${state.auth.token}:no-password`)
    }),})
    peer.signal(state.callData.offer.offer);
    peer.on("stream", (stream) => {
      player.srcObject = stream;
    });
    player.play();
    store.dispatch({ type: STOP_RINGING });
    store.dispatch({type: SET_CALL_STATUS, payload:true})
    io.on("callended", () =>{
      const state = store.getState();
      state.callData.peer.destroy();
      store.dispatch({ type: SET_PEER, payload: null });
      store.dispatch({ type: SET_OFFER, payload: null });
      store.dispatch({ type: STOP_RINGING });
      store.dispatch({type: SET_CALL_STATUS, payload:false})
      store.dispatch({ type: CLEAR_RECIPIENT });
      store.dispatch({type: SET_CALL_ID, payload:null})
    });
  });
}

export function rejectOffer() {
  const state = store.getState();
  io.emit("offer:regected", {  to: state.auth.id === state.callData.offer.from ? state.callData.offer.to : state.callData.offer.from });
  store.dispatch({ type: SET_PEER, payload: null });
  store.dispatch({ type: SET_OFFER, payload: null });
  store.dispatch({ type: STOP_RINGING });
}

export function createOffer(id, userId, callback) {
  const state = store.getState();
  try {
    fetch(`/call/new/${userId}/${id}`, {
      headers: new Headers({
        Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
      }),
    })
      .then((res) => res.json())
      .then((call) => {
        if (call.status === ok) {
          store.dispatch({type: SET_CALL_ID, payload: call.id})
          fetch(`/user/${id}`, {
            headers: new Headers({
              Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
            }),
          })
            .then((res) => res.json())
            .then((userData) => {
              if (userData.status === ok) {
                navigator.mediaDevices
                  .getUserMedia(constraints)
                  .then((stream) => {
                    const peer = new Peer({
                      initiator: true,
                      trickle: false,
                      stream,
                    });
                    store.dispatch({ type: SET_PEER, payload: peer });
                    peer.on("error", (e) => console.log(e))
                    peer.on("signal", (data) => {
                      if (data.renegotiate || data.transceiverRequest) return
                      let offerData = {
                        offer: data,
                        to: id,
                        from: userId,
                        callID: call.id,
                      };
                      io.emit("offer:made", offerData);
                      store.dispatch({ type: SET_OFFER, payload: offerData });
                      store.dispatch({ type: RINGING, payload: userData.user });
                    });

                    io.on("answer:made", (data) => {
                      const state = store.getState()
                      console.log("Answer", data);
                      store.dispatch({ type: STOP_RINGING });
                      store.dispatch({type: SET_CALL_STATUS, payload:true})
                      state.callData.peer.signal(data.answer);
                      state.callData.peer.on("stream", (stream) => {
                        player.srcObject = stream;
                      });
                      player.play();
                    });

                    io.on("callended", () => {
                      const state = store.getState();
                      state.callData.peer.destroy();
                      store.dispatch({ type: SET_PEER, payload: null });
                      store.dispatch({ type: SET_OFFER, payload: null });
                      store.dispatch({ type: STOP_RINGING });
                      store.dispatch({type: SET_CALL_STATUS, payload:false})
                      store.dispatch({ type: CLEAR_RECIPIENT });
                      store.dispatch({type: SET_CALL_ID, payload:null})
                    });
                  });
              } else {
                callback(userData.message);
                return;
              }
            });
        }
      });
  } catch (e) {
    if (callback) callback(e.message);
  }
}

export function stopCall(duration, ended) {
  // If any of the party stops the call this will be executed and a websocket event will be emmited to notify the change.
  const state = store.getState();
  console.log("cutted!!");
  fetch(`/call/${state.callData.callId}/set?duration=${duration}&ended=${ended}`, {
    method:"PUT", 
    headers : new Headers({
    "Authorization": "Basic " + btoa(`${state.auth.token}:no-password`)
  }),}).then((res) => {
    state.callData.peer.destroy();
    io.emit("callended", { to: state.auth.id === state.callData.offer.from ? state.callData.offer.to : state.callData.offer.from });
    store.dispatch({ type: SET_OFFER, payload: null });
    store.dispatch({ type: SET_PEER, payload: null });
    store.dispatch({ type: STOP_RINGING });
    store.dispatch({type: SET_CALL_STATUS, payload:false})
    store.dispatch({ type: CLEAR_RECIPIENT });
    return res.json()
  }).then(data => console.log(data))
}
