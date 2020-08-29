app.service('ConfigDataService', function(ENV, $rootScope, $location) {
    var factory = {
        environment: ENV.environment,
        baseUrl: ENV.baseUrl,
        assetUrl: ENV.baseUrl + '/assets/',
        apiUrl: ENV.apiUrl,
        websocketUrl: ENV.websocketUrl,
        factions: ['vs', 'nc', 'tr', 'draw'],
        factionsAlpha: {
            'vs': 'Vanu Sovereignty',
            'nc': 'New Conglomerate',
            'tr': 'Terran Republic',
            'draw': 'Draw'
        },
        factionsNumeric: [1, 2, 3, -1],
        servers: [1, 10, 13, 17, 25, 1000, 2000],
        serversAlpha: [25, 13, 1, 2000, 17, 10, 1000],
        serverNames: {
            1:    'Connery',
            10:   'Miller',
            13:   'Cobalt',
            17:   'Emerald',
            19:   'Jaeger',
            25:   'Briggs',
            1000: 'Genudine',
            1001: 'Lithcorp',
            2000: 'Ceres',
            2001: 'Palos'
        },
        shortServerNames: {
            1:    'Con',
            10:   'Mil',
            13:   'Cob',
            17:   'Eme',
            19:   'Jae',
            25:   'Bri',
            1000: 'Gen',
            1001: 'Lit',
            2000: 'Cer',
            2001: 'Pal'
        },
        zones: [2, 4, 6, 8],
        zoneNames: {
            2: 'Indar',
            4: 'Hossin',
            6: 'Amerish',
            8: 'Esamir'
        },
        zonesAlpha: [6, 8, 4, 2],
        timeBrackets: {
            'MOR': {
                label: 'Morning',
                desc: '(00:00 - 11:59)'
            },
            'AFT': {
                label: 'Afternoon',
                desc: '(12:00 - 16:59)'
            },
            'PRI': {
                label: 'Prime Time',
                desc: '(17:00 - 23:59)'
            }
        },
        facilityTypes: {
            2: 'Amp Station',
            3: 'Bio Lab',
            4: 'Tech Plant',
            5: 'Large Outpost',
            6: 'Small Outpost',
            7: 'Warpgate',
            8: 'Interlink' // #BRING BACK THE INTERLINK
        },
        facilityTypesSmall: {
            2: 'Amp',
            3: 'Bio',
            4: 'Tech',
            5: 'Lg Outpost',
            6: 'Sm Outpost',
            7: 'Warpgate',
            8: 'Interlink' // #BRING BACK THE INTERLINK
        },
        meta: {
            title: '',
            location: ''
        },
        loadouts: {
            1: 'NC Infiltraitor',
            // There is no 2
            3: 'NC Light Assault',
            4: 'NC Medic',
            5: 'NC Engineer',
            6: 'NC Heavy Assault',
            7: 'NC MAX',

            8: 'TR Infiltrator',
            // There is no 9
            10: 'TR Light Assault',
            11: 'TR Medic',
            12: 'TR Engineer',
            13: 'TR Heavy Assault',
            14: 'TR MAX',

            15: 'VS Infiltrator',
            // There is no 16
            17: 'VS Light Assault',
            18: 'VS Medic',
            19: 'VS Engineer',
            20: 'VS Heavy Assault',
            21: 'VS MAX'
        },
        classRefNames: {
            infiltrator: 'Infiltrator',
            la: 'Light Assault',
            medic: 'Medic',
            engineer: 'Engineer',
            ha: 'Heavy Assault',
            max: 'MAX'
        },
        maelChars: [
            '5428010618035323201', // Maelstrome26
            '7697549730244565425', // PS2AlertsBriggs
            '8262937017478455425', // PS2AlertsCobalt
            '5428226580942190801', // PS2AlertsConnery
            '5428366106637502001', // FarmerOfTheCrops (Emerald)
        ]
    };

    factory.convertFactionNameToInt = function(name) {
        name = name.toLowerCase();
        switch (name) {
            case 'VS':
                return 1;
            case 'NC':
                return 2;
            case 'TR':
                return 3;
            default:
                return null;
        }
    };

    factory.convertFactionIntToName = function(int) {
        switch (int) {
            case 1:
                return 'vs';
            case 2:
                return 'nc';
            case 3:
                return 'tr';
            default:
                return null;
        }
    };

    factory.update = function() {
        factory.location = factory.baseUrl + '/#' + $location.url();
    };

    factory.maelChar = function(id) {
        if (factory.maelChars.indexOf(id) !== -1) {
            return true;
        }
        return false;
    };

    $rootScope.$on('$routeChangeSuccess', factory.update);

    return factory;
});
