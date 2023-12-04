
let express = require('express')
let app = express()

let users = []

app.use('/', express.static('public'))

let http = require("http");
let server = http.createServer(app);

let port = process.env.PORT || 3000;
server.listen(port, ()=> {
console.log('listening at ', port);
});

let io = require('socket.io');
io = new io.Server(server);

io.on('connect', (socket) => {
    socket.on('name', data=>{
        users.push({'id':socket.id, 'name':data.name,'feeling':data.feeling})
        console.log(users)
    })

    console.log('socket connected : ' + socket.id);})
