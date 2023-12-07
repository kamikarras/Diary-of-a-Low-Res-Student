const { createServer } = require('http');
const { Server } = require('socket.io');

// express is not used as Vercel Edge Functions are not traditional web servers

const server = createServer();
const socketServer = new Server(server);

let users = [];

module.exports = (req, res) => {
  // Vercel Edge Functions entry point

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send('OK');
    return;
  }

  // Handle the Socket.IO connection
  socketServer.on('connect', (socket) => {
    console.log('client has connected via socket: ' + socket.id);

    socket.on('name', (data) => {
      users.push({ id: socket.id, name: data.name, feeling: data.feeling });
      console.log(users);
    });
  });

  // Your other routes and logic can go here

  // Handle all other routes with a 404 response
  res.status(404).send('Not Found');

};