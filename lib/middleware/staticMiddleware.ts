"use strict";

import path = require('path');
import _= require('lodash');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {HttpError} from "../common/error/httpError";
import {Err} from "joi";


export abstract class StaticMiddleware implements IMiddleware {


    public getModel<T>(req?: Request): T {
        return (req).model as T;
    }

    public abstract run(req: Request, res: Response, next: NextFn, route: IRouteOptions): void

    public static sendError(next: NextFn,error?: Error, code?: number):void{

        StaticMiddleware._callNext(next,500, "Internal Server Error", error, code);
    }

    public static sendBadRequest(next: NextFn,error?:Error, code?:number) {

        StaticMiddleware._callNext(next,400, "Bad Request", error, code);
    }

    public static sendUnauthorized(next: NextFn,error?:Error, code?:number) {

        StaticMiddleware._callNext(next,403, "Unauthorized", error, code);

    }

    public static sendNotFound(next: NextFn,error?:Error, code?:number) {

        StaticMiddleware._callNext(next,404, "Not Found", error, code);
    }

    protected static _callNext(next: NextFn,status: number, statusText: string, error: Error, code: number) {
        next(new HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error.message,
            code: code
        }));
    }
}
