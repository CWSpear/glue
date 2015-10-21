// enable babel on the fly compilation
require('babel/register')({
    nonStandard: true
});

require('./server').start();
