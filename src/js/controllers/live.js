/* jshint esnext: true */
angular.module('glue')

.controller('LiveCtrl', ($scope, $rootScope, $routeParams, $location, Restangular, sailsSocket) => {
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        $rootScope.aceConfig.tabSize = $scope.snippet.tabSize || 4;
        $scope.watchUrl = $location.absUrl().replace('live', 's');
    }).catch(function (err) {
        if (err.status == 404) {
            // TODO: better 404 handling
            $scope.snippet = { snippet: 'Snippet not found.' };
        } else if (err.status == 403) {
            $scope.snippet = { snippet: 'You don\'t have access to edit this snippet.' };
        }

        // TODO: catchall error handling
    });

    var updateSnippet = _.throttle(() => {
        if (!($scope.snippet || {}).put) return;
        $scope.snippet.language = $rootScope.aceConfig.mode;
        $scope.snippet.put();
    }, 500);

    $rootScope.aceConfig.onLoad = _.once(() => {
        $scope.ace.on('change', (event) => {
            sendPayload({
                // mmm, real magic
                deltas: [event.data]
            });
        });
    });

    // queue deltas until we are connected to sockets
    var queuedPayload = { deltas: [] };
    var sendPayload = (payload) => {
        if (payload.settings) 
            queuedPayload.settings = payload.settings;
        if (payload.deltas)
            queuedPayload.deltas.concat(payload.deltas);
    };

    sailsSocket.connect.then(() => {
        // once we're connected to sockets, change function and send queued payload
        sendPayload = (payload) => {
            sailsSocket.post(`snippets/${$scope.snippet.id}/notify`, payload, function (err, payload) {
                if (err) console.error(err);
                // we don't really care about the response, but we should add better error handling
            });
        };

        sendPayload(queuedPayload);
    });

    $scope.$watch('snippet.snippet', updateSnippet);
    $scope.$watch('aceConfig.mode', (language) => {
        sendPayload({ settings: { language } });
        updateSnippet();
    });
});