import appolo = require('../../../../index');

import {logger} from './logger';
import {logger2} from './logger2' ;
import {logger3} from './logger3' ;

export = async function (env) {
    appolo.use(logger)

    appolo.use(logger2({test: 'test'}))

    await appolo.load(logger3({test: 'test3'}))

}