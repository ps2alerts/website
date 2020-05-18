app.service('AnalyticsService', function(
    $rootScope,
    $window,
    $location,
    ConfigDataService
) {
    // Contains all elements that are currently registered
    var factory = {
        registry: []
    };

    // Registers GA Events by a class identifier
    // i.e. registerGAEventClass( $('.ga-event') );
    factory.registerGAEventClass = function(els) {
        // Passes each element to be processed
        $(els).each(function(index, el) {
            factory.registerGAEventSingle(el);
        });
    };

    // Registers a Google Analytics Event with the DOM then adds it to the registry
    factory.registerGAEventSingle = function(el) {
        var registered = $(el).attr('ga-registered');

        // Prevent adding another registration, also checks if the element exists
        if (registered != '1') {;
            var campaign = $(el).attr('ga-campaign');
            var action = $(el).attr('ga-action');
            var label = $(el).attr('ga-label');
            var value = $(el).attr('ga-value');
            var dynamicValue = $(el).attr('ga-dynamic-value');

            // Campaign and actions are required by GA
            if (campaign && action) {
                var options = {
                    hitType: 'event',
                    eventCategory: campaign,
                    eventAction: action
                };
                if (label && label.length > 0) {
                    options.eventLabel = label;
                }

                if (value && value.length > 0) {
                    options.eventValue = value;
                }

                // If we have dynamic values, set up a click event that checks
                // the value of the element every time, otherwise statically
                if (dynamicValue == '1') {
                    $(el).on('click', function() {
                        options.eventValue = $(this).attr('ga-value');
                        if (ConfigDataService.environment === 'production') {
                            ga('send', options);
                        }

                        if (ConfigDataService.environment === 'development') {
                            console.log('Dynamic ga-event:', options);
                        }
                    });
                } else {
                    $(el).on('click', function() {
                        if (ConfigDataService.environment === 'production') {
                            ga('send', options);
                        }

                        if (ConfigDataService.environment === 'development') {
                            console.log('ga-event:', options);
                        }
                    });
                }

                factory.registry.push(el); // Push element to registry
                $(el).attr('ga-registered', 1); // Prevent re-registration
            } else {
                console.log('Discarded');
            }
        }
    };

    if (ConfigDataService.environment === 'production') {
        var track = function() {
            $window.ga('send', 'pageview', {
                page: $location.url()
            });
        };
        $rootScope.$on('$viewContentLoaded', track);

        // Listener for the event. Supplied with a identifier (e.g. '.ga-event')
        $rootScope.$on('ga-sync', function(event, identifier) {
            factory.registerGAEventClass(identifier);
        });
    }
});
