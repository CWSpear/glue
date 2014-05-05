/* jshint esnext: true */
angular.module('snippets')

.controller('DisplayCtrl', ($scope, $routeParams, themelist, Restangular, $location, SNIPPETS_URI, aceHelper) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $scope.$broadcast('ace:updateCode', snippet.snippet);
    });

    $scope.theme = localStorage.getItem('theme') || 'tomorrow';
    $scope.$watch('theme', (theme) => localStorage.setItem('theme', theme));

    $scope.themes = themelist.themes;
});