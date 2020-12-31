import socket from "socket.io-client";
import { store } from "../store";

export const ENDPOINT = "http://localhost:5050";

let iceConfig = {"iceServers" :[ {"urls": "stun:stun.l.google.com:19302"}] };

const peerConnection = new RTCPeerConnection(iceConfig);

export const io = socket(ENDPOINT);

const constraints = { "audio": {"echoCancellation": true}, "video": false};

const player = new Audio();
const mediaStream = new MediaStream();
player.srcObject = mediaStream;

io.on("offer:sent", async (data) => {
    await peerConnection.setRemoteDescription( new RTCSessionDescription(data.offer) );
    const answer = peerConnection.createAnswer();
    io.emit("answer", { answer, to: data.from });
    await peerConnection.setLocalDescription( new RTCSessionDescription(answer));
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach(track => { // records audio stream
        peerConnection.addTrack(track, stream)
    })
    peerConnection.addEventListener("track", (e) => {
        mediaStream.addTrack(e.track, mediaStream) // plays audio stream reieved from remote peer
    })
})

io.on("answer:made", async (data) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
    })
    peerConnection.addEventListener("track", (e) => {
        mediaStream.addTrack(e.track, mediaStream)
    })
} )

export async function createOffer(id, userId){
    const offer = await peerConnection.createOffer();
    io.emit("offer:made", { offer, to: id, from: userId })
    await peerConnection.setLocalDescription( new RTCSessionDescription(offer))
};

export async function stopCall(){
    peerConnection.removeEventListener("track");
    await peerConnection.setRemoteDescription(null);
}
