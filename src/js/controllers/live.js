/* jshint esnext: true */
angular.module('glue')

.controller('LiveCtrl', ($scope, $rootScope, $routeParams, $location, Restangular) => {
    $rootScope.ensureUser.then(() => {
        return Restangular.one('snippets', $routeParams.id).get();
    }).then(snippet => {
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        $rootScope.aceConfig.tabSize = $scope.snippet.tabSize || 4;
        $scope.watchUrl = $location.absUrl().replace('live', 's');
    }).catch(function (err) {
        if (err.status == 404) {
            // TODO: better 404 handling
            $scope.snippet = { snippet: 'Snippet not found.' };
        } else if (err.status == 403) {
            $scope.snippet = { snippet: 'You don\'t have access to edit this snippet.' };
        }

        // TODO: catchall error handling
    });

    var updateSnippet = function (snippet, old) {
        if (!snippet || snippet === old || !$scope.snippet.put) return;
        $scope.snippet.put();
    };

    $scope.$watch('snippet.snippet', updateSnippet);
});