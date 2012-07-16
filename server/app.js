var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , _ = require("underscore")
    , pg = require('pg');

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

var connectionString = process.env.DATABASE_URL || 'tcp://postgres:axel@localhost/postgres';
var client = new pg.Client(connectionString);
client.connect();

function createMsg (msg, username) {
    return {
        username : username || "SERVER",
        msg : msg,
        timestamp : new Date().getTime()
    };
}

function saveMessage(msg) {
	client.query({
	  name: 'insert message',
	  text: "INSERT INTO messages(msg, username, timestamp) values($1, $2, $3)",
	  values: [msg.msg, msg.username, msg.timestamp]
	});
}

function findMessages(callback) {
	var query = client.query('SELECT * FROM messages');
	var messages = [];
	query.on('row', function(row) {
		messages.push(row);
	});
	query.on('end', function () {
	    callback(messages);
	})
}

var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

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