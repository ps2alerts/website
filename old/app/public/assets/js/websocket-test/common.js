function writeToScreen(message, universe) {
    var output = document.getElementById('output-pushapi');
    var color = '#00af00';
    if (universe === 'ps2alerts') {
        color = '#0000ff';
    } else if (universe === 'census') {
        color = '#ef9f07';
    }
    var pre = document.createElement('p');
    var timestamp = moment().format('HH:mm:ss:SSS');

    pre.style.wordWrap = 'break-word';
    pre.innerHTML = '<span style="color:' + color + '" data-src="' + universe + '">[' + timestamp + '] ' + message + '</span>';
    output.appendChild(pre);
}

function subscribeToWorld(id) {
    console.log('Subscribing to world: ' + id);
    var message = {
        payload: {
            action: 'subscribe-world',
            worldID: id
        }
    };

    doSendPS2Alerts(JSON.stringify(message));
    doSendPushAPI('{"action":"subscribe", "event": "Combat", "worlds": "' + id + '"}');
    doSendCensus('{"service":"event","action":"subscribe","characters":["all"],"eventNames":["Death"],"worlds":["' + id + '"],"logicalAndCharactersWithWorlds":true}');
}

$(document).ready(function() {
    $('#subscribe').click(function() {
        var world = $('#world').val();

        if (world) {
            subscribeToWorld(world);
        }
    });
});
