/* jshint esnext: true */
angular.module('glue')

.controller('LiveCtrl', ($scope, $rootScope, $routeParams, $location, Restangular, sailsSocket) => {
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

    var updateSnippet = function (val, old) {
        if (!angular.isDefined(val) || val === old || !$scope.snippet.put) return;
        $scope.snippet.language = $rootScope.aceConfig.mode;
        $scope.snippet.session = {
            cursor: $scope.ace.selection.getCursor()
        };
        
        // $scope.snippet.put();

        var snippet = $scope.snippet.plain();
        sailsSocket.put(`snippets/${snippet.id}`, snippet, function (err, snippet) {
            if (err) console.error(err);
            // we don't really care about the response, but we should add better error handling
        });
    };

    $scope.$watch('snippet.snippet', updateSnippet);
    $scope.$watch('aceConfig.mode', updateSnippet);
});