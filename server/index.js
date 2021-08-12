const express = require("express");
const http = require("http");
const socket = require("socket.io");
const router = require("./router");
const { user, setUser } = require("./user");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 5050;
app.use(router)
server.listen(PORT, () => console.log(`Server successfully started on port ${PORT}`));

io.on("connection" , (socket) => {
    console.log("Connection Established")

    socket.on("message", (data) => {
        console.log("Message Received", data.message)
    })
    socket.on("set:user", (data) => {
        setUser(data.id, socket.id)
    })
    socket.on("offer:made", (data) => {
        if(user[data.to]){
            console.log("offer received from "+ data.from)
            io.to(user[data.to]).emit("offer:made", data)
        }
        else{
            socket.emit("unavailable", "Sorry User is not Available")
        }
       
    })
    socket.on("ice-candidate", data => {
        io.to(user[data.to]).emit("ice-candidate", data)
    })
    socket.on("unavailable", data => {
        io.to(user[data.to]).emit("unavailable", data)
    })
    socket.on("call:cutted", data => {
        io.to(user[data.to]).emit("call:cutted")
    })
    socket.on("callended", data => {
        io.to(user[data.to]).emit("callended")
    })
    socket.on("answer", (data) => {
        if (user[data.to]){
            io.to(user[data.to]).emit("answer", data)
        }
        else{
            socket.emit("unavailable", "Sorry User is not Available")
        }
    })
    socket.on("offer:regected", (data) => {
        io.to(user[data.to]).emit("regected")
    })
    socket.on("disconnect", () => {
        console.log("Connnection Lost with user")
    })

})