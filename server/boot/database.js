import getDebugger from 'debug';

var debug = getDebugger('boot/database');

export default function (app) {
    const dataSource = app.datasources['pg'];
    var models = ['paste', 'User'];

    dataSource.connector.execute('CREATE DATABASE glue', (err) => {
        //hack because postgres doesn't support CREATE DATABASE IF NOT EXISTS
        //if the error is a 'duplicate database error' just continue as normal
        if(err.code !== '42P04') {
            throw err;
        }
        migrate();
    });

    function migrate () {
        dataSource.isActual(models, function(err, actual) {
            if(err) {
                throw err;
            }

            if (!actual) {
                dataSource.autoupdate(models, function(err, result) {
                    if(err) {
                        throw err;
                    }

                    debug(result);
                });
            }
        });
    }
}
