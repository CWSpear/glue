/* jshint esnext: true */
angular.module('glue', ['restangular', 'ngRoute'])

.constant('SNIPPETS_URI', '/s/')
.constant('VIEWS_URI',    '/views/')

.config(($httpProvider, RestangularProvider, $routeProvider, VIEWS_URI, $locationProvider, debug) => {
    RestangularProvider.setBaseUrl('/api');
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        controller: 'EditCtrl',
        templateUrl: `${VIEWS_URI}edit.html`,
    }).when('/s/:id', {
        controller: 'DisplayCtrl',
        templateUrl: `${VIEWS_URI}display.html`,
    }).when('/account/', {
        controller: 'AccountCtrl',
        templateUrl: `${VIEWS_URI}account.html`,
    }).otherwise({ redirectTo: '/' });

    if (debug) {
        var loc = window.location, url = loc.protocol + '//' + loc.hostname,
            socketScript = document.createElement('script'),
            browserSyncScript = document.createElement('script'),
            connectScript = document.createElement('script'),
            body = document.body;

        socketScript.src = url + ':3000/socket.io/socket.io.js';
        connectScript.innerHTML = "var ___socket___ = io.connect('" + url + ":3000');";
        browserSyncScript.src = url + ':3001/client/browser-sync-client.js';

        body.insertBefore(socketScript, null);

        socketScript.onload = function () {
            body.insertBefore(connectScript, null);
            body.insertBefore(browserSyncScript, null);
        };
    }
});