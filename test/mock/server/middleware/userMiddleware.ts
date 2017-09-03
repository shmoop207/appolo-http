"use strict";
import appolo = require('../../../../index');
import {define, inject, singleton, lazy} from '../../../../decorators';
import {Manager} from "../manager/manager";


@define()
export class UserMiddleware extends appolo.Middleware {
    @inject() manager: Manager;

    run(req, res, next) {
        req.user = "user"
        next()
    }
}
