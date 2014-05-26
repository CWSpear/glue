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

    if (debug) {
        console.log('***', 'logging all socket interactions');

        var emit = socket.emit;
        socket.emit = (...args) => {
            console.log('***', 'emit', args);
            emit.apply(socket, args);
        };
        var $emit = socket.$emit;
        socket.$emit = (...args) => {
            console.log('***', 'on', args);
            $emit.apply(socket, args);
        };
    }

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
        return function desocketifiedFn(...args) {

            var cb = args.splice(-1)[0];

            if (adjustUrl && (args[0] || {})[0] !== '/')
                args[0] = API_PREFIX + args[0];

            if (debug) console.log('***', args[0]);

            args.push(function callback(result) {
                if (debug) console.log('***', 'raw', result);
                var err = result.status ? result : null;
                var res = err ? null : (result.data || result);

                $rootScope.$apply(() => cb(err, res));
            });

            fn.apply(context, args);
        };
    }

    function denodeify (fn, context) {
        return function denodeifiedFn(...args) {
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