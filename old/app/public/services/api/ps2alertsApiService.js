app.service('PS2AlertsAPIService', function(
    $http,
    AlertTransformer,
    ConfigDataService
) {
    var factory = {};

    factory.getConfigData = new Promise(function(resolve, reject) {
        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        }, function(error) {
            alert('Was unable to load the page correctly (config data). Please refresh.');
            return reject(error);
        });
    });

    factory.getAlertData = function(alertID) {
        return new Promise(function(resolve, reject) {
            $http({
                method: 'GET',
                url: ConfigDataService.apiUrl + '/alerts/' + alertID + '?embed=classes,combats,combatHistorys,mapInitials,maps,outfits,players,populations,vehicles,weapons'
            }).then(function(returned) {
                return resolve(returned.data.data);
            }, function(error) {
                alert('Was unable to load the page correctly (config data). Please refresh.');
                return reject(error);
            });
        });
    };

    factory.getOutfitFromAPI = function(outfitID) {
        return new Promise(function(resolve, reject) {
            if (outfitID < 1) {
                console.log('Chucking out invalid outfit ID from API call');
                reject();
            }
            $http({
                method: 'GET',
                url: ConfigDataService.apiUrl + '/data/outfit/' + outfitID
            }).then(function(returned) {
                resolve(returned.data.data);
            }, function(error) {
                console.log('Was unable to aquire outfit data from the API!');
                reject(error);
            });
        });
    };

    return factory;
});
