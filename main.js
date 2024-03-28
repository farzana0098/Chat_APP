var express = require('express');
var http = require('http');
var socketIO = require('socket.io');
var app = express();
var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(__dirname + "/public"));

app.get('/', (rq, res) => {
    res.sendFile(__dirname + "/public/chat.html");
})

io.on('connection', function (socket) {

    socket.on('newuser', function (user) {
        socket.username = user;

        socket.emit('connection.success', ResponseMessage("Server", "hello " + socket.username + ", successfully connected"));

        socket.broadcast.emit('connection.others', ResponseMessage("Server", socket.username + " has connected"));

    })

    socket.on('send', function (msg) {

        io.emit("SendClient", ResponseMessage(socket.username, msg));
    });
   


    socket.on('disconnect', function () {

        socket.broadcast.emit("connection.others", ResponseMessage("Server", socket.username + " has left!"));
    });

});


function ResponseMessage(u, msg) {
    return { UserName: u, Message: msg };
}

//io.on('connection',  (socket) => {


//});


server.listen(8899);
console.log('app started');