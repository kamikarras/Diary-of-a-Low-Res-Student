let express = require("express");
let http = require("http");
let io = require("socket.io");
let cors = require("cors");

// express
let app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = http.createServer(app);

// Socket
const socketServer = new io.Server(server, {
  cors: {
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

let users = [];

socketServer.on("connect", (socket) => {
  console.log("client has connected via socket : " + socket.id);

  socket.on("name", (data) => {
    users.push({ id: socket.id, name: data.name, feeling: data.feeling });
    console.log(users);
  });
});

module.exports = server;
