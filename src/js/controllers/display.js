/* jshint esnext: true */
angular.module('glue')

.controller('DisplayCtrl', ($scope, $routeParams, themelist, Restangular, $location, SNIPPETS_URI, aceHelper) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $scope.$broadcast('ace:update', snippet.snippet);
    });

    $scope.theme = localStorage.getItem('theme') || 'tomorrow';
    $scope.$watch('theme', (theme) => localStorage.setItem('theme', theme));

    $scope.themes = themelist.themes;

    $scope.rawCode = (id) => {
        window.location.href = `${SNIPPETS_URI}${id}/raw`;
    };

    $scope.fork = (code, mode) => {
        $scope.$broadcast('ace:persist', code, mode);
        $location.path(SNIPPETS_URI);
    };

    var newShortcut = ['command+n', 'ctrl+n'];
    Mousetrap.bind(newShortcut, (event) => {
        $scope.newSnippet();
        // stop all the things!
        return false;
    });

    var forkShortcut = ['command+r', 'ctrl+r'];
    Mousetrap.bind(forkShortcut, (event) => {
        $scope.fork($scope.snippet.snippet, $scope.snippet.language);
        // stop all the things!
        event.preventDefault();
    });

    // unbind Mousetrap on exit
    $scope.$on('$destroy', () => Mousetrap.unbind(newShortcut));
    $scope.$on('$destroy', () => Mousetrap.unbind(forkShortcut));
});