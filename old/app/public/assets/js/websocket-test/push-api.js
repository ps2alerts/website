var wsUri = 'ws://push.api.blackfeatherproductions.com/?apikey=example';
var pushWebsocket;

function initPushAPI() {
    console.log('Connecting to Push API...');
    pushWebsocket = new WebSocket(wsUri);
    pushWebsocket.onopen = function(evt) { onOpenPushAPI(evt); };
    pushWebsocket.onclose = function(evt) { onClosePushAPI(evt); };
    pushWebsocket.onmessage = function(evt) { onMessagePushAPI(evt); };
    pushWebsocket.onerror = function(evt) { onErrorPushAPI(evt); };
}

function onOpenPushAPI() {
    writeToScreen('CONNECTED - Push API', 'push-api');
    doSendPushAPI('{"action":"subscribe","event":"MetagameEvent","all":"true"}');
}
function onClosePushAPI() {
    writeToScreen('DISCONNECTED', 'push-api');
}
function onMessagePushAPI(evt) {
    writeToScreen('RESPONSE: ' + evt.data, 'push-api');
}
function onErrorPushAPI(evt) {
    writeToScreen('<b>ERROR:' + evt.data + '</b>', 'push-api');
}
function doSendPushAPI(message) {
    writeToScreen('SENT: ' + message, 'push-api');
    pushWebsocket.send(message);
}

window.addEventListener('load', initPushAPI, false);
