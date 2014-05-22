/* jshint esnext: true */
angular.module('glue')

.controller('DisplayCtrl', ($scope, $rootScope, $routeParams, themelist, sailsSocket, Restangular, $location, SNIPPETS_URI, aceHelper, flash, $timeout) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        $rootScope.aceConfig.tabSize = $scope.snippet.tabSize || 4;
    }).catch(function (err) {
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
    var session;
    sailsSocket.on('snippet', (err, snippet) => {
        if (err) return console.error(err);

        $scope.liveEditingSession = true;
        session = (snippet || {}).session || {};

        // console.log($scope.snippet.language);
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        console.log('language', $scope.snippet.language);

        if ($scope.followCursor)
            setTimeout(() => $scope.jumpToCursor(snippet.cursor));
    });

    $scope.jumpToCursor = (cur) => {
        var cursor = cur || session.cursor || {};
        $scope.ace.scrollToLine(cursor.row, true, true);
        // $scope.ace.selection.moveCursorTo(cursor.row + 15, cursor.column);
    };

    $scope.rawCode = (id) => {
        window.location.href = `${SNIPPETS_URI}${id}/raw`;
    };

    $scope.fork = (code, mode) => {
        flash('code', code);
        flash('mode', mode);
        $location.path(SNIPPETS_URI);
    };
});