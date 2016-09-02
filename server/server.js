var os = require('os');
var ifaces = os.networkInterfaces();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt')  
var client = mqtt.connect('mqtt://broker.hivemq.com')

var hostname, port = 3000;


app.get('/', function(req, res){
  res.sendfile('index.html');
});

client.on('connect', () => {  

  io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('message', function(msg){
    console.log('message: ' + msg);
    //socket
    io.emit('message', msg);
    //mqtt
    client.publish('notifacation', msg);

  });
});
  
})



Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      // console.log(iface.address);
    	hostname = iface.address;
    }
    ++alias;
  });
});


http.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});