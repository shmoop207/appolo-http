"use strict";
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {StaticController} from "./staticController";

export class Controller extends StaticController {

    protected req: Request;
    protected res: Response;
    protected next: NextFn;
    protected route: IRouteOptions;
    protected action: string | Function;

    constructor(req: Request, res: Response, next: NextFn, route: IRouteOptions) {

        super();
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }

    public send(statusCode?, data?) {

        super.send(this.res, statusCode, data)
    }

    public sendOk(data?: any) {
        super.sendOk(this.res, data);
    }

    public sendCreated(data?: any) {
        super.sendCreated(this.res, data)
    }

    public sendNoContent() {
        super.sendNoContent(this.res);
    }

    public sendError(error?, code?) {

        super.sendServerError(this.res, error, code);
    }

    public sendBadRequest(error?, code?) {

        super.sendBadRequest(this.res, error, code);
    }

    public sendUnauthorized(error?, code?) {

        super.sendUnauthorized(this.res, error, code);
    }

    public sendNotFound(error?, code?) {

        super.sendNotFound(this.res, error, code);
    }

    public getName(): string {
        return this.route.controller;
    }

    public getModel<T>(): T {
        return this.req.model as T;
    }
}
