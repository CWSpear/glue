/* jshint esnext: true */
angular.module('glue', ['restangular', 'ngRoute', 'ui.ace'])

.constant('SNIPPETS_URI', '/s/')
.constant('VIEWS_URI',    '/views/')
.constant('PARTIALS_URI', '/views/partials/')
.constant('API_PREFIX',   '/api/')

.constant('storagePrefix', 'glue')

.factory('modelist',  () => ace.require('ace/ext/modelist'))
.factory('themelist', () => ace.require('ace/ext/themelist'))

.config(($httpProvider, RestangularProvider, $routeProvider, VIEWS_URI, $locationProvider, debug, API_PREFIX) => {
    RestangularProvider.setBaseUrl(API_PREFIX.replace(/\/$/, ''));
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
    }).when('/live/:id', {
        controller: 'LiveCtrl',
        templateUrl: `${VIEWS_URI}live.html`,
    }).when('/account/', {
        controller: 'AccountCtrl',
        templateUrl: `${VIEWS_URI}account.html`,
    }).otherwise({ redirectTo: '/' });
})

.run(($rootScope, PARTIALS_URI, Restangular, modelist, themelist, storage) => {
    $rootScope.aceConfig = {
        theme: storage('theme') || 'tomorrow',
        mode: null,
    };

    $rootScope.$watch('aceConfig.theme', theme => storage('theme', theme));

    $rootScope.modes  = modelist.modes;
    $rootScope.themes = themelist.themes;

    $rootScope.ensureUser = Restangular.one('users').get().then(user => $rootScope.user = user);
    $rootScope.footerPartial = `${PARTIALS_URI}footer.html`;
});