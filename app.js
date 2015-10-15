import registerBabel from 'babel/register';
import server from './server';

// enable babel on the fly compilation
registerBabel({
    nonStandard: true
});

server.start();
