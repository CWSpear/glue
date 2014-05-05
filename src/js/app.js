/* jshint esnext: true */
angular.module('snippets', ['restangular', 'ngRoute'])

.constant('SNIPPETS_URI', '/s/')
.constant('VIEWS_URI',    '/views/')

.config(($httpProvider, RestangularProvider, $routeProvider, VIEWS_URI) => {
    RestangularProvider.setBaseUrl('/api');
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $routeProvider.when('/', {
        controller: 'EditCtrl',
        templateUrl: `${VIEWS_URI}edit.html`,
    }).when('/s/:id', {
        controller: 'DisplayCtrl',
        templateUrl: `${VIEWS_URI}display.html`,
    });
});