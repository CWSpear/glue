angular.module('snippets', ['restangular'])

.config(function ($httpProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
})

.directive('editor', function (modelist) {
    return {
        scope: { editor: '=', theme: '=', mode: '=', code: '=' },
        link: function (scope, elem, attrs) {
            scope.editor = ace.edit(elem[0]);
            scope.theme = scope.theme || 'tomorrow';

            var modeObj = modelist.getModeForPath('nameDoesntMatter.' + scope.mode);
            if (modeObj.name != 'text') {
                scope.mode = modeObj.name;
            }

            setTheme(scope.theme);
            setMode(scope.mode);

            scope.$watch('theme', setTheme);
            scope.$watch('mode', setMode);

            var edit = attrs.edit !== 'false';

            if (scope.editor.getSession().getValue() === '') {
                var code = localStorage.getItem('code') || '';
                scope.editor.getSession().setValue(code);
                scope.code = code;
            }

            var saveCodeLocally = _.throttle(function (code) {
                localStorage.setItem('code', scope.code);
                console.log('[Saved in localStorage]');
            }, 10 * 1000);

            scope.editor.getSession().on('change', function  () {
                scope.$apply(function () {
                    scope.code = scope.editor.getSession().getValue();
                });

                saveCodeLocally(angular.copy(scope.code));
            });

            if (!edit) {
                scope.editor.setReadOnly(true);
                scope.editor.setHighlightActiveLine(false);
                scope.editor.setHighlightGutterLine(false);
                // scope.editor.gotoLine(1000);

                // turn off linting
                scope.editor.session.setOption("useWorker", false);
            }

            function setTheme(theme) {
                if (!theme) return;
                scope.editor.setTheme('ace/theme/' + theme);
            }

            function setMode(mode) {
                if (!mode) return;
                scope.editor.getSession().setMode({ path: 'ace/mode/' + mode, inline: true });
            }
        }
    };
})

.factory('modelist', function () {
    var modelist = ace.require('ace/ext/modelist');
    return modelist;
})
.factory('themelist', function () {
    var themelist = ace.require('ace/ext/themelist');
    return themelist;
})

.controller('MainCtrl', function ($scope, modelist, themelist, Restangular) {
    var snippetsModel = Restangular.all('snippets');

    $scope.theme = localStorage.getItem('theme') || 'tomorrow';
    $scope.$watch('theme', function (theme) {
        localStorage.setItem('theme', theme);
    });

    $scope.modes = modelist.modes;
    $scope.themes = themelist.themes;

    $scope.code = '';
    $scope.save = function () {
        if (!$scope.mode) $scope.detect();
        var name = $scope.mode;
        var ext = modelist.modesByName[name].extensions.split('|')[0];

        snippetsModel.post({
            snippet: $scope.code,
            // snippets: [$scope.code, $scope.code],
            filename: name + '.' + ext,
            language: $scope.mode,
            favorite_color: $scope.favorite_color,
        }).then(function (snippet) {
            localStorage.setItem('code', '');
            location.href = '/snippets/' + snippet.id;
        });
    };

    $scope.detect = function () {
        $scope.mode = 'javascript';
        return;
        $scope.mode = hljs.highlightAuto($scope.code).language;
        console.log('autodetect', hljs.highlightAuto($scope.code));
        // $http.post('/snippets/?detect=1', { code: $scope.code }).then(function (result) {
        //     var mode = result.data[0];
        //     console.log(mode);
        //     var modeObj = modelist.getModeForPath(mode);
        //     $scope.mode = modeObj.name;
        // });
    };
});