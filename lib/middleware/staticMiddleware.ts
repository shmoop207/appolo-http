"use strict";

import path = require('path');
import _= require('lodash');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {HttpError} from "../common/error/httpError";


export abstract class StaticMiddleware implements IMiddleware {


    public getModel<T>(req?: Request): T {
        return (req).model as T;
    }

    public abstract run(req: Request, res: Response, next: NextFn, route: IRouteOptions): void


    public sendError(error?: Error, code?: number, next?: NextFn) {

        this._callNext(500, "Internal Server Error", error, code, next);

    }

    public sendBadRequest(error?, code?, next?: NextFn) {

        this._callNext(400, "Bad Request", error, code, next);
    }

    public sendUnauthorized(error?, code?, next?: NextFn) {

        this._callNext(401, "Unauthorized", error, code, next);

    }

    public sendNotFound(error?, code?, next?: NextFn) {

        this._callNext(404, "Not Found", error, code, next);
    }

    protected _callNext(status: number, statusText: string, error: Error, code: number, next?: NextFn) {
        next(new HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error,
            code: code
        }));
    }
}
