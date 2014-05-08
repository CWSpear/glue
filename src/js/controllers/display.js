/* jshint esnext: true */
angular.module('glue')

.controller('DisplayCtrl', ($scope, $routeParams, themelist, Restangular, $location, SNIPPETS_URI, aceHelper, flash) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $scope.aceConfig.mode = $scope.snippet.language;
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