/* jshint esnext: true */
angular.module('glue')

.factory('request', ($http) => {
    return {
        get: (url, config) => {
            return $http.get(url, config).then(response => response.data);
        }
    };
});