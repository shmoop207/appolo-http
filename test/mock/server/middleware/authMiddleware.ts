"use strict";
import appolo = require('../../../../index');
import {define, inject, singleton, lazy} from '../../../../decorators';
import {Manager} from "../manager/manager";
import {HttpError} from "../../../../lib/common/error/httpError";


@define()
@singleton()
@lazy()
export class AuthMiddleware extends appolo.StaticMiddleware {
    @inject() manager: Manager;

    run(req, res, next) {
        next(new HttpError(403,"NOT AUTHORIZED"))
    }
}
