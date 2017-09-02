"use strict";
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {StaticController} from "./staticController";

export abstract class Controller extends StaticController {

    protected req: Request;
    protected res: Response;
    protected route: IRouteOptions;
    protected action: string | Function;

    constructor(req: Request, res: Response, route: IRouteOptions) {

        super();
        this.req = req;
        this.res = res;
        this.route = route;
    }

    public send(statusCode?:number, data?:any) {

        Controller.send(this.res, statusCode, data)
    }

    public sendOk(data?: any) {
        Controller.sendOk(this.res, data);
    }

    public sendCreated(data?: any) {
        Controller.sendCreated(this.res, data)
    }

    public sendNoContent() {
        Controller.sendNoContent(this.res);
    }

    public sendError(error?, code?) {

        Controller.sendError(this.res, error, code);
    }

    public sendBadRequest(error?, code?) {

        Controller.sendBadRequest(this.res, error, code);
    }

    public sendUnauthorized(error?, code?) {

        Controller.sendUnauthorized(this.res, error, code);
    }

    public sendNotFound(error?, code?) {

        Controller.sendNotFound(this.res, error, code);
    }

    public getName(): string {
        return this.route.controller;
    }

    public getModel<T>(): T {
        return this.req.model as T;
    }
}
