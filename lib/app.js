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
io = new io.Server(server, {
  cors: {
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

let users = [];


io.on("connection", (socket)=>{
  console.log("we have a new client connected")
  
  socket.on("user", data=>{
    let user = {id: socket.id, position: data.position, name: data.name, feeling: data.feeling}
    users.push(user)

  })


  socket.on('data', data=>{
      users.forEach(user=>{
          if(user.id==data.id){
              user.position = data.position
              console.log('found')
          }
      })
    console.log(users)
    io.emit('usersAll', users)
  })


  socket.on("disconnect",()=>{
    for(let i=0;i<users.length;i++){
      if(users[i].id == socket.id){
        users.splice(i,1)
      }
    }
  io.emit('remove', socket.id)
    console.log("disconneted " + socket.id)
  })
})




module.exports = server;
