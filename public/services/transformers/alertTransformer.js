app.service('AlertTransformer', function($filter, ConfigDataService) {
    var factory = {};

    // Parse alert information into a standardized format
    factory.parse = function(alert) {
        return new Promise(function(resolve) {
            alert.id           = alert.id;
            alert.started      = alert.started * 1000;
            alert.server       = ConfigDataService.serverNames[alert.server];
            alert.zone         = ConfigDataService.zoneNames[alert.zone];
            alert.winner       = alert.winner.toLowerCase();
            alert.inProgress   = alert.inProgress;
            // Ended only values
            alert.endedDate    = null;
            alert.winnerText   = null;
            alert.duration     = null;
            alert.durationTime = null;
            alert.durationMins = null;

            alert.startedDate = $filter('date')(alert.started, 'dd-MMM-yyyy HH:mm:ss');

            if (alert.inProgress === false) { // Ended, fill in the nulls
                alert.ended       = alert.ended * 1000;
                alert.endedDate   = $filter('date')(alert.ended, 'dd-MMM-yyyy HH:mm:ss');

                if (alert.timeBracket == 'TES') {
                    alert.timeBracket = 'Testing';
                } else if (alert.timeBracket == 'UNK') {
                    alert.timeBracket == 'UNKNOWN';
                } else {
                    alert.timeBracket = ConfigDataService.timeBrackets[alert.timeBracket].label;
                }

                alert.winner     = alert.winner.toLowerCase();
                alert.winnerText = ConfigDataService.factionsAlpha[alert.winner];
                alert.duration   = alert.ended - alert.started;
            } else {
                // In progress specific fields
                var now = new Date().getTime();
                alert.duration = now - alert.started;
            }

            alert.durationTime = $filter('date')(
                alert.duration - 1, // -1 second due to Census lag
                'HH:mm:ss',
                'UTC'
            );
            alert.durationMins = Math.round((alert.duration / 1000) / 60);

            resolve(alert);
        });
    };

    factory.transformCombatMessage = function(data) {
        var obj = {
            resultID: parseInt(data.resultID),
            headshot: (data.headshot == 1 ? true : false),
            suicide: (data.suicide == 1 ? true : false),
            teamkill: (data.teamkill == 1 ? true : false),
            weaponID: parseInt(data.weaponID),
            attackerID: data.attackerID, // String on purpuse because of BIGINT issue
            attackerOutfit: data.aOutfit,
            attackerName: data.attackerName,
            attackerFaction: parseInt(data.attackerFaction),
            attackerLoadout: parseInt(data.attackerLoadout),
            victimID: data.victimID,
            victimOutfit: data.vOutfit,
            victimName: data.victimName,
            victimFaction: parseInt(data.victimFaction),
            victimLoadout: parseInt(data.victimLoadout)
        };

        obj.attackerFactionAbv = factory.parseFaction(obj.attackerFaction);
        obj.victimFactionAbv = factory.parseFaction(obj.victimFaction);

        return obj;
    };

    factory.transformVehicleCombatMessage = function(data) {
        var obj = {
            resultID: parseInt(data.resultID),
            vehicleID: parseInt(data.vehicleID),
            type: data.type,
            iMetric: parseInt(data.iMetric),
            vMetric: parseInt(data.vMetric),
            nanites: parseInt(data.nanites),
        };

        if (obj.type === 'death') {
            if (data.bail) {
                obj.bail = parseInt(data.bail);
            }
            obj.nanites = parseInt(data.nanites);
        }

        return obj;
    };

    factory.transformFacilityMessage = function(data) {
        var obj = {
            facilityID: parseInt(data.facilityID),
            timestamp: parseInt(data.timestamp),
            isDefence: (data.defence == 1 ? true : false),
            controlVS: parseInt(data.controlVS),
            controlNC: parseInt(data.controlNC),
            controlTR: parseInt(data.controlTR),
            facilityOldFaction: parseInt(data.facilityOldOwner),
            facilityNewFaction: parseInt(data.facilityOwner),
            outfit: (data.outfitCaptured != '0' ? data.outfitCaptured : null),
            server: parseInt(data.world),
            zone: parseInt(data.zone),
            durationHeld: parseInt(data.durationHeld)
        };

        obj.controlTotal = obj.controlVS + obj.controlNC + obj.controlTR;
        obj.controlNeutral = 100 - obj.controlTotal;

        return obj;
    };

    factory.transformAlertEndMessage = function(data) {
        var obj = {
            resultID: parseInt(data.resultID),
            endTime: parseInt(data.endTime),
            winner: data.winner,
            controlVS: parseInt(data.controlVS),
            controlNC: parseInt(data.controlNC),
            controlTR: parseInt(data.controlTR),
            domination: parseInt(data.domination),
            world: parseInt(data.world),
            zone: parseInt(data.zone)
        };

        return obj;
    };

    factory.parseFaction = function(factionID) {
        if (factionID === 1) {
            return 'vs';
        }
        if (factionID === 2) {
            return 'nc';
        }
        if (factionID === 3) {
            return 'tr';
        }
        return null;
    };

    return factory;
});
