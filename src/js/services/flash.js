/* jshint esnext: true */

/////////////////////////////////
// Simple service to make      //
// things only last until the  //
// next time they are called   //
/////////////////////////////////

angular.module('glue')

.factory('flash', () => {
    var flash = {};
    return (key, value) => {
        if (value === undefined) {
            var ret = flash[key] || false;
            delete flash[key];
            return ret;
        }
        flash[key] = value;
    };
});