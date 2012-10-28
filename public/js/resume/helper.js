/**
 * Resume Helper
 *
 * @author  Joseph Wynn <joseph@wildlyinaccurate.com>
 */
Resume.Helper = function() {

    return {

        formatUrl: function(url) {
            if (url && url.match(/https?:\/\//i) === null) {
                url = 'http://' + url;
            }

            return url;
        },

        humanReadableTime: function(date) {
            var delta = Math.round((+new Date - date) / 1000);

            var minute = 60,
                hour = minute * 60,
                day = hour * 24,
                week = day * 7,
                month = day * 30,
                year = day * 365;

            var fuzzy;

            if (delta < 30) {
                fuzzy = 'just now';
            } else if (delta < minute) {
                fuzzy = delta + ' seconds ago';
            } else if (delta < 2 * minute) {
                fuzzy = 'a minute ago';
            } else if (delta < hour) {
                fuzzy = Math.floor(delta / minute) + ' minutes ago';
            } else if (Math.floor(delta / hour) === 1) {
                fuzzy = 'an hour ago';
            } else if (delta < day) {
                fuzzy = Math.floor(delta / hour) + ' hours ago';
            } else if (delta < day * 2) {
                fuzzy = 'yesterday';
            } else if (delta < week) {
                fuzzy = Math.floor(delta / day) + ' days ago';
            } else if (Math.floor(delta / week) === 1) {
                fuzzy = 'a week ago';
            } else if (delta < month) {
                fuzzy = Math.floor(delta / week) + ' weeks ago';
            } else if (Math.floor(delta / month) === 1) {
                fuzzy = 'a month ago';
            } else if (delta < year) {
                fuzzy = Math.floor(delta / month) + ' months ago';
            } else if (Math.floor(delta / year) === 1) {
                fuzzy = 'a year ago';
            } else {
                fuzzy = 'over a year ago';
            }

            return fuzzy;
        }

    };

}();
