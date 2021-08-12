import socket from "socket.io-client";
import { store } from "../store";
import { message } from "antd";
// import Peer from "simple-peer";
import { API_ENDPOINT, checkStatus } from "./index";
import {
  CLEAR_RECIPIENT,
  RINGING,
  SET_CALL_ID,
  SET_CALL_STATUS,
  SET_OFFER,
  SET_PEER,
  SET_ICE_CANDIDATE,
  SET_TRACKS,
  STOP_RINGING,
} from "../actions/constants";

export const ENDPOINT = "http://localhost:5050";

let iceConfig ={
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

// const peerConnection = new RTCPeerConnection(iceConfig);

export const io = socket(ENDPOINT);

const constraints = { audio: true, video: false };

const player = new Audio();
const audioStream = new MediaStream();
player.srcObject = audioStream;

/**
 * offer:recieved
 * call:cutted
 * regected
 * unAvailable
 * func => createAnswer
 * func => regectOffer
 * func => acceptOffer
 * func => endCall
 */

io.on("answer", (data) => {
  const state = store.getState();
  store.dispatch({ type: STOP_RINGING });
  store.dispatch({ type: SET_CALL_STATUS, payload: true });
  state.callData.peer.setRemoteDescription(new RTCSessionDescription(data.answer));
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => state.callData.peer.addTrack(track, stream) )
  });
  player.play();
});

io.on("ice-candidate", (data) => {
  const state = store.getState();
  console.log("ice candidate recieved")
  if (Boolean(state.callData.peer)){
    state.callData.peer
    .addIceCandidate(new RTCIceCandidate(data.candidate))
    .catch((e) => console.error(e));
  }
  else{
    store.dispatch({type: SET_ICE_CANDIDATE, payload: data.candidate})
  }
});

io.on("offer:made", (data) => {
  const state = store.getState();
  if (Boolean(state.callData.peer)) { // checks if the user is on another call by checking the peer state
    console.log("unavailable")
    io.emit("unavailable", { to: data.from });
    return;
  }
  const { username, bgColor, profileImage, callId } = data.callerData;
  store.dispatch({ type: SET_OFFER, payload: data.offer });
  store.dispatch({type: SET_CALL_ID, payload: callId})
  store.dispatch({
    type: RINGING,
    payload: {
      id: data.from,
      username,
      bg_color: bgColor,
      profile_pic: profileImage,
    },
  });
});


io.on("unavailable", (data) => {
  console.log("user not available")
  setTimeout(() => {
    store.dispatch({ type: SET_PEER, payload: null });
    store.dispatch({ type: SET_OFFER, payload: null });
    store.dispatch({ type: STOP_RINGING });
    store.dispatch({type: SET_CALL_ID, payload:null})
  }, 2000);
  message.error("User is not Available", "error" );
});


io.on("callended", () => {
  const state = store.getState();
  state.callData.peer.close();
  audioStream.removeTrack();
  state.callData.track.stop();
  store.dispatch({ type: SET_PEER, payload: null });
  store.dispatch({ type: SET_OFFER, payload: null });
  store.dispatch({ type: STOP_RINGING });
  store.dispatch({ type: SET_CALL_STATUS, payload: false });
  store.dispatch({ type: CLEAR_RECIPIENT });
  store.dispatch({ type: SET_CALL_ID, payload: null });
  store.dispatch({type: SET_TRACKS, payload: []});
});

export function createOffer(id, userID, callback) {
  try {
    var state = store.getState();
    fetch(`${API_ENDPOINT}/call/new/${userID}/${id}`, {
      headers: new Headers({
        Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
      }),
    })
      .then((res) => res.json())
      .then(function (callStatus) {
        if (!checkStatus(callStatus, callback)) return;
        fetch(`${API_ENDPOINT}/user/${id}`, {
          headers: new Headers({
            Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
          }),
        })
          .then((res) => res.json())
          .then(function (userData) {
            if (!checkStatus(userData, callback)) return;
            const peer = new RTCPeerConnection(iceConfig);
            peer.onicecandidate = function (e) {
              console.log("ice candidate created", e.candidate)
              e.candidate && io.emit("ice-candidate", { to: id, candidate: e.candidate });
            };
            peer.ontrack = (e) => {
              console.log("sender peer tracks", e.track)
              store.dispatch({type: SET_TRACKS, payload: e.track});
              audioStream.addTrack(e.track);
            };
            peer.addTransceiver("audio")
            store.dispatch({ type: SET_PEER, payload: peer });
            var state = store.getState();
            peer.createOffer().then((sdp) => {
              peer.setLocalDescription(new RTCSessionDescription(sdp))
              console.log(state.callData, "call data")
              io.emit("offer:made", {
                to: id,
                from: userID,
                offer: sdp,
                callerData: {
                  username: state.auth.username,
                  bgColor: state.auth.userBgColor,
                  profileImage: state.auth.profileImage,
                  callId:callStatus.id
                },
              });
            });
            store.dispatch({ type: RINGING, payload: userData.user });
          })
          .catch((error) => callback(error));
      });
  } catch (error) {
    callback(error);
  }
}

export function rejectOffer() {
  const state = store.getState();
  io.emit("offer:regected", {
    to:
      state.auth.id === state.callData.offer.from
        ? state.callData.offer.to
        : state.callData.offer.from,
  });
  store.dispatch({ type: SET_PEER, payload: null });
  store.dispatch({ type: SET_OFFER, payload: null });
  store.dispatch({ type: STOP_RINGING });
}

export function createAnswer() {
  const state = store.getState();
  const peer = new RTCPeerConnection(iceConfig);
  store.dispatch({ type: SET_PEER, payload: peer });
  // peer.onicecandidate = (e) => {
  //   console.log("ice candidate created", e.candidate)
  //   io.emit("ice-candidate", { to: state.callData.recipient[0].id, candidate: e.candidate });
  // };
  if (state.callData.iceCandidate){
    console.log("stored candidate", state.callData.iceCandidate)
    peer.addIceCandidate(new RTCIceCandidate(state.callData.iceCandidate))
  }
  peer.setRemoteDescription(new RTCSessionDescription(state.callData.offer)).then(() => {
    peer.createAnswer().then((sdp) => {
      const answer = new RTCSessionDescription(sdp);
      peer.setLocalDescription(answer).then(() => {
        console.log("remote", peer.currentRemoteDescription)
        console.log("local", peer.currentLocalDescription)
      });
      io.emit("answer", { from: state.auth.id, to: state.callData.recipient[0].id, answer });
    });
  });
  store.dispatch({ type: STOP_RINGING });
  store.dispatch({type: SET_CALL_STATUS, payload:true})
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    fetch(`${API_ENDPOINT}/call/${state.callData.callId}/set?status=recieved`, {
      method: "PUT",
      headers: new Headers({
        Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
      }),
    });
    const tracks = stream.getTracks();
    tracks.forEach((track) => peer.addTrack(track, stream))// send tracks to the other user
  });

  player.play();
  peer.ontrack = (e) => {
    console.log("receiver peer tracks", e.track)
    store.dispatch({type: SET_TRACKS, payload: e.track})
    audioStream.addTrack(e.track);
  };
}

export function stopCall(duration, ended) {
  // If any of the party stops the call this will be executed and a websocket event will be emmited to notify the change.
  const state = store.getState();
  console.log("cutted!!");
  fetch(
    `${API_ENDPOINT}/call/${state.callData.callId}/set?duration=${duration}&ended=${ended}`,
    {
      method: "PUT",
      headers: new Headers({
        Authorization: "Basic " + btoa(`${state.auth.token}:no-password`),
      }),
    }
  )
    .then((res) => {
      state.callData.peer.close();
      console.log(state.callData.tracks, "tracks")
      audioStream.removeTrack(state.callData.tracks);
      state.callData.tracks.stop();
      io.emit("callended", {
        to: state.callData.recipient[0].id,
      });
      store.dispatch({type: SET_TRACKS, payload: []});
      store.dispatch({ type: SET_OFFER, payload: null });
      store.dispatch({ type: SET_PEER, payload: null });
      store.dispatch({ type: STOP_RINGING });
      store.dispatch({type: SET_ICE_CANDIDATE, payload: null})
      store.dispatch({ type: SET_CALL_STATUS, payload: false });
      store.dispatch({ type: CLEAR_RECIPIENT });
      return res.json();
    })
    .then((data) => console.log(data));
}
