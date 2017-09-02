"use strict";
import appolo = require('../../../index');


export class Bootstrap implements appolo.IBootstrap{
    working:boolean
     run (callback) {
        this.working = true;

        setTimeout(callback,10)
    }
}


appolo.register('appolo-bootstrap',Bootstrap)
    .singleton()
    .inject("manager");