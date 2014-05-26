/* jshint esnext: true */
angular.module('glue')

.controller('DisplayCtrl', ($scope, $rootScope, $routeParams, themelist, sailsSocket, Restangular, $location, SNIPPETS_URI, aceHelper, flash, $timeout) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        $rootScope.aceConfig.tabSize = $scope.snippet.tabSize || 4;
    }).catch((err) => {
        if (err.status == 404) {
            // TODO: better 404 handling
            $scope.snippet = { snippet: 'Snippet not found.' };
        }

        // TODO: catchall error handling
    });

    // subscribe to a snippet's model's changes
    sailsSocket.get(`snippets/${$routeParams.id}/subscribe`, (err, response) => {
        if (err) return console.error(err);
        // console.log(response);
    });

    // once subscribed, we will get notifications of updates
    sailsSocket.on('snippet', (err, { deltas, settings }) => {
        if (err) return console.error(err);

        $scope.liveEditingSession = true;

        if (deltas) {
            $scope.ace.session.getDocument().applyDeltas(deltas);
            cursor = (_.last(deltas).range || {}).end;
            if ($scope.followCursor)
                setTimeout(() => $scope.jumpToCursor());
        } else if (settings) {
            $timeout(() => $rootScope.aceConfig.mode = settings.language);
        } else {
            console.err(deltas, settings);
        }
    });

    var cursor;
    $scope.jumpToCursor = () => {
        $scope.ace.scrollToLine(cursor.row, true, true);
        $scope.ace.selection.moveCursorToPosition(cursor);
    };

    $scope.rawCode = (id) => window.location.href = `${SNIPPETS_URI}${id}/raw`;

    $scope.fork = (code, mode) => {
        flash('code', code);
        flash('mode', mode);
        $location.path(SNIPPETS_URI);
    };
});