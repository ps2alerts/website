app.controller('AlertHistoryController', function(
    $scope,
    $log,
    ConfigDataService,
    AlertHistoryService
) {
    $scope.data   = AlertHistoryService;
    $scope.config = ConfigDataService;

    $scope.filters = {};

    $scope.inits = {
        servers: false,
        zones: false,
        factions: false,
        brackets: false
    };

    $scope.applyFilter = function() {
        $scope.data.resetData();
        $scope.data.applyFilter($scope.filters);
    };

    $scope.clearFilter = function() {
        $scope.filters.servers  = [];
        $scope.filters.zones    = [];
        $scope.filters.brackets = [];
        $scope.filters.factions = [];
    };

    $scope.showAll = function() {
        $scope.data.resetData();
        $scope.filters.servers  = [1,10,13,17,25,1000,2000]; // Set Default
        $scope.filters.zones    = [2,4,6,8];
        $scope.filters.brackets = ['MOR','AFT','PRI'];
        $scope.filters.factions = ['vs','nc','tr','draw'];
        $scope.data.applyFilter($scope.filters);

        $scope.inits = {
            servers: false,
            zones: false,
            factions: false,
            brackets: false
        };
    };

    $scope.toggleFilters = function(type, selection) {
        $scope.initCheck(type);

        var index = $scope.filters[type].indexOf(selection);

        if (index > -1) {
            $scope.filters[type].splice(index, 1); // Remove element from array
        } else {
            $scope.filters[type].push(selection);
        }
    };

    $scope.initCheck = function(type) {
        if ($scope.inits[type] === false) {
            $scope.filters[type] = []; // Clear all selections
            $scope.inits[type] = true;
        }
    };

    $scope.started = new Date('2014-10-30');
    $scope.today   = new Date();

    $scope.minDate = new Date(
        $scope.started.getFullYear(),
        $scope.started.getMonth(),
        $scope.started.getDate()
    );

    $scope.maxDate = new Date(
        $scope.started.getFullYear(),
        $scope.started.getMonth(),
        $scope.started.getDate()
    );

    $scope.dateFrom = new Date();
    $scope.dateTo   = new Date();

    // Show initial data
    $scope.showAll();
});
