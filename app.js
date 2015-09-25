'use strict';

var babel = require('babel');

// enable babel on the fly compilation
require('babel/register')({
    nonStandard: true
});

require('server/client').start();
