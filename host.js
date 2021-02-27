let express = require('express');
let simplePeer = require('simple-peer');
let socket = require('socket.io');
let nodeWebrtc = require('wrtc');
let app = express();
const PORT = 4000;

app.use(express.static('public'));

let server = app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});

let io = socket(server);
let peerConnection = new simplePeer({ wrtc: nodeWebrtc });

//on socket connection opened
io.on('connection', (socket) => {

  console.log('New Socket has opened ', socket.id);

  //event listeners for socketio
  socket.on('offer', sdp => {
    /*
    host receives offer from visitor and signals it.
    */
    peerConnection.signal(sdp);
  });

  socket.on('disconnection', () => {
    //disconnects socket connection
    console.log('socket disconnected at node server');
    socket.disconnect();
  });


  //event listeners for simple-peer
  peerConnection.on('error', err => console.log('error', err));

  peerConnection.on("signal", (data) => {
    /*
    host prepares answer for the received offer and
    sends back to the visitor using socket emit('answer).
    */
    const sdp = JSON.stringify(data);
    socket.emit('answer', sdp);
  });

  peerConnection.on('connect', () => {
    /*
    it gets executed when connection between visitor
    and host was successfully established.
    */
    console.log('connection established in node');
  });

  peerConnection.on('data', data => {
    console.log('data from visitor: ' + data);
    peerConnection.send("responding for " + data);
  });

  peerConnection.on('close', () => {
    console.log('connection has been closed');
  });
});

