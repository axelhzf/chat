var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , _ = require("underscore");

var app = express();
var server = http.createServer(app);

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);

var usernames = {};

function createMsg (msg, username) {
    return {
        username : username || "SERVER",
        msg : msg,
        timestamp : new Date().getTime()
    };
}

var redis = require('redis').createClient();

function saveMessage(msg) {
    redis.incr("global:msg:id", function (err, id) {
        redis.hmset("msg:" + id, msg);
        redis.rpush("messages", id);
    });
}

function findMessages(callback) {
    var max = -1;
    redis.lrange("messages", 0, max, function (err, ids) {
        var multi = redis.multi();
        _.each(ids, function (id){
            multi.hgetall("msg:" + id);
        });
        multi.exec(function (err, replies){
            callback(replies);
        });
    });
}


var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

    socket.on('sendchat', function (data) {
        var msg = createMsg(data, socket.username);
        io.sockets.emit('updatechat', msg);
        saveMessage(msg);
    });

    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;

        findMessages(function (messages) {
            socket.emit("initchat", messages);
            socket.emit('updatechat', createMsg('you have connected'));
        });

        socket.broadcast.emit('updatechat', createMsg(username + ' has connected'));
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', createMsg(socket.username + ' has disconnected'));
    });

});

server.listen(app.get('port'));