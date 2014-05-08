/* jshint esnext: true */

////////////////////////////////
// Simple service to wrap     //
// localStorage in JSON stuff //
////////////////////////////////

angular.module('glue')

.factory('storage', (storagePrefix) => {
    var storage = (key, value) => {
        key = `${storagePrefix}.${key}`;

        if (value === null) return localStorage.removeItem(key);

        if (value === undefined) {
            value = localStorage.getItem(key);
            return JSON.parse(value);
        }

        value = JSON.stringify(value);
        return localStorage.setItem(key, value);
    };

    storage.get    = (key) => storage(key);
    storage.set    = (key, value) => storage(key, value);
    storage.remove = (key) => storage(key, null);

    return storage;
});