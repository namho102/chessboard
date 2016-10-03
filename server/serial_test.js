var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyACM1", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

// port.open(function (err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message);
//   }
// });

port.on('data', function (data) {
  processData(data.toString());
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
    console.log(x);
 

  }
}
