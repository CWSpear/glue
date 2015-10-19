import getDebugger from 'debug';

var debug = getDebugger('boot/database');

export default function (app) {
    const dataSource = app.datasources['pg-glue'];
    var models = ['paste', 'User'];

    dataSource.isActual(models, function(err, actual) {
        if(err) {
            throw err;
        }
        if (!actual) {
            // dataSource.autoupdate(models, function(err, result) {
            //    if(err) {
            //        throw err;
            //    }
            //    debug(result);
            //});
        }
    });
}
