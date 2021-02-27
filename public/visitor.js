let socketConnection = io.connect('http://localhost:4000');

let peerConnection = new SimplePeer({
    initiator: location.hash === '#host',
});

let $sendButton = document.getElementById('send'),
    $responseMessage = document.getElementById('response_message'),
    $textArea = document.getElementById('text_area');

// event listeners for dom objects
$sendButton.addEventListener('click', () => {
    const data = $textArea.value;
    peerConnection.send(data);
});

//event listeners for socketio
socketConnection.on('answer', (sdp) => {
    peerConnection.signal(sdp);
})

//event listeners for simple-peer

peerConnection.on('error', err => console.log('error', err))

peerConnection.on("signal", (data) => {
    /*
it is an entry point, visitor will get his offer from simple-peer
and passes that to host using socket emit('offer').
    */
    const sdp = JSON.stringify(data);
    //emitting offer to server
    socketConnection.emit('offer', sdp);
});

peerConnection.on('connect', () => {
    /*
        it gets executed when connection between visitor
        and host was successfully established.
    */
    alert('connection established in browser');
});

peerConnection.on('data', data => {
    /*
     it gets executed when host
     sends a response message.
     */
    console.log('data from host: ' + data);
    $responseMessage.innerHTML = data;
});

peerConnection.on('close', () => {

    //disconnects socket connection
    socketConnection.emit('disconnect');
    console.log('socket disconnected at browser');
    socketConnection.disconnect();
}); 