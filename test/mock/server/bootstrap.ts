"use strict";
import appolo = require('../../../index');
import {inject} from "../../../lib/decorators/decorators";
import {Manager} from "./manager/manager";


@appolo.define()
@appolo.bootstrap()
@appolo.singleton()
export class Bootstrap implements appolo.IBootstrap{

    @inject() manager:Manager

    working:boolean
     run (callback) {
        this.working = true;

        setTimeout(callback,10)
    }
}
