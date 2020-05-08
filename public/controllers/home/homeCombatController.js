app.controller('HomeCombatController', function(
    $scope,
    ConfigDataService,
    HomeCombatStatisticsService
) {
    $scope.today = new Date();
    $scope.config = ConfigDataService;
    $scope.combatStats = HomeCombatStatisticsService;

    $scope.combatStats.init();

    $scope.factions = ['vs', 'nc', 'tr'];
});
