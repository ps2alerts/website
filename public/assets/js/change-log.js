var storage = window.localStorage;
var unseenCount = 0;
var unseenIds = [];
var now = parseInt(new Date().getTime() / 1000);
var deadline = now - 2592000; // Now - 30 days in miliseconds

var updates = {
    1: {
        id: 1,
        title: 'New updates notification system!',
        timestamp: 1500840000,
        snippet: 'I\'ve created a new way to notify people of changes to the website! Tradittionally this has just been shoved on the homepage and annoyed practically everyone, it\'s now neatly placed within a notification!',
        type: 'feature'
    }
};

// Set up the storage key for later use if not already defined
if (!storage.updatesSeen) {
    storage.setItem('updatesSeen', false);
}

function run() {
    unseenCount = 0;
    _.forEach(updates, function(obj) {
        /* If update has not been seen and was less than 3 months ago (to prevent every
        update showing) */

        if (storage.updatesSeen.indexOf(obj.id) === -1 && obj.timestamp > deadline) {
            unseenCount++;
        }
    });

    var badge = $('#changelog-badge-count');
    if (unseenCount > 0) {
        badge.addClass('hasCount').html(unseenCount);
    } else {
        if (badge.hasClass('hasCount')) {
            badge.removeClass('hasCount').addClass('clearCount').html('');
        }
    }
}

$(window).on('viewLoaded', function() {
    run();

    $('#changelog-badge').click(function() {
        storage.setItem('updatesSeen', parseInt(new Date().getTime() / 1000));

        // Run again so the total is wiped and set correctly
        run();
    });
});
