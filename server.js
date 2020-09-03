const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const { statSync } = require("fs");
const { static } = require("express");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const myModule = require("./my-module");
class user {
  constructor(usn) {
    this.name = usn;
  }
}

class room {
  constructor(id) {
    this.userArr = [];
    this.id = id;
  }
  addUser(user) {
    this.userArr.push(user);
  }
  delUser(user) {
    this.userArr.splice(this.userArr.indexOf(user), 1);
  }
}
let roomList = [];
let usn, currentId;
app.use("/peerjs", peerServer);

app.use(express.static("public"));

app.set("view engine", "ejs");

console.log("server is running");

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/:room", (req, res) => {
  res.render("room", { roomID: req.params.room });
});

io.on("connection", socket => {
  socket.on("join-room", (roomID, userID) => {
    socket.join(roomID);
    socket.usn = usn;
    socket.roomID = currentId;
    io.to(roomID).emit("user-join-room", userID);
    socket.on("message", message => {
      io.to(roomID).emit("createMessage", message, socket.usn);
    });
    socket.on("user-leave-room", roomID => {
      socket.leave(roomID);
      let idx = myModule.findRoomIndex(roomList, roomID);
      if (idx != -1) {
        let count = myModule.countUserInRoom(roomList, idx);
        if (count === 1) {
          roomList.splice(roomList[idx], 1);
        } else {
          roomList[idx].delUser(socket.usn);
        }
        socket.to(roomID).broadcast.emit("user-disconnected", userID);
      }
    });
    socket.on("disconnect", () => {
      let idx = myModule.findRoomIndex(roomList, socket.roomID);
      if (idx != -1) {
        let count = myModule.countUserInRoom(roomList, idx);
        if (count === 1) {
          roomList.splice(roomList[idx], 1);
        } else {
          roomList[idx].delUser(socket.usn);
        }
        socket.to(roomID).broadcast.emit("user-disconnected", userID);
      }
    });
  });
  socket.on("user-create-room", name => {
    let id = uuidv4();
    let myRoom = new room(id);
    let myUser = new user(name);
    myRoom.addUser(myUser);
    roomList.push(myRoom);
    usn = name;
    currentId = id;
    socket.emit("send-id", id, name);
  });
  socket.on("new-user-join-room", (roomID, name) => {
    if (myModule.findRoom(roomList, roomID)) {
      let idx = myModule.findRoomIndex(roomList, roomID);
      if (myModule.checkUserName(roomList, idx, name)) {
        let myUser = new user(name);
        roomList[idx].addUser(myUser);
        usn = name;
        currentId = roomID;
        socket.emit("send-id", roomID);
      } else {
        socket.emit("username-taken");
      }
    } else {
      socket.emit("cant-find-room", roomID);
    }
  });
});

server.listen(process.env.PORT || 3000);
