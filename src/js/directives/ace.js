/* jshint esnext: true */
angular.module('glue')

.directive('editor', (modelist, $timeout) => {
    // this first line is supposed to replace the next 3
    // but it wasn't working for me unless I did all 3
    // ace.config.set('basePath', '/js/ace/');

    ace.config.set('themePath', '/js/ace/');
    ace.config.set('modePath', '/js/ace/');
    ace.config.set('workerPath', '/js/ace/');

    return {
        scope: { editor: '=', theme: '=', mode: '=', code: '=' },
        link: (scope, elem, attrs) => {
            scope.editor = ace.edit(elem[0]);
            scope.theme = scope.theme || 'tomorrow';

            var modeObj = modelist.getModeForPath(`nameDoesntMatter.${scope.mode}`);
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
                var mode = localStorage.getItem('mode') || '';
                scope.editor.getSession().setValue(code);
                scope.code = code;
                scope.mode = mode;
            }

            var saveCodeLocally = (codeToSave) => {
                localStorage.setItem('code', codeToSave);
                saveModeLocally(scope.mode);
            };
            var canSaveThrottled = true;
            var saveCodeLocallyThrottled = _.throttle(() => {
                if (!canSaveThrottled) return;
                $timeout(() => {
                    scope.code = scope.editor.getSession().getValue();
                    saveCodeLocally(angular.copy(scope.code), scope.mode);
                });
            }, 3 * 1000);

            var saveModeLocally = (modeToSave) => {
                localStorage.setItem('mode', modeToSave);
            };

            if (!scope.code) {
                saveModeLocally(scope.mode = '');
            }

            scope.editor.getSession().on('change', function  () {
                if (!edit) return;
                saveCodeLocallyThrottled();
            });

            if (!edit) {
                scope.editor.setReadOnly(true);
                scope.editor.setHighlightActiveLine(false);
                scope.editor.setHighlightGutterLine(false);

                // turn off linting
                scope.editor.session.setOption("useWorker", false);
            }


            scope.$on('ace:update', (event, newCode) => scope.editor.getSession().setValue(newCode));
            scope.$on('ace:persist', (event, persitCode, persistMode) => { 
                saveCodeLocally(persitCode);
                saveModeLocally(persistMode);
            });
            scope.$on('ace:save', (event) => { 
                canSaveThrottled = false;
                saveCodeLocally('');
                saveModeLocally('');
            });
            scope.$on('ace:code', (event) => scope.code = scope.editor.getSession().getValue());
            scope.$on('ace:clear', (event) => {
                saveCodeLocally('');
                saveModeLocally('');
            });


            // valid (of course)
            function setTheme(theme) {
                if (!theme) return;
                scope.editor.setTheme(`ace/theme/${theme}`);
            }

            function setMode(mode) {
                if (!mode) return;
                saveModeLocally(mode);
                scope.editor.getSession().setMode({ path: `ace/mode/${mode}`, inline: true });
            }
        }
    };
})

// these are so closly related, I feel like they can go here
.factory('modelist', () => {
    var modelist = ace.require('ace/ext/modelist');
    return modelist;
})

.factory('themelist', () => {
    var themelist = ace.require('ace/ext/themelist');
    return themelist;
});