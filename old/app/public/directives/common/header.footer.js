app.directive('siteHeader', function() {
    return {
        templateUrl: 'views/common/header.html',
        link: function($scope, elem) {
            elem.ready(function() {
                $scope.$emit('ga-sync', '#header .ga-event');
            });
        }
    };
});

app.directive('siteSearch', function() {
    return {
        templateUrl: 'views/common/search.html',
        link: function($scope, elem) {
            elem.ready(function() {
                $scope.$emit('ga-sync', '#site-search .ga-event');
                $('#search-tab .btn').click(function() {
                    var tab = $('#search-tab');
                    var opened = tab.attr('data-opened');

                    tab.find('i').fadeOut();

                    if (opened == 'open') {
                        tab.attr('data-opened', 'closed');
                        $('#site-search-container').slideUp(function() {
                            tab.find('i').removeClass('fa-arrow-up');
                            tab.find('i').addClass('fa-search');
                            tab.find('i').fadeIn();
                        });
                    } else {
                        tab.attr('data-opened', 'open');

                        $('#site-search-container').slideDown(function() {
                            tab.find('i').removeClass('fa-search');
                            tab.find('i').addClass('fa-arrow-up');
                            tab.find('i').fadeIn();
                        });
                    }
                });
            });
        }
    };
});
