app.controller('HomeNoticeController', function($cookies, $scope) {
    $scope.hidden = false;

    var announcementName = '2016-06-19';
    var cookieKey = 'announcement-' + announcementName;

    var cookie = $cookies.get(cookieKey);

    if (typeof cookie === 'string' && cookie == 'true') {
        $scope.hidden = true;
    }

    $scope.hide = function() {
        var expires = new Date('2020-01-01');
        $('#announcement-more').slideUp(function() {
            $scope.hidden = true;
            $scope.$apply();
        });
        $cookies.put(cookieKey, true, {
            path: '/',
            expires: expires
        });
    };

    $scope.show = function() {
        $cookies.remove(cookieKey);
        $('#announcement-more').show();
        $scope.hidden = false;
    };
});
