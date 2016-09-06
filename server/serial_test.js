var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

// port.open(function (err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message);
//   }
// });

port.on('data', function (data) {
  console.log(data.toString());
});
