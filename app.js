const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const user = {};

app.use('/static', express.static('static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/view/:name', function(req, res){
  res.sendFile(__dirname + '/view/' + req.params.name);
}); 

io.on('connection', function(socket){
  console.log('user ' + socket.id + 'connected');
  if(!user[socket.id]){
    user[socket.id] = {};
    socket.emit('init', socket.id);
  }
  socket.on('disconnect', function(){
    console.log('user ' + socket.id + ' disconnected');
    delete user[socket.id]
  });
  socket.on('user position', function(msg){
    user[socket.id] = msg;
    socket.broadcast.emit('update user position', user);
  });
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});