/**
 * Github API
 *
 * @author  Joseph Wynn <joseph@wildlyinaccurate.com>
 */
Resume.Github = function() {

    var self = this;

    self.username = '';
    self.repositories = [];
    self.commits = [];

    // Keep track of which repositories we've retrieved commits for
    self.repositoryCommitsRetrieved = [];

    self.sortByPopularity = function(a, b) {
        return b.popularity - a.popularity;
    };

    self.sortByDate = function(a, b) {
        var dateA = new Date(a.commit.author.date);
        var dateB = new Date(b.commit.author.date);

        return dateB - dateA;
    };

    return {

        setUsername: function(username) {
            self.username = username;
        },

        getUserInfo: function(callback) {
            $.getJSON('https://api.github.com/users/' + self.username + '?callback=?', function(info) {
                callback(info.data);
            });
        },

        getRepositories: function(callback, page, previous_data) {
            if (self.repositories.length > 0) {
                // Repositories have already been retrieved from the API
                return callback(self.repositories);
            }

            var page = page || 1,
                data = previous_data || [];

            $.getJSON('https://api.github.com/users/' + self.username + '/repos?page=' + page + '&callback=?', function(repositories) {
                data = data.concat(repositories.data);

                if (repositories.data.length > 0) {
                    Resume.Github.getRepositories(callback, page + 1, data);
                } else {
                    self.repositories = data;

                    Resume.Event.fire('github.repositories::loaded');
                    callback(self.repositories);
                }
            });
        },

        getCommits: function(callback) {
            var repository_count = self.repositories.length;

            if (repository_count > 0 && self.repositoryCommitsRetrieved.length === repository_count) {
                return callback(self.commits);
            }

            Resume.Github.getRepositories(function(repositories) {
                var i = self.repositories.length;
                var repository;

                while (i--) {
                    repository = self.repositories[i];

                    $.getJSON('https://api.github.com/repos/' + self.username + '/' + repository.name + '/commits?callback=?', function(commits) {
                        self.repositoryCommitsRetrieved.push(repository.name);
                        self.commits = self.commits.concat(commits.data);

                        if (self.repositoryCommitsRetrieved.length === repository_count) {
                            Resume.Event.fire('github.commits::loaded');
                            callback(self.commits);
                        }
                    });
                }
            });
        },

        sortRepositoriesByPopularity: function(repositories) {
            var sorted = [];
            var repository;
            var popularity;
            var i = repositories.length;

            while (i--) {
                repository = repositories[i];

                if (repository.fork !== false) {
                    continue;
                }

                popularity = repository.watchers + repository.forks;

                sorted.unshift({
                    position: i,
                    popularity: popularity,
                    repository: repository
                });
            }

            return sorted.sort(self.sortByPopularity);
        },

        getLatestUserCommits: function(commits) {
            var user_commits = [];
            var commit;
            var i = commits.length;

            while (i--) {
                commit = commits[i];

                if (commit.author !== null && commit.author.login === self.username) {
                    user_commits.push(commit);
                }
            }

            return user_commits.sort(self.sortByDate);
        }

    };

}();
