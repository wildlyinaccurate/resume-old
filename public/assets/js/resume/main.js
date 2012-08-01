/**
 * Main
 *
 * @author  Joseph Wynn <joseph@wildlyinaccurate.com>
 */
Resume = function() {

    var loadView = function(url, view_data, container) {
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(template) {
                container.append(Mustache.to_html(template, view_data))
                         .fadeIn();
            }
        });
    };

    var loadAvatar = function() {
        Resume.Github.getUserInfo(function(info) {
            var avatar = $(document.createElement('img')).attr({ src: info.avatar_url });

            $('#avatar').append(avatar);
        });
    };

    var populateRepositories = function() {
        Resume.Github.getRepositories(function(repositories) {
            var sorted = Resume.Github.sortRepositoriesByPopularity(repositories);

            var view = {
                repositories: sorted
            };

            loadView('views/github-repositories.html', view, $('#github-repositories'));
        });
    };

    var populateCommits = function() {
        Resume.Github.getCommits(function(commits) {
            var sorted = Resume.Github.getLatestUserCommits(commits);

            var view = {
                commits: sorted.splice(0, 10),
                shortHash: function() {
                    return this.sha.substr(0, 8);
                },
                niceTime: function() {
                    return Resume.Helper.humanReadableTime(new Date(this.commit.author.date));
                }
            };

            loadView('views/recent-commits.html', view, $('#recent-commits'));
        });
    };

    return {

        init: function() {
            Resume.Github.setUsername('wildlyinaccurate');

            Resume.Event.once('github.repositories::loaded', function() {
                populateCommits();
            });

            loadAvatar();
            populateRepositories();

            Resume.Navigation.build();
        }

    };

}();
