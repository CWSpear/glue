/* jshint esnext: true */
angular.module('glue')

.controller('EditCtrl', ($rootScope, $scope, modelist, Restangular, $location, SNIPPETS_URI, aceHelper, flash, storage) => {
    var snippetsModel = Restangular.all('snippets');

    $scope.code = flash('code') || storage('code') || '';
    $rootScope.aceConfig.mode = flash('mode') || storage('mode');
    $scope.$watch('code', code => storage('code', code));
    $scope.$watch('aceConfig.mode', mode => storage('mode', mode));

    // TODO make this configurable
    $rootScope.aceConfig.tabSize = 4;

    $scope.save = () => {
        var language = false, filename = false;
        if ($rootScope.aceConfig.mode) {
            language = $rootScope.aceConfig.mode;
            var ext = modelist.modesByName[language].extensions.split('|')[0];
            filename = `${language}.${ext}`;
        }

        snippetsModel.post({
            snippet: $scope.code,
            // snippets: [$scope.code, $scope.code],
            filename: !filename || filename === 'false' ? '' : filename,
            language: !language || language === 'false' ? '' : language,
            // this is the default user's API key
            apiKey: '872f5f4795204718b2377169e8bd1b4a'
        }).then(snippet => {
            storage.remove('code');
            storage.remove('mode');
            $location.path(`${SNIPPETS_URI}${snippet.id}`);
        });
    };

    $scope.detect = () => {
        $rootScope.aceConfig.mode = aceHelper.detect($scope.code);
    };

    $scope.clear = () => {
        $rootScope.aceConfig.mode = '';
        $scope.code = '';
    };
});