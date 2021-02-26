var express = require('express');
var simplepeer = require('simple-peer');
var socket = require('socket.io');
var wrtc = require('wrtc')
var app = express();
let port = 4000;

app.use(express.static('public'));

var server = app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});

var io = socket(server);
const peerConnection = new simplepeer({wrtc:wrtc});

//on socket connection opened
io.on('connection', (socket)=>{

    console.log('New Socket has opened ', socket.id);

    peerConnection.on('error', err => console.log('error', err))

    peerConnection.on("signal", (data) => {
            const sdp = JSON.stringify(data);
            socket.emit('answer', sdp);
      });

      socket.on('offer', sdp=>{
       peerConnection.signal(sdp);
      })

    peerConnection.on('connect',()=>{
      console.log('connection established in node');
    });
    
    peerConnection.on('data', data => {
            console.log('data from host: ' + data);
            socket.emit('response', "responding for "+ data);
     })
});

