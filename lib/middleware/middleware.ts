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

    public sendError(error?: Error, code?: number):void{

        Middleware.sendError(this.next,error,code);
    }

    public sendBadRequest(error?:Error, code?:number) {

        Middleware.sendBadRequest(this.next,error,code)
    }

    public sendUnauthorized(error?:Error, code?:number) {

        Middleware.sendUnauthorized(this.next,error,code)

    }

    public sendNotFound(error?:Error, code?:number) {

        Middleware.sendNotFound(this.next,error,code)
    }

}
