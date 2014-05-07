/* jshint esnext: true */
angular.module('glue')

.controller('AccountCtrl', ($scope, Restangular, request, $location) => {
    Restangular.one('users').get().then(user => $scope.user = user);

    $scope.regenerateApiKey = () => {
        var oldKey = $scope.user.apiKey;
        // update in UI "NOW" for "faster UI"
        $scope.user.apiKey = uuid.v4().replace(/-/g, '');
        $scope.user.put().catch(function () {
            // put old key back if this request fails
            $scope.user.apiKey = oldKey;
            // TODO: error message
        });
    };

    $scope.deleteAccount = () => {
        $scope.user.remove().then(function () {
            $location.path('/');
            // TODO: success message
        }, function () {
            console.error('did not delete');
            // TODO: error message
        });
    };
});