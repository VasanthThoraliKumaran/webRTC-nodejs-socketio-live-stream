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


socketConnection.on('responseMessage', data => {
    $responseMessage.innerHTML = data;
});

//event listeners for simple-peer

peerConnection.on('error', err => console.log('error', err))

peerConnection.on("signal", (data) => {
    const sdp = JSON.stringify(data);
    socketConnection.emit('offer', sdp);
});

peerConnection.on('connect', () => {
    alert('connection established in browser');
});

peerConnection.on('data', data => {
    console.log('data: ' + data);
});

peerConnection.on('close', () => {
    socketConnection.emit('disconnect');
    console.log('socket disconnected at browser');
    socketConnection.disconnect();
}); 