/* jshint esnext: true */
angular.module('glue')

.controller('EditCtrl', ($rootScope, $scope, modelist, themelist, Restangular, $location, SNIPPETS_URI, aceHelper, $timeout) => {
    var snippetsModel = Restangular.all('snippets');

    $scope.theme = localStorage.getItem('theme') || 'tomorrow';
    $scope.$watch('theme', theme => localStorage.setItem('theme', theme));

    $scope.modes = modelist.modes;
    $scope.themes = themelist.themes;

    $scope.save = () => {
        $scope.$broadcast('ace:code');

        $timeout(() => {
            var language = false, filename = false;
            if ($scope.mode) {
                language = $scope.mode;
                var ext = modelist.modesByName[language].extensions.split('|')[0];
                filename = `${language}.${ext}`;
            }

            snippetsModel.post({
                snippet: $scope.code,
                // snippets: [$scope.code, $scope.code],
                filename: filename,
                language: language,
                apiKey: '872f5f4795204718b2377169e8bd1b4a'
            }).then(snippet => {
                $scope.$broadcast('ace:save');
                $location.path(`${SNIPPETS_URI}${snippet.id}`);
            });
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
    // var saveShortcut = ['command+s', 'ctrl+s'];
    // Mousetrap.bind(saveShortcut, (event) => {
    //     $scope.save();
    //     // stop all the things!
    //     return false;
    // });

    // // unbind Mousetrap on exit
    // $scope.$on('$destroy', () => Mousetrap.unbind(saveShortcut));
});