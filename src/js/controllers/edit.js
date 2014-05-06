/* jshint esnext: true */
angular.module('glue')

.controller('EditCtrl', ($rootScope, $scope, modelist, themelist, Restangular, $location, SNIPPETS_URI, aceHelper) => {
    var snippetsModel = Restangular.all('snippets');

    $scope.theme = localStorage.getItem('theme') || 'tomorrow';
    $scope.$watch('theme', theme => localStorage.setItem('theme', theme));

    $scope.modes = modelist.modes;
    $scope.themes = themelist.themes;

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
            $scope.$broadcast('ace:save');
            $location.path(`${SNIPPETS_URI}${snippet.id}`);
        });
    };

    $scope.detect = () => {
        $scope.mode = aceHelper.detect($scope.code);
    };

    $scope.clear = () => {
        $scope.mode = '';
        $scope.$broadcast('ace:clear');
    };

    // save on cmd-S
    var saveShortcut = ['command+s', 'ctrl+s'];
    Mousetrap.bind(saveShortcut, (event) => {
        $scope.save();
        // stop all the things!
        return false;
    });

    // unbind Mousetrap on exit
    $scope.$on('$destroy', () => Mousetrap.unbind(saveShortcut));
});