var os = require('os');
var ifaces = os.networkInterfaces();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt')  
var client = mqtt.connect('mqtt://broker.hivemq.com')

var hostname;

var SerialPort = require("serialport");

var port = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});


function processData(str) {

  if(str.length >= 16) {
    var len = str.length - 1;
    var size = Math.sqrt(str.length - 1);
    var x = new Array();
    for (var i = 0; i < size; i++) {
      x[i] = new Array(size);
    }

    for (var i = 0; i < len; i++) {
      x[~~(i / size)][i % size] = parseInt(str[i]);
    }
    // console.log(x);
  }
  
}

port.on('data', function (data) {
  // console.log(data.length)
  processData(data.toString());
});

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
    client.publish('notification', msg);

  });
});
  
})


http.listen(3000, () => {
  console.log(`Server running at http://${hostname}:3000/`);
});
