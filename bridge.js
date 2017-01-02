var osc = require('node-osc'),
    io = require('socket.io').listen(8081);

var oscServer, oscClient;

var spotify = require('spotify-node-applescript');

io.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.sessionId + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      console.log(msg, rinfo);

      if(msg[0] == "/output_1"){
        spotify.playPause(function(err, state){});
      }
      // else if(msg[0] == "/output_2"){
      //   spotify.previous(function(err, state){});
      // }
      else if(msg[0] == "/output_2"){
        spotify.next(function(err, state){});
      }
      socket.emit("message", msg);
    });
  });
  socket.on("message", function (obj) {
    oscClient.send(obj);
  });
});