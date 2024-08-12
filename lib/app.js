let express = require("express");
let http = require("http");
let io = require("socket.io");
let cors = require("cors");
let initDatabase = require("./db");
const { time } = require("console");

// Database
let db;
(async () => {
   db = await initDatabase();

  // code goes here
})();
// express
let app = express();
app.use(
  cors({
    origin: ['https://diary-of-a-low-res-student.vercel.app', true],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = http.createServer(app);

// Socket
io = new io.Server(server, {
  cors: {
    origin: ['https://diary-of-a-low-res-student.vercel.app', true],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

let users = [];
let flowers={}



io.on("connection", (socket) => {
  console.log("we have a new client connected");

  socket.on("user", (data) => {
    let user = {
      id: socket.id,
      position: data.position,
      name: data.name,
      feeling: data.feeling,
      keys: data.keys,
      shift: data.shift,
    };
    users.push(user);
    db.push('userData', {
      id: socket.id,
      name: data.name,
      feeling: data.feeling,
      time: Date()
    })
  });

  socket.on("data", (data) => {
    users.forEach((user) => {
      if (user.id == data.id) {
        user.position = data.position;
        user.keys = data.keys;
        user.shift = data.shift;
      }
    });

    io.emit("usersAll", users);
  });
const getFlowers = ()=>{
  db.get('flowerPositions').then(positionsData=>{ 
    flowers.positions = positionsData
    console.log(positionsData)
    db.get('flowerColors').then(colorsData=>{
      flowers.colors = colorsData
      io.emit('allFlowers',flowers)
    })
  })
    

}
  socket.on('plantFlower',object=>{
    db.push('flowerPositions',[object.position.x,0.2,object.position.z])
    db.push('flowerColors',[object.r,object.g,object.b])
    db.push('flowerData', {
      user: object.name,
      feeling: object.feeling,
      color: [object.r,object.g,object.b],
      position: object.position,
      time: Date()
    })
    setTimeout(()=>{

      getFlowers()
    },100)
    
});

socket.on('getFlowers', ()=>{
  console.log('reach for flowers')
  getFlowers()
 
})

  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == socket.id) {
        users.splice(i, 1);
      }
    }
    io.emit("remove", socket.id);
    console.log("disconneted " + socket.id);
  });
});

module.exports = server;
