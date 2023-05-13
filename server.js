var express = require('express');
var socket = require('socket.io');

var app = express();

const port = process.env.PORT || 3000
var server = app.listen(port);

app.use(express.static('public'));

console.log("socket server is running");

var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection' + socket.id);

  socket.on('msg',newMessage);

  function newMessage(data){
    console.log(data);
    io.sockets.emit('msg', data);
  }
}
