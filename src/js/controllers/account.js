/* jshint esnext: true */
angular.module('glue')

.controller('AccountCtrl', ($scope, Restangular, request) => {
    Restangular.one('users').get().then(user => $scope.user = user);
});