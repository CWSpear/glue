/* jshint esnext: true */
angular.module('glue')

.controller('LiveCtrl', ($scope, $rootScope, $routeParams, $location, Restangular, sailsSocket, debug, $timeout) => {
    $scope.snippet = { id: $routeParams.id };
    Restangular.one('snippets', $routeParams.id).get().then(snippet => {
        $scope.snippet = snippet;
        $rootScope.aceConfig.mode = $scope.snippet.language;
        $rootScope.aceConfig.tabSize = $scope.snippet.tabSize || 4;
        $scope.watchUrl = $location.absUrl().replace('live', 's');
    }).catch((err) => {
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

    var disableOnChange = false;
    $rootScope.aceConfig.onLoad = _.once(() => {
        $scope.ace.on('change', ({ data: delta }) => {
            if (disableOnChange)  {
                disableOnChange = false;
                return;
            }

            sendPayload({
                // mmm, real magic
                deltas: [delta]
            });
        });
    });

    // queue deltas until we are connected to sockets
    var queuedPayload = { deltas: [] };
    var sendPayload = ({ settings, deltas }) => {
        if (settings) 
            queuedPayload.settings = settings;
        if (deltas)
            queuedPayload.deltas.concat(deltas);
    };

    sailsSocket.connect.then(() => {
        if (debug) console.log('connected');
        // once we're connected to sockets, change function and send queued payload
        sendPayload = (payload) => {
            sailsSocket.post(`snippets/${$scope.snippet.id}/notify`, payload, function (err, payload) {
                if (err) console.error(err);
                // we don't really care about the response, but we should add better error handling
            });
        };

        sendPayload(queuedPayload);
    });

    var cursor;

    // subscribe to a snippet's model's changes
    sailsSocket.get(`snippets/${$routeParams.id}/subscribe`, (err, response) => {
        if (err) return console.error(err);
        // console.log(response);
    });

    // once subscribed, we will get notifications of updates
    sailsSocket.on('snippet', (err, { deltas, settings, socketId }) => {
        if (err) return console.error(err);

        $scope.liveEditingSession = true;

        if (deltas) {
            disableOnChange = true;
            $scope.ace.session.getDocument().applyDeltas(deltas);
        } else if (settings) {
            $timeout(() => $rootScope.aceConfig.mode = settings.language);
        } else {
            console.err(deltas, settings);
        }
    });

    $scope.$watch('snippet.snippet', updateSnippet);
    $scope.$watch('aceConfig.mode', (language) => {
        sendPayload({ settings: { language } });
        updateSnippet();
    });
});