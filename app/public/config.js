"use strict";

angular.module('config', [])

.constant('ENV', {environment:'development',baseUrl:'http://dev.ps2alerts.com',apiUrl:'http://api.dev.ps2alerts.com/v2',websocketUrl:'ws://wss.dev.ps2alerts.com?apikey=FOOBAR'})

;