const express = require ('express');
const app = express();
users = [];
connections =[];

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

server = app.listen(3000);

const io = require("socket.io")(server);

io.on('connection', (socket)=> {
  console.log('New user connected');

  //socket.username = "Anonymous";


  socket.on('new_message', (data)=> {
    io.sockets.emit('new_message', {message : data.message, username : socket.username});
  });

  socket.on('typing', (data)=> {
    socket.broadcast.emit('typing', {username : socket.username});
  });

  connections.push(socket);
  console.log('Connected : %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function(data) {
      users.splice(users.indexOf(socket.username),1);
      updateUsernames();
      connections.splice(connections.indexOf(socket),1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });

    //New user
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

});

