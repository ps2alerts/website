app.controller('RealTimeMonitorController', function($scope, ConfigDataService, WebsocketService) {
    $scope.config    = ConfigDataService;
    $scope.websocket = WebsocketService;

    $scope.websocket.hide = 0;
    $scope.websocket.disabled = 0;
    $scope.message = 'Alert collection has been disabled!';
    $scope.messageCaption = '12-Jun-2017: Extended Census API is experiencing issues. Collection has been disabled to prevent statistical damage.';

    if ($scope.websocket.disabled === 0) {
        // Start the engines
        $scope.websocket.initWebSocket();
    }

    $scope.simMiddlemanDown = function() {
        $scope.websocket.loaded = 0;
        $scope.websocket.middlemanDown = 1;
    };
});
