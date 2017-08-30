"use strict";

import path = require('path');
import _= require('lodash');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {HttpError} from "../common/error/httpError";


export class Middleware implements IMiddleware {

    protected req: Request;
    protected res: Response;
    protected next: NextFn;
    protected route: IRouteOptions;

    constructor(req: Request, res: Response, next: NextFn, route: IRouteOptions) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }

    public getModel<T>(req?: Request): T {
        return (req || this.req).model as T;
    }

    public run(req: Request, res: Response, next: NextFn, route: IRouteOptions) {

        next();
    }

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

    private _callNext(status: number, statusText: string, error: Error, code: number, next?: NextFn) {
        (next || this.next)(new HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error,
            code: code
        }));
    }
}
