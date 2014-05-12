/* jshint esnext: true */
angular.module('glue')

.controller('DisplayCtrl', ($scope, $rootScope, $routeParams, themelist, Restangular, $location, SNIPPETS_URI, aceHelper, flash) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        $rootScope.aceConfig.tabSize = $scope.snippet.tabSize || 4;
    }).catch(function (err) {
        if (err.status == 404) {
            // TODO: better 404 handling
            $scope.snippet = { snippet: 'Snippet not found.' };
        }

        // TODO: catchall error handling
    });

    $scope.rawCode = (id) => {
        window.location.href = `${SNIPPETS_URI}${id}/raw`;
    };

    $scope.fork = (code, mode) => {
        flash('code', code);
        flash('mode', mode);
        $location.path(SNIPPETS_URI);
    };
});