"use strict";
import    _ = require('lodash');
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {IRequest} from "../app/request";
import {IResponse} from "../app/response";
import {NextFn} from "../app/app";
import {IController} from "./IController";

export abstract class StaticController implements IController{

    public invoke(req: IRequest, res: IResponse,routeInner: IRouteInnerOptions, action: string | ((c: IController)=>Function)) {

        let fnName: string = routeInner.route.actionName;

        if (!fnName) {
            fnName = _.isString(action) ? action : action(this).name;

            if (!this[fnName]) {
                throw new Error(`failed to invoke ${this.constructor.name} fnName ${fnName}`);
            }
            routeInner.route.actionName = fnName;
        }

        this[fnName](req, res, routeInner.route);
    }

    public static send(res: IResponse, statusCode?: number, data?: any) {

        if (arguments.length === 1) {
            this.sendOk(arguments[0])
        } else {
            res.status(statusCode).json(data);
        }
    }

    public static sendOk(res: IResponse, data?: any) {
        res.status(200).json(data);
    }

    public static sendCreated(res: IResponse, data?: any) {
        res.status(201).send(data);
    }

    public static sendNoContent(res: IResponse) {
        res.status(204).send();
    }

    public static sendError(res: IResponse, error?, code?) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }

    public static sendBadRequest(res: IResponse, error?, code?) {
        res.status(400).json({
            status: 400,
            statusText: "Bad Request",
            error: (error instanceof Error) ? error.toString() : "",
            code: code
        });
    }

    public static sendUnauthorized(res: IResponse, error?, code?) {
        res.status(401).json({
            status: 401,
            statusText: "Unauthorized",
            error: error ? error.toString() : "",
            code: code
        });
    }

    public static sendNotFound(res: IResponse, error?, code?) {
        res.status(404).json({
            status: 404,
            statusText: "Not Found",
            error: error ? error.toString() : "",
            code: code
        });
    }


    public static getModel<T>(req: IRequest): T {
        return (req as any).model;
    }
}
