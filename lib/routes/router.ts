"use strict";
import appolo = require('appolo');
import    _ = require('lodash');
import  Q = require('bluebird');
import    path = require('path');
import    http = require('http');
import {Controller} from '../controller/controller';
import    joi = require('joi');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Util} from "../util/util";
import {App, MiddlewareHandler, NextFn} from "../app/app";
import {Request} from "../app/request";
import {Response} from "../app/response";
import pathToRegexp = require('path-to-regexp');
import {HttpError} from "../common/error/httpError";
import {StaticController} from "../controller/staticController";


export class Router {

    protected readonly controllerSuffix: string = 'Controller';
    protected readonly actionSuffix: string = 'Action';

    protected _routes: IRouteOptions[];

    constructor() {

        this._routes = [];

    }

    public initialize(routes?: IRouteOptions[]) {

        this._routes.push.apply(this._routes, routes || []);

        this._routes = _(this._routes).map(route => this._createRoute(route)).compact().value();
    }

    public getRoutes(): IRouteOptions[] {
        return this._routes;
    }

    protected _createRoute(route: IRouteOptions): IRouteOptions {

        let middleware = route.middleware || (route.middleware = []);

        if (!route.path || (route.environments && route.environments.length && !_.includes(route.environments, (appolo.environment.name || appolo.environment.type)))) {
            return null;
        }

        if (route.controller.indexOf(this.controllerSuffix, route.controller.length - this.controllerSuffix.length) === -1) {
            route.controller = route.controller + this.controllerSuffix;
        }

        route.controllerName = route.controller.replace(this.controllerSuffix, '');


        middleware.push(Router._invokeAction);

        if (!_.isEmpty(route.validations)) {
            middleware.unshift(Router._checkValidation);
        }

        return route;
    }


    protected static _invokeAction(req: Request, res: Response, next: NextFn) {

        let controller: StaticController = appolo.inject.getObject<StaticController>(req.$route.controller, [req, res, next, req.$route]);

        if (!controller) {
            throw new Error("failed to find controller " + req.$route.controller);
        }

        controller.invoke(req, res, next, req.$route, req.$route.action);

        next();
    }

    protected static async _checkValidation(req: Request, res: Response, next: NextFn) {


        let data = _.extend({}, req.params, req.query, (req as any).body);

        let options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        try {
            let params = await Q.fromCallback((callback) => joi.validate(data, req.$route.validations, options, callback));

            let output = {};

            if ((req.$route.convertToCamelCase) !== false) {

                for (let key in params) {
                    output[Util.convertSnakeCaseToCamelCase(key)] = params[key]
                }
            }
            else {
                output = params;
            }

            (req as any).model = output;

            next();

        } catch (e) {

            next(new HttpError(400, e.toString(), {
                status: 400,
                statusText: "Bad Request",
                error: e.toString(),
                code: 400
            }))

        }
    }

    public reset() {
        this._routes.length = 0;
    }

}


export default new Router();