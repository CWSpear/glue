/* jshint esnext: true */
angular.module('glue')

.controller('AccountCtrl', ($scope, Restangular, request) => {
    // Restangular.one('users').get().then(user => {
    //     console.log('user', user);
    // });

    request.get('/api/users').then(user => {
        console.log('user', user);
    });
});