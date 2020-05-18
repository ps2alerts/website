var wsUri = 'wss://push.planetside2.com/streaming?environment=ps2&service-id=s:example';
var censusWebsocket;

function initCensus() {
    console.log('Connecting to Census...');
    censusWebsocket = new WebSocket(wsUri);
    censusWebsocket.onopen = function(evt) { onOpenCensus(evt); };
    censusWebsocket.onclose = function(evt) { onCloseCensus(evt); };
    censusWebsocket.onmessage = function(evt) { onMessageCensus(evt); };
    censusWebsocket.onerror = function(evt) { onErrorCensus(evt); };
}

function onOpenCensus() {
    writeToScreen('CONNECTED - Census', 'census');
    doSendCensus('{"action":"subscribe","event":"MetagameEvent","all":"true"}');
}
function onCloseCensus() {
    writeToScreen('DISCONNECTED', 'census');
}
function onMessageCensus(evt) {
    writeToScreen('RESPONSE: ' + evt.data, 'census');
}
function onErrorCensus(evt) {
    writeToScreen('<b>ERROR:' + evt.data + '</b>', 'census');
}
function doSendCensus(message) {
    censusWebsocket.send(message);
    writeToScreen('SENT: ' + message, 'census');
}

window.addEventListener('load', initCensus, false);
