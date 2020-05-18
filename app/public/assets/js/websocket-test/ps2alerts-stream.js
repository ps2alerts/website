var ps2alertsWebsocket;
function initps2alerts() {
    console.log('Connecting to PS2Alerts...');
    ps2alertsWebsocket = new WebSocket('ws://ws.ps2alerts.com:1337/?apikey=692e01b167f4c5c28cdc95389f038393');
    ps2alertsWebsocket.onopen = function(evt) { onOpenPS2Alerts(evt); };
    ps2alertsWebsocket.onclose = function(evt) { onClosePS2Alerts(evt); };
    ps2alertsWebsocket.onmessage = function(evt) { onMessagePS2Alerts(evt); };
    ps2alertsWebsocket.onerror = function(evt) { onErrorPS2Alerts(evt); };
}

function onOpenPS2Alerts() {
    writeToScreen('CONNECTED - PS2Alerts', 'ps2alerts');
    doSendPS2Alerts('{"payload":{"action":"alertStatus"}}');
}
function onClosePS2Alerts() {
    writeToScreen('DISCONNECTED', 'ps2alerts');
}
function onMessagePS2Alerts(evt) {
    var json = JSON.parse(evt.data);
    if (json.messageType !== 'keepalive') {
        writeToScreen('RESPONSE: ' + evt.data, 'ps2alerts');
    }
}
function onErrorPS2Alerts(evt) {
    writeToScreen('<b>ERROR:' + evt.data + '</b>', 'ps2alerts');
}
function doSendPS2Alerts(message) {
    writeToScreen('SENT: ' + message, 'ps2alerts');
    ps2alertsWebsocket.send(message);
}

window.addEventListener('load', initps2alerts, false);
