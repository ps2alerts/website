app.service('MetricsProcessingService', function() {
    var factory = {};

    // Calculate KD
    factory.calcKD = function(kills, deaths) {
        var kd =
        parseFloat((kills / deaths).toFixed(2));

        if (kd == 'Infinity' || isNaN(kd)) {
            kd = kills;
        }

        return kd;
    };

    // Calculate Headshot Ratio
    factory.calcHSR = function(headshots, kills) {
        var hsr = parseFloat((headshots / kills * 100).toFixed(2));

        if (hsr == 'Infinity' || isNaN(hsr)) {
            hsr = kills;
        }

        return hsr;
    };

    factory.getNoOutfitID = function(faction) {
        if (!faction) {
            console.log('Unable to calculate NoOutfitID due to lack of faction');
            return 0;
        }
        // Calculate -3, -2, -1 etc for players without outfits
        switch (faction) {
            case 1: {
                return '-1';
                break;
            }
            case 2: {
                return '-2';
                break;
            }
            case 3: {
                return '-3';
                break;
            }
        }
    };

    factory.getKpm = function(metric, time) {
        var kpm = (metric / time) * 1000 * 60;
        return kpm.toFixed(2);
    };

    return factory;
});
