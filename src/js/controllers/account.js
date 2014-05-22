/* jshint esnext: true */
angular.module('glue')

.controller('AccountCtrl', ($scope, $rootScope, request, $location, Restangular) => {
    $scope.regenerateApiKey = () => {
        var oldKey = $rootScope.user.apiKey;
        // update in UI "NOW" for "faster UI"
        $rootScope.user.apiKey = uuid.v4().replace(/-/g, '');
        $rootScope.user.put().catch(() => {
            // put old key back if this request fails
            $rootScope.user.apiKey = oldKey;
            // TODO: error message
        });
    };

    $scope.logout = () => {
        request.get('/logout').then(() => {
            $rootScope.user = {};
            $location.path('/');
        }, () => {
            console.error('did not logout');
            // TODO: error message
        });
    };

    $scope.deleteAccount = () => {
        $rootScope.user.remove().then(() => {
            $rootScope.user = {};
            $location.path('/');
            // TODO: success message
        }, () => {
            console.error('did not delete');
            // TODO: error message
        });
    };
});