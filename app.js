var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set("ipaddr","127.0.0.1");
app.set("port",3000);

app.use('/', routes);
app.use('/users', users);
app.use('/chat',chat);

http.listen(app.get('port'), function(){
	console.log("Express server listening on port"+app.get('port'));
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.broadcast.emit('hi');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
	socket.on('chat message', function(msg){
		console.log('message '+app.get('port'));
		io.emit('chat message', msg);
	});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
//http://www.tutorialbook.co.kr/entry/NodeJS-Express-%EC%99%80-Socketio-%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%EC%B1%84%ED%8C%85-%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0
