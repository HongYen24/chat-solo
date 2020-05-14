var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://userList1:HaeHyuk9813@dbms-awk1y.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./database/chat.js');

app.use(express.static("public"));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views","./views");

app.get('/', function(req, res){
   res.render('chat');
})

var chatModel = mongoose.model('chat');

var users = [];
var uList = [];

io.on("connection", function(socket){
   users.push(socket.id);
   console.log("User connected: ", users.length);

   socket.on("disconnect", function(data){
       var index = users.indexOf(socket.id);
       users.splice(index, 1);
       console.log("User connected: ", users.length);
   })

   socket.on("login", function(data){
      var found = uList.find(user => user === data.user);
      
      if(found === data.user) {
         socket.emit("userExists", data);
      } else {
         uList.push(data.user);
         socket.emit("setUsername", data);
         console.log(uList);
      }
   })

   socket.on("send", function(data){
      var ruser = uList.findIndex(user => user === data.rname);
      io.to(users[ruser]).emit("msg", data); 
      socket.emit("msg", data);
   })
})

server.listen(3000, function () {
   console.log('run');
});

//const PORT = process.env.PORT || 3000;
 
//server.listen(PORT, function () {  console.log('Server runs.'); });
