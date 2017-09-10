"use strict";
import appolo = require('appolo');
import    _ = require('lodash');
import  Q = require('bluebird');
import    path = require('path');
import    http = require('http');
import {Controller} from '../controller/controller';
import    joi = require('joi');
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Util} from "../util/util";
import {App, MiddlewareHandler, NextFn} from "../app/app";
import {IRequest} from "../app/request";
import {IResponse} from "../app/response";
import pathToRegexp = require('path-to-regexp');
import {HttpError} from "../common/error/httpError";
import {StaticController} from "../controller/staticController";


export class Router {

    protected readonly controllerSuffix: string = 'Controller';
    protected readonly actionSuffix: string = 'Action';

    protected _routes: IRouteInnerOptions[];

    constructor() {

        this._routes = [];

    }

    public initialize(routes?: IRouteOptions[]) {

        this._routes.push.apply(this._routes, routes || []);

        this._routes = _(this._routes).map(route => this._createRoute(route)).compact().value();
    }

    public getRoutes(): IRouteInnerOptions[] {
        return this._routes;
    }

    protected _createRoute(routeInner: IRouteInnerOptions): IRouteInnerOptions {

        let middleware = routeInner.middlewareHandler || (routeInner.middlewareHandler = []);

        if (!routeInner.route.path || (routeInner.route.environments && routeInner.route.environments.length && !_.includes(routeInner.route.environments, (appolo.environment.name || appolo.environment.type)))) {
            return null;
        }

        if (routeInner.route.controller.indexOf(this.controllerSuffix, routeInner.route.controller.length - this.controllerSuffix.length) === -1) {
            routeInner.route.controller = routeInner.route.controller + this.controllerSuffix;
        }

        routeInner.route.controllerName = routeInner.route.controller.replace(this.controllerSuffix, '');


        middleware.push(Router._invokeAction);

        if (!_.isEmpty(routeInner.route.validations)) {
            middleware.unshift(Router._checkValidation);
        }

        return routeInner;
    }


    protected static _invokeAction(req: IRequest, res: IResponse, next: NextFn) {

        let controller: StaticController = appolo.inject.getObject<StaticController>(req.$route.route.controller, [req, res, req.$route.route]);

        if (!controller) {
            throw new Error("failed to find controller " + req.$route.route.controller);
        }

        controller.invoke(req, res, req.$route, req.$route.route.action);

        next();
    }

    protected static async _checkValidation(req: IRequest, res: IResponse, next: NextFn) {


        let data = _.extend({}, req.params, req.query, (req as any).body);

        let options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        };

        try {
            let params = await Q.fromCallback((callback) => joi.validate(data, req.$route.route.validations, options, callback));

            let output = {};

            if ((req.$route.route.convertToCamelCase) !== false) {

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