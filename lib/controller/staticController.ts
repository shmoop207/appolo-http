"use strict";
import    _ = require('lodash');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {IController} from "./IController";

export abstract class StaticController implements IController{

    public invoke(req: Request, res: Response, next: NextFn,route: IRouteOptions, action: string | ((c: IController)=>Function)) {

        let fnName: string = route.actionName;

        if (!fnName) {
            fnName = _.isString(action) ? action : action(this).name;

            if (!this[fnName]) {
                throw new Error(`failed to invoke ${this.constructor.name} fnName ${fnName}`);
            }
            route.actionName = fnName;
        }

        this[fnName](req, res, next, route);
    }

    public send(res: Response, statusCode?: number, data?: any) {

        if (arguments.length === 1) {
            this.sendOk(arguments[0])
        } else {
            res.status(statusCode).json(data);
        }
    }

    public sendOk(res: Response, data?: any) {
        res.status(200).json(data);
    }

    public sendCreated(res: Response, data?: any) {
        res.status(201).send();
    }

    public sendNoContent(res: Response) {
        res.status(204).send();
    }

    public sendError(res: Response, error?, code?) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }

    public sendBadRequest(res: Response, error?, code?) {
        res.status(400).json({
            status: 400,
            statusText: "Bad Request",
            error: (error instanceof Error) ? error.toString() : "",
            code: code
        });
    }

    public sendUnauthorized(res: Response, error?, code?) {
        res.status(401).json({
            status: 401,
            statusText: "Unauthorized",
            error: error ? error.toString() : "",
            code: code
        });
    }

    public sendNotFound(res: Response, error?, code?) {
        res.status(404).json({
            status: 404,
            statusText: "Not Found",
            error: error ? error.toString() : "",
            code: code
        });
    }


    public getModel<T>(req: Request): T {
        return (req as any).model;
    }
}
