
const user = {};

function setUser(id, socketId){
    user[id] = socketId;
}

module.exports = { user, setUser }