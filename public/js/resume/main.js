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
            var avatar = $(document.createElement('img')).attr('src', info.avatar_url);

            $('#avatar').append(avatar);
        });
    };

    var populateRepositories = function() {
        Resume.Github.getRepositories(function(repositories) {
            var my_repositories = [];
            var forked_repositories = [];
            var i = repositories.length;

            while (i--) {
                if (repositories[i].fork !== false) {
                    forked_repositories.push(repositories[i]);
                } else {
                    my_repositories.push(repositories[i])
                }
            }

            var view = {
                my_repositories: Resume.Github.sortRepositoriesByPopularity(my_repositories),
                forked_repositories: Resume.Github.sortRepositoriesByLastCommit(forked_repositories),
                homepageLink: function() {
                    if (this.homepage !== '') {
                        return ' &ndash; <a href="' + this.homepage + '">' + this.homepage + '</a>';
                    }
                },
                lastCommitTime: function() {
                    return Resume.Helper.humanReadableTime(new Date(this.pushed_at));
                }
            };

            loadView('views/github-repositories.html', view, $('.github .repositories'));
        });
    };

    var populateCommits = function() {
        Resume.Github.getCommits(function(commits) {
            var sorted = Resume.Github.getLatestUserCommits(commits);

            var view = {
                commits: sorted.splice(0, 8),
                shortHash: function() {
                    return this.sha.substr(0, 8);
                },
                niceTime: function() {
                    return Resume.Helper.humanReadableTime(new Date(this.commit.committer.date));
                }
            };

            loadView('views/recent-commits.html', view, $('.github .commits'));
        });
    };

    var populateGists = function() {
        Resume.Github.getGists(function(gists) {
            var view = {
                gists: gists,
                filesCount: function() {
                    var count = 0;

                    for (file in this.files) {
                        count++;
                    }

                    count += (count > 1) ? ' files' : ' file';

                    return count;
                },
                languages: function() {
                    var languages = {};
                    var total = 0;
                    var file;

                    for (var n in this.files) {
                        file = this.files[n];
                        total++;

                        languages[file.language] = (languages[file.language] || 0) + 1;
                    }

                    var output = [];
                    var share;

                    for (var language in languages) {
                        share = Math.floor(languages[language] / total * 100);

                        if (share === 100) {
                            output.push(language);
                        } else {
                            output.push(language + ' (' + share + '%)');
                        }
                    }

                    return output.join(', ');
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

            $('.github').on('click', '.more-repositories, .less-repositories', function(event) {
                $('.github .forked-repositories').toggle('slow');
                $('.github').find('.more-repositories, .less-repositories').toggle();
                event.preventDefault();
            });
        }

    };

}();
