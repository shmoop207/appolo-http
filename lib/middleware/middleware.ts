"use strict";
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {HttpError} from "../common/error/httpError";
import {StaticMiddleware} from "./staticMiddleware";


export abstract class Middleware extends StaticMiddleware {

    protected req: Request;
    protected res: Response;
    protected next: NextFn;
    protected route: IRouteOptions;

    constructor(req: Request, res: Response, next: NextFn, route: IRouteOptions) {
        super();
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }

    public getModel<T>(): T {
        return (this.req).model as T;
    }

    public sendError(error?: Error, code?: number) {

        this._callNext(500, "Internal Server Error", error, code);

    }

    public sendBadRequest(error?, code?) {

        this._callNext(400, "Bad Request", error, code);
    }

    public sendUnauthorized(error?, code?) {

        this._callNext(401, "Unauthorized", error, code);

    }

    public sendNotFound(error?, code?) {

        this._callNext(404, "Not Found", error, code);
    }

    protected _callNext(status: number, statusText: string, error: Error, code: number) {
        this.next(new HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error,
            code: code
        }));
    }
}
