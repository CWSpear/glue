/* jshint esnext: true */

////////////////////////////////////
// Service to hopefully wrap some //
// Sails Sockets in Angular love  //
////////////////////////////////////

angular.module('glue')

.factory('sailsSocket', ($window, $rootScope, $q, debug, API_PREFIX) => {
    var socket = $window.io.socket;

    var deferred = $q.defer();
    socket.on('connect', () => deferred.resolve());

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
    })(debug);

    return {
        connect  : deferred.promise,
        on       : desocketify(socket.on,        socket),
        emit     : desocketify(socket.emit,      socket),
        get      : desocketify(socket.get,       socket, true),
        post     : desocketify(socket.post,      socket, true),
        put      : desocketify(socket.put,       socket, true),
        'delete' : desocketify(socket['delete'], socket, true)
    };

    function desocketify (fn, context, adjustUrl) {
        return function desocketifiedFn() {
            // TODO: passing arguments prevents optimization?
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var args = _.toArray(arguments);
            var cb = args.splice(-1)[0];

            if (adjustUrl && (args[0] || {})[0] !== '/')
                args[0] = API_PREFIX + args[0];

            if (debug) console.log('***', args[0]);

            args.push(function callback(result) {
                if (debug) console.log('***', result);

                // if (debug) console.log('***', 'raw', result);
                var err = result.status ? result : null;
                var res = err ? null : (result.data || result);

                $rootScope.$apply(function () {
                    cb(err, res);
                });
            });

            fn.apply(context, args);
        };
    }

    function denodeify (fn, context) {
        return function denodeifiedFn() {
            // TODO: passing arguments prevents optimization?
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
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