/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongoose = require('mongoose');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server); // this tells socket.io to use our express server
var cities = [];

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/weather', function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('Connected to mongodb!');
    }
  });
});

var commentSchema = mongoose.Schema({
  cityname: String,
  comment: String,
  created: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', commentSchema);

app.get('/', routes.index);


console.log("Express server listening on port 3000");

io.sockets.on('connection', function (socket) {
    console.log('A new user connected!');

    socket.on('send city name', function(data, callback) {
      callback(true);
        socket.city = data;
        cities.push(socket.city)
        Comment.find({ cityname: socket.city }, function(err, docs) {
          if (err) throw err;
          console.log("retrieving city comments");
          console.log(docs);
          socket.emit('load comments for city', docs);
        });
    });

    socket.on('create comment', function(data) {
      var saveComment = new Comment({ cityname: socket.city, comment: data });
      saveComment.save(function(err) {
        if (err) throw err;
        io.sockets.emit('new comment', { cityname: socket.city, comment: data });
      });
    });
});
