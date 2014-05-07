/* jshint esnext: true */
angular.module('glue')

.controller('AccountCtrl', ($scope, Restangular, request) => {
    $scope.github = () => {
        console.log('test');
        request.get('/account/login/').then(response => {
            console.log(response);
        });
    };
});