var express = require('express');
var app = express();

app.use(express.static("public"));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views","./views");

app.get("/", function(req, res){
    res.render("home");
})

var http = require('http').createServer(app);
var io = require('socket.io')(http);

users = [];
io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('setUsername', function(data) {
       console.log(data);
       
       if(users.indexOf(data) > -1) {
          socket.emit('userExists', data + ' username is taken! Try some other username.');
       } else {
          users.push(data);
          socket.emit('userSet', {username: data});
       }
    });
    
    socket.on('msg', function(data) {
       //Send message to everyone
       io.sockets.emit('newmsg', data);
    })
 });
 
http.listen(3000, function () {
    console.log('run');
});
