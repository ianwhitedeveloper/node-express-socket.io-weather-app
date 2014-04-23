/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , app = express()
  , mongoose = require('mongoose')
  , port = process.env.PORT || 3000;


  var server = http.createServer(app);
  server.listen(port);
  console.log('http server listening on %d', port);

  var io = require('socket.io').listen(server); // this tells socket.io to use our express server

  var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/weather';

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
  mongoose.connect(uristring, function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('Connected to mongodb!');
    }
  });
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongoose.connect(uristring, function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('Connected to mongodb!');
    }
  });
});

app.get('/', routes.index);

//=======================================================================//
//                      mongoose schema and model info                   //
//=======================================================================//


// mongoose Schema for comments
var commentSchema = mongoose.Schema({
  cityname: String,
  comment: String,
  created: { type: Date, default: Date.now }
});


// mongoose model for comment
var Comment = mongoose.model('Comment', commentSchema);

//=======================================================================//
//                        End mongoose schema and model info             //
//=======================================================================//

//=======================================================================//
//                        Socket.io stuff                                //
//=======================================================================//

io.sockets.on('connection', function (socket) {
    console.log('A new user connected!');

    socket.on('send city name', function(data, callback) {
      callback(true);

        // data (city name) passed to server from client
        // and store it in socket session variable for ease
        // of reuse
        socket.city = data;

        // find and return comments from Mongodb only for specified city
        Comment.find({ cityname: socket.city }, function(err, docs) {
          if (err) throw err;
          console.log("retrieving city comments");
          console.log(docs);

          // pass docs (comment objects) to client to be rendered on dom
          socket.emit('load comments for city', docs);
        });
    });

    socket.on('create comment', function(data) {
      var saveComment = new Comment({ cityname: socket.city, comment: data });
      // save comment to db with error logging
      saveComment.save(function(err) {
        if (err) throw err;
        io.sockets.emit('new comment', { cityname: socket.city, comment: data });
      });
    });
});
