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

            loadView('views/github-repositories.html', view, $('.github .repositories'));
        });
    };

    var populateCommits = function() {
        Resume.Github.getCommits(function(commits) {
            var sorted = Resume.Github.getLatestUserCommits(commits);

            var view = {
                commits: sorted.splice(0, 6),
                shortHash: function() {
                    return this.sha.substr(0, 8);
                },
                niceTime: function() {
                    return Resume.Helper.humanReadableTime(new Date(this.commit.author.date));
                }
            };

            loadView('views/recent-commits.html', view, $('.github .commits'));
        });
    };

    var populateGists = function() {
        Resume.Github.getGists(function(gists) {
            var view = {
                gists: gists,
                files_count: function() {
                    var count = 0;

                    for (file in this.files) {
                        count++;
                    }

                    count += (count > 1) ? ' files' : ' file';

                    return count;
                },
                files_array: function() {
                    var files = [];

                    for (file in this.files) {
                        files.push(this.files[file]);
                    }

                    return files;
                }
            };

            loadView('views/gists.html', view, $('.github .gists'));
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
            populateGists();

            Resume.Navigation.build();
        }

    };

}();
