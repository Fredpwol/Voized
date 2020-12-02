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
      }
    });
});

io.on("call:cutted", () => {
  const state = store.getState();
  state.callData.peer.destroy();
  store.dispatch({ type: SET_PEER, payload: null });
  store.dispatch({ type: SET_OFFER, payload: null });
  store.dispatch({ type: STOP_RINGING });
  store.dispatch({type: SET_CALL_STATUS, payload:false})
  store.dispatch({ type: CLEAR_RECIPIENT });
});

io.on("unAvaiblable", (data) => {
  setTimeout(() => {
    store.dispatch({ type: SET_PEER, payload: null });
    store.dispatch({ type: SET_OFFER, payload: null });
    store.dispatch({ type: STOP_RINGING });
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
    peer.signal(state.callData.offer.offer);
    peer.on("stream", (stream) => {
      player.srcObject = stream;
    });
    player.play();
    store.dispatch({ type: STOP_RINGING });
    store.dispatch({type: SET_CALL_STATUS, payload:true})
    io.on("callended", () => {
      peer.destroy();
      store.dispatch({ type: SET_PEER, payload: null });
      store.dispatch({ type: SET_OFFER, payload: null });
      store.dispatch({ type: STOP_RINGING });
      store.dispatch({type: SET_CALL_STATUS, payload:false})
      store.dispatch({ type: CLEAR_RECIPIENT });
    });
  });
}

export function rejectOffer() {
  const state = store.getState();
  io.emit("offer:regected", { to: state.callData.offer.from });
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

                    peer.on("error", (e) => console.log(e))
                    peer.on("signal", (data) => {
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
                    store.dispatch({ type: SET_PEER, payload: peer });

                    io.on("answer:made", (data) => {
                      console.log("Answer", data);
                      store.dispatch({ type: STOP_RINGING });
                      store.dispatch({type: SET_CALL_STATUS, payload:true})
                      peer.signal(data.answer);
                      peer.on("stream", (stream) => {
                        player.srcObject = stream;
                      });
                      player.play();
                    });
                    io.on("callended", () => {
                      peer.destroy();
                      store.dispatch({ type: SET_PEER, payload: null });
                      store.dispatch({ type: SET_OFFER, payload: null });
                      store.dispatch({ type: STOP_RINGING });
                      store.dispatch({type: SET_CALL_STATUS, payload:false})
                      store.dispatch({ type: CLEAR_RECIPIENT });
                    });
                    io.on("regected", () => {
                      peer.destroy();
                      store.dispatch({ type: SET_PEER, payload: null });
                      store.dispatch({ type: SET_OFFER, payload: null });
                      store.dispatch({ type: STOP_RINGING });
                      store.dispatch({ type: CLEAR_RECIPIENT });
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

export function stopCall() {
  const state = store.getState();
  console.log("cutted!!");
  state.callData.peer.destroy();
  io.emit("call:cutted", { to: state.callData.offer.to });
  store.dispatch({ type: SET_OFFER, payload: null });
  store.dispatch({ type: SET_PEER, payload: null });
  store.dispatch({ type: STOP_RINGING });
  store.dispatch({type: SET_CALL_STATUS, payload:false})
  store.dispatch({ type: CLEAR_RECIPIENT });
}
