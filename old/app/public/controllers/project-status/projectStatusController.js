app.controller('ProjectStatusController', function(
    $scope,
    ConfigDataService
) {
    $scope.config = ConfigDataService;
    $scope.baseUrl = $scope.config.baseUrl;
    $scope.projects = [
        {
            title: 'Homepage',
            subtitle: 'Shows all major statistics, e.g. # of alerts, alerts per server, faction wins, etc.',
            updated: '19th June 2017',
            href: $scope.baseUrl,
            completed: [
                'Basic Statistics (Total Victories, Dominations, Faction % bar',
                'Server Victories',
                'Faction Victories',
                'Continent Victories',
                'Victory Timeline',
                'Combat Statistics',
            ],
            inprogress: [
                'Vehicle Statistics',
            ],
            started: [

            ],
            notstarted: [
                'Rolling Victory Averages',
                'Last Week & Last Month metrics',
                'Date Range Filtering',
            ]
        },
        {
            title: 'Alert Statistics Pages',
            subtitle: 'Per-alert statistics pages are in the process of being re-written. See below for a summary of the features',
            updated: '19th June 2017',
            href: $scope.baseUrl + '/alert/20000',
            completed: [
                'Basic Alert Information (time, server, continent etc)',
                'Territory Capture Bar',
                'Basic Combat Metrics (Kills, Deaths, Tks, Suicides)',
                'Leaderboard system (Players, Outfits, Weapons, Vehicles)',
                'Basic Facility Statistics',
                'Outfit Captures',
                'Realtime metrics (live updating)',
            ],
            inprogress: [
            ],
            started: [
                'Population Metrics',
                'Population Timeline',
            ],
            notstarted: [
                'Map Capture Timeline',
                'Map "who capped whom" display',
                'Continental Map',
                'Faction Kills timeline',
                'Class Combat Statistics',
                'XP Statistics',
                'Per-player metrics summaries',
                'Per-outfit metrics summaries',
                'Faction Combat stats (which faction gunned for whom)'
            ]
        },
        {
            title: 'Alert History',
            subtitle: 'Shows a list of all alerts, along with basic stats such as victory, territory control etc.',
            updated: '3rd March 2016',
            href: $scope.baseUrl + '/alert-history',
            completed: [
                'Basic filtering, by Server, Zone, Faction and Time Bracket',
                'Basic metrics such as Date ended, Server, Continent, Time bracket and Territory info.'
            ],
            inprogress: [

            ],
            started: [

            ],
            notstarted: [
                'Date range filtering',
                'In progress alerts',
                'Live updates for in progress alerts'
            ]
        },
        {
            title: 'Leaderboards',
            subtitle: 'Shows the top players and outfits in various scenarios, such as most kills, deaths, TKs, suicides etc.',
            updated: '3rd May 2016',
            href: $scope.baseUrl + '/leaderboards',
            completed: [
                'Top 100 Leaderboards',
                'Top 100 Leaders by basic metrics, such as Top Kills, Deaths, TKs etc',
                'Top Players and top Outfits',
                'Top Weapons'
            ],
            inprogress: [

            ],
            started: [
                'Leaderboard Ladders',
                'Player Profile Updates - You\'ll be able to see your position on the leaderboard within your profile'
            ],
            notstarted: [
                'Leaderboard Seasons (more info on this soon)'
            ]
        },
        {
            title: 'Player Profiles',
            subtitle: 'All Players within PS2Alerts each have a profile, allowing you to see your own statistics within the Planetside 2 Alerts metagame.',
            updated: '24th April 2016',
            href: $scope.baseUrl + '/profiles/player/5428010618035323201',
            completed: [
                'Basic Player information such as Server, Kills, Deaths, TKs, Suicides etc',
                'More detailed stats such as Headshots, Battlerank, Avg Kills / Deaths per alert, K/D etc',
                'List of all alerts involved, with links to them',
                'Top weapons for the player',
                'Links to other statistics sites for the player'
            ],
            inprogress: [

            ],
            started: [
                'Leaderboard Ladder Rankings'
            ],
            notstarted: [
                'Vehicle statistics'
            ]
        },
        {
            title: 'Outfit Profiles',
            subtitle: 'All Outfits have their own profile, along with statistics regarding their members.',
            updated: '29th April 2016',
            href: $scope.baseUrl + '/profiles/outfit/37509488620604883',
            completed: [
                'Basic Outfit information such as Server, Kills, Deaths, TKs, Suicides etc',
                'More advanced stats such as Captures / Defences, Member count, average kills / deaths per alert etc',
                'List of all alerts involved, with links to them',
                'Full searchable member list, with links to the player profiles of every member',
                'List of top facilities captured, defended and on a per continent / type basis',
                'Top weapons for the player',
                'Links to other stats sites regarding the outfit'
            ],
            inprogress: [

            ],
            started: [
                'Leaderboard Ladder Rankings'
            ],
            notstarted: [
                'Outfit weapon statistics',
                'Vehicle statistics'
            ]
        }
    ];

    $scope.completed = 0;
    $scope.inprogress = 0;
    $scope.started = 0;
    $scope.notstarted = 0;
    $scope.total = 0;

    _.forEach($scope.projects, function(value) {
        $scope.completed += value.completed.length;
        $scope.inprogress += value.inprogress.length;
        $scope.started += value.started.length;
        $scope.notstarted += value.notstarted.length;
        $scope.total = $scope.completed + $scope.inprogress + $scope.started + $scope.notstarted;
    });

    setTimeout(function() {
        $scope.$emit('ga-sync', '#project-status .ga-event');
    }, 1000);
});
