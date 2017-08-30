"use strict";
import appolo = require('../../../../index');
import {define, inject, singleton, lazy} from '../../../../decorators';
import {Manager} from "../manager/manager";


@define()
export class TestMiddleware extends appolo.Middleware {
    @inject() manager: Manager;

    run(req, res, next) {
        res.send({working: true, middleware: true, name: this.manager.name})
    }
}
