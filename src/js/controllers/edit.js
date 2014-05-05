/* jshint esnext: true */
angular.module('snippets')

.controller('EditCtrl', ($scope, modelist, themelist, Restangular, $location, SNIPPETS_URI, aceHelper) => {
    var snippetsModel = Restangular.all('snippets');

    $scope.theme = localStorage.getItem('theme') || 'tomorrow';
    $scope.$watch('theme', theme => localStorage.setItem('theme', theme));

    $scope.modes = modelist.modes;
    $scope.themes = themelist.themes;

    $scope.code = '';
    $scope.save = () => {
        if (!$scope.mode) $scope.mode = aceHelper.detect($scope.code);
        var name = $scope.mode;
        var ext = modelist.modesByName[name].extensions.split('|')[0];

        snippetsModel.post({
            snippet: $scope.code,
            // snippets: [$scope.code, $scope.code],
            filename: `${name}.${ext}`,
            language: $scope.mode,
            favorite_color: $scope.favorite_color,
        }).then(snippet => {
            localStorage.setItem('code', '');
            $location.path(`${SNIPPETS_URI}${snippet.id}`);
        });
    };

    $scope.detect = () => {
        $scope.mode = aceHelper.detect($scope.code);
    };
});