app.service('WebsocketService', function(
    $rootScope,
    $document,
    HomeVictoryStatisticsService,
    AlertHistoryService,
    ConfigDataService
) {
    var factory = {};

    factory.webSocket = {};
    factory.loaded = 0;
    factory.connecting = 0;
    factory.middlemanDown = 0;
    factory.middlemanCheck;

    factory.actives = null;

    factory.initWebSocket = function() {
        factory.webSocket = new WebSocket(ConfigDataService.websocketUrl);
        factory.connecting = 1;

        factory.webSocket.onopen = function() {
            factory.authenticate();
            factory.checkMiddleman();

            // Sets the sync so that we don't get orphoned alerts
            factory.sync = setInterval(function() {
                factory.webSocket.send('{"payload":{"action":"alertStatus"}}');
            }, 10000);
        };

        factory.webSocket.onmessage = function(rawMessage) {
            factory.handleWebsocketMessage(factory.parse(rawMessage));
        };

        factory.webSocket.onclose = function() {
            factory.loaded = 0;
            factory.connecting = 0;
            $rootScope.$apply();
            clearInterval(factory.sync);
            $('#alert-monitor .monitor-row').addClass('phased');

            setTimeout(function() {
                factory.connecting = 1;
                $rootScope.$apply();
                return factory.initWebSocket();
            }, 2500);
        };
    };

    factory.authenticate = function() {
        factory.webSocket.send('{"payload":{"action":"alertStatus"}}');
        factory.loaded = 1;
        factory.connecting = 0;
        $('#alert-monitor .monitor-row').removeClass('phased');
    };

    factory.checkMiddleman = function() {
        factory.webSocket.send('{"payload":{"action":"middlemanStatus"}}');
    };

    factory.parse = function(rawMessage) {
        var message = null;

        try {
            message = JSON.parse(rawMessage.data);
        } catch (e) {
            console.log('Websocket JSON parse fail!', e);
        }

        if (typeof message === null) {
            return false;
        }

        return message;
    };

    factory.handleWebsocketMessage = function(message) {
        if (message !== null) {
            if (typeof message.messageType !== 'undefined') {
                switch (message.messageType) {
                    case 'alertStart': {
                        factory.addActive(message.data);
                        break;
                    }
                    case 'update': {
                        factory.updateActives(message);
                        break;
                    }
                    case 'alertEnd': {
                        factory.endActiveParsed(message);
                        break;
                    }
                    case 'alertStatus': {
                        factory.initActives(message);
                        break;
                    }
                    case 'middlemanStatus': {
                        factory.parseMiddleman(message);
                        break;
                    }
                }
            }
        }
    };

    factory.initActives = function(message) {
        angular.forEach(message.data, function(server) {
            angular.forEach(server, function(alert) {
                factory.addActive(alert);
            });
        });
        $rootScope.$apply();
    };

    factory.addActive = function(messageData) {
        factory.parseAlertDataInitial(messageData, function(alert) {
            if (factory.actives === null) {
                factory.actives = {};
            }
            if (typeof factory.actives[alert.id] === 'undefined') {
                factory.actives[alert.id] = alert;

                // @todo Look into seeing if we can do this via an event upon element render. Timer will do for now.
                setTimeout(function() {
                    factory.setMonitorCountdown(alert.id);
                }, 1);

                $rootScope.$apply();
                $rootScope.$emit('ga-sync', '#alert-monitor #monitor-' + alert.id + ' .ga-event');
            } else {
                // Check if the alert has expired, if so, remove.

                alert = factory.actives[alert.id];
                var time = new Date().getTime();
                time = time / 1000; // Convert to stored time format

                // If the alert has ended, kill it.
                if (time > alert.ends) {
                    alert = {
                        id: alert.id,
                        server: alert.server,
                        forced: true
                    };

                    factory.endActive(alert);
                }
            }
        });
    };

    factory.updateActives = function(message) {
        factory.parseAlertDataUpdate(message.data, function(alert) {
            if (alert.defence === 0) {
                factory.actives[alert.id].vs = alert.vs;
                factory.actives[alert.id].nc = alert.nc;
                factory.actives[alert.id].tr = alert.tr;
                factory.actives[alert.id].cutoff = 100 - alert.vs - alert.nc - alert.tr;
                $rootScope.$apply();
            }
        });
    };

    factory.endActiveParsed = function(message) {
        factory.parseAlertDataEnd(message.data, function(alert) {
            factory.endActive(alert);
        });
    };

    factory.endActive = function(alert) {
        delete factory.actives[alert.id];

        var size = 0;
        for (var key in factory.actives) {
            if (factory.actives.hasOwnProperty(key)) {
                size++;
            }
        }

        if (size === 0) {
            factory.actives = null;
        }
        // Check if the alert wasn't forcibly removed. If it was, we have no winner information.
        if (typeof alert.forced === 'undefined') {
            HomeVictoryStatisticsService.increaseAlertTotal();
            HomeVictoryStatisticsService.increaseVictories(alert.server, alert.winner);

            if (alert.domination === 1) {
                HomeVictoryStatisticsService.increaseDominationTotal();
                HomeVictoryStatisticsService.increaseDominations(alert.server, alert.winner);
            }

            AlertHistoryService.appendAlert(alert);
        }

        $rootScope.$apply();
    };

    // Also handles starts as it's the same fields
    factory.parseAlertDataInitial = function(alert, callback) {
        var time = new Date().getTime();
        var remainingJS = (parseInt(alert.remaining) * 1000);
        var realEnd = (time + remainingJS) - 1; // - 1 because of setTimeout

        var obj = {
            id:        parseInt(alert.resultID),
            started:   parseInt(alert.startTime),
            ends:      parseInt(alert.endTime),
            countdown: realEnd,
            vs:        parseInt(alert.controlVS),
            nc:        parseInt(alert.controlNC),
            tr:        parseInt(alert.controlTR),
            server:    parseInt(alert.world),
            zone:      parseInt(alert.zone)
        };

        callback(obj);
    };

    factory.parseAlertDataUpdate = function(alert, callback) {
        callback({
            id:      parseInt(alert.resultID),
            vs:      parseInt(alert.controlVS),
            nc:      parseInt(alert.controlNC),
            tr:      parseInt(alert.controlTR),
            server:  parseInt(alert.world),
            zone:    parseInt(alert.zone),
            defence: parseInt(alert.defence)
        });
    };

    factory.parseAlertDataEnd = function(alert, callback) {
        callback({
            id:         parseInt(alert.resultID),
            ended:      parseInt(alert.endTime),
            vs:         parseInt(alert.controlVS),
            nc:         parseInt(alert.controlNC),
            tr:         parseInt(alert.controlTR),
            server:     parseInt(alert.world),
            zone:       parseInt(alert.zone),
            domination: parseInt(alert.domination),
            winner:     alert.winner.toLowerCase()
        });
    };

    factory.parseMiddleman = function(message) {
        if (message.value == '0') {
            factory.middlemanDown = 1;

            if (!factory.middlemanCheck) {
                factory.middlemanCheck = setInterval(function() {
                    console.log('checking middleman');
                    factory.checkMiddleman();
                }, 2000);
            }
        }

        if (message.value == '1') {
            factory.middlemanDown = 0;
            factory.loaded = 1;

            clearInterval(factory.middlemanCheck);
        }

        $rootScope.$apply();
    };

    factory.addAlertTest = function() {
        var timestamp = new Date().getTime();
        timestamp = timestamp / 1000;

        var testData = {
            startTime: timestamp,
            endTime:   timestamp + 5399, // - 1 because of setTimeout
            world:     10,
            zone:      2,
            resultID:  12345,
            controlVS: 33,
            controlNC: 33,
            controlTR: 33,
            remaining: 5400
        };
        factory.addActive(testData);
    };

    factory.endAlertTest = function() {
        console.log('End alert test');
        var testData = {
            data: {
                controlNC: '37',
                controlTR: '27',
                controlVS: '35',
                domination: 0,
                endTime: '1453570024',
                resultID: 12345,
                winner: 'NC',
                world: '10',
                zone: '2'
            }
        };

        factory.endActive(testData);
    };

    factory.setMonitorCountdown = function(alertID) {
        var row = $('#monitor-' + alertID);
        var elem = $(row).find('.countdown');
        var time = elem.attr('todate');

        elem.countdown(time, function(event) {
            if (event.strftime) {
                $(this).text(
                    event.strftime('%H:%M:%S')
                );
            }
        }).on('finish.countdown', function() {
            elem.countdown('stop');
            elem.html('OVERDUE!');
        });
    };

    return factory;
});
