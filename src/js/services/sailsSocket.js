/* jshint esnext: true */

////////////////////////////////////
// Service to hopefully wrap some //
// Sails Sockets in Angular love  //
////////////////////////////////////

angular.module('glue')

.factory('sailsSocket', ($window, $rootScope, $q, debug) => {
    var socket = $window.io.socket;

    (function(debug) {
        if (!debug) return;

        console.log('***', 'logging all socket interactions');

        var emit = socket.emit;
        socket.emit = function() {
            console.log('***', 'emit', _.toArray(arguments));
            emit.apply(socket, arguments);
        };
        var $emit = socket.$emit;
        socket.$emit = function() {
            console.log('***', 'on', _.toArray(arguments));
            $emit.apply(socket, arguments);
        };
    })(debug && false);

    return {
        on       : desocketify(socket.on,        socket),
        emit     : desocketify(socket.emit,      socket),
        get      : desocketify(socket.get,       socket),
        post     : desocketify(socket.post,      socket),
        put      : desocketify(socket.put,       socket),
        'delete' : desocketify(socket['delete'], socket)
    };

    function desocketify (fn, context) {
        return function desocketifiedFn() {
            // TODO: passing arguments prevents optimization? https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var args = _.toArray(arguments);
            var cb = args.splice(-1)[0];

            args.push(function callback(result) {
                // if (debug) console.log('***', 'raw', result);
                var err = !result.status ? null : result;
                var res = result.data || result;

                $rootScope.$apply(function () {
                    cb(err, res);
                });
            });

            fn.apply(context, args);
        };
    }

    function denodeify (fn, context) {
        return function denodeifiedFn() {
            // TODO: passing arguments prevents optimization? https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var args = _.toArray(arguments);
            var deferred = $q.defer();

            args.push(function callback(err, result) {
                if (err) return deferred.reject(err);
                else return deferred.resolve(result);
            });

            fn.apply(context, args);
            return deferred.promise;
        };
    }
});