
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
//  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
//io.sockets.on('connection', require('./routes/socket'));

io.sockets.on("connection", function(socket){

    var room = "";

    socket.on("join:room", function (data) {
        room = data.room;
        console.log("JOIN ROOM " + room);
        socket.join(room);

        //TODO: if new room, broadcast to all users, update room list
        io.sockets.sockets[socket.id].get('nickname', function(err, nickname) {
            io.sockets.in(room).emit("userJoined", socket.id);
        });
    });

    socket.on("set:nickname", function(data) {
        console.log("SET NICKNAME: " + data.nickname);
        socket.set('nickname', data.nickname, function () {
            socket.emit("nicknameSet");
        });
    })

    socket.on("send:message", function (data) {
        console.log("client send message: " + data.message);
        io.sockets.in(room).emit('newMessage', data);
    });

    socket.on("send:worldBroadcast", function(data){
        console.log("client send world broadcast: " + data.message);
        socket.broadcast.emit("newWorldBroadcast", data);
    })

    socket.on("list:allRooms", function(data){
        console.log("get request for list all room");
        socket.emit("allRooms", io.sockets.manager.rooms);
        console.log(io.sockets.manager.rooms);
    })

    socket.on("list:allUsersInRoom", function(data){
        console.log("get request for list user in room");
        var clients = [];

        for(var i=0; i<io.sockets.clients(data.room).length; i++) {
            var objClient = {
                id : "",
                nickname: ""
            };
            objClient.id = io.sockets.clients(data.room)[i].id;
            io.sockets.sockets[objClient.id].get('nickname', function(err, nickname) {
                objClient.nickname = nickname;
                clients.push(objClient);
            });
            console.log(objClient.id);

        }
        console.log(clients);
        socket.emit("allUsersInRoom",clients);
    })

})

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
