var os = require('os');
var ifaces = os.networkInterfaces();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var mqtt = require('mqtt')  
// var client = mqtt.connect('mqtt://broker.hivemq.com')
var SerialPort = require("serialport");
var events = require('events');

var eventEmitter = new events.EventEmitter();

var hostname;
const initialMatrix = [ [1, 1, 1, 1, 1, 1, 1, 1], 
                        [1, 1, 1, 1, 1, 1, 1, 1], 
                        [0, 0, 0, 0, 0, 0, 0, 0], 
                        [0, 0, 0, 0, 0, 0, 0, 0], 
                        [0, 0, 0, 0, 0, 0, 0, 0], 
                        [0, 0, 0, 0, 0, 0, 0, 0], 
                        [1, 1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1, 1] ];

const initialFEN  = [ ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], 
                      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], 
                      ['1', '1', '1', '1', '1', '1', '1', '1'],
                      ['1', '1', '1', '1', '1', '1', '1', '1'],
                      ['1', '1', '1', '1', '1', '1', '1', '1'],
                      ['1', '1', '1', '1', '1', '1', '1', '1'],
                      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']]; 


var tempMatrix = initialMatrix;
var tempFEN= initialFEN;
var tempPiece, killedPiece;

var port = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

function processData(str) {
  if(str.length >= 64) {
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
    var movingSquare = subMatrix(x, tempMatrix)
    if(movingSquare.length != 0) {
      tempMatrix = x;
      console.log(movingSquare);
      //1
      if(movingSquare.length == 1) {
        var ms = movingSquare[0];
        if(ms.val == -1) {
          if(tempPiece == null) {
            tempPiece = tempFEN[ms.X][ms.Y];
            tempFEN[ms.X][ms.Y] = '1';
          }
          // else {
          //   killedPiece = tempFEN[ms.X][ms.Y];
          // }
          
          
        }
        else {
          tempFEN[ms.X][ms.Y] = tempPiece;
          tempPiece = null;
          eventEmitter.emit('fenChange', matrixToFEN(tempFEN));
        }
      }
      //2
      else if(movingSquare.length == 2)  {
        // 1 and -1
        // var src = movingSquare.filter(function(ms) {
        //   return ms.val == -1;
        // })[0];
        // var des = movingSquare.filter(function(ms) {
        //   return ms.val == 1;
        // })[0];

        var src = movingSquare.find(function(ms) {
          return ms.val == -1;
        })

        var des = movingSquare.find(function(ms) {
          return ms.val == 1;
        })

        // console.log(src, des)
        tempPiece = tempFEN[src.X][src.Y];
        tempFEN[src.X][src.Y] = '1';
        tempFEN[des.X][des.Y] = tempPiece;

        tempPiece = null;
        eventEmitter.emit('fenChange', matrixToFEN(tempFEN));
      }
      else {
        console.log("overflow");
      }
      // console.log(tempFEN)
    }
    else console.log('no diff');

  }
}

function subMatrix(x, tempMatrix) {
  var diff = [];
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      var d = x[i][j] - tempMatrix[i][j];
      if(d != 0) {
         diff[diff.length] = {val: d, X: i, Y: j}; 
      }
    }

  }

  return diff;
}

function matrixToFEN(matrix) {
  var fen = "";
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      fen = fen + tempFEN[i][j];
    }
    if(i != 7) {
      fen = fen + "/";
    }
  }

  return fen;
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
      hostname = iface.address;
    }
    ++alias;
  });
});


app.use(express.static('public'));


// client.on('connect', () => {  

io.on('connection', function(socket) {
  console.log('a user connected');

  eventEmitter.on('fenChange', function(fen) {
    // console.log(fen)
    io.emit('fenChange', fen);
  });
  

});
  
// })


http.listen(3000, () => {
  console.log(`Server running at http://${hostname}:3000/`);
});
