"use strict";
import appolo = require('appolo');
import    _ = require('lodash');
import    joi = require('joi');
import router from './router';
import {IRouteOptions} from "../interfaces/IRouteOptions";
import pathToRegexp = require('path-to-regexp');
import {MiddlewareHandler, NextFn} from "../app/app";
import {IMiddleware} from "../interfaces/IMiddleware";
import {Response} from "../app/response";
import {Request} from "../app/request";
import {StaticController} from "../controller/staticController";
import {Controller} from "../controller/controller";


export class Route<T> {
    protected _route: IRouteOptions;

    constructor(controller: string | typeof StaticController |typeof Controller) {

        this._route = <IRouteOptions>{
            controller: _.isFunction(controller) && controller.name ? _.camelCase(controller.name) : controller,
            validations: {},
            middleware: [],
            environments: [],
            roles: [],
            path: "",
            action: null,
            regExp: null,
            method: 'get',
            order: 0,
            methodUpperCase: 'GET',
            params: {}
        };

        router.getRoutes().push(this._route);
    }

    public path(pathPattern: string): this {

        this._route.path = pathPattern;
        let keys = [];
        this._route.regExp = pathToRegexp(this._route.path, keys);

        this._route.paramsKeys = keys;

        if (pathPattern == "/") {
            this.order(999998)
        } else if (pathPattern == "*") {
            this.order(999999)
            this._route.regExp = new RegExp(".*")
        }

        return this;
    }

    public order(order: number): this {
        this._route.order = order;
        return this
    }

    public action(action: ((c: T) => Function) | string): this {

        this._route.action = action;

        return this;
    }

    public abstract(abstract: Partial<IRouteOptions>): this {
        _.extend(this._route, _.cloneDeep(abstract));

        return this;
    }

    public extend(opts: { [index: string]: any }): this {
        _.extend(this._route, opts);

        return this;
    }

    public param(key: string, value: any): this {
        this._route.params[key] = value;
        return this
    }

    public validation(key: string | { [index: string]: joi.Schema }, validation?: joi.Schema): this {
        return this.validations(key, validation);
    }

    public validations(key: string | { [index: string]: joi.Schema }, validation?: joi.Schema): this {

        if (_.isObject(key)) {

            _.extend(this._route.validations, key)

        } else {

            this._route.validations[key as string] = validation
        }

        return this;
    }

    public method(method: 'get' | 'post' | 'delete' | 'patch' | 'head' | 'put'): this {

        this._route.method = method;
        this._route.methodUpperCase = method.toUpperCase();

        return this;
    }

    public environment(environment: string | string[]): this {
        return this.environments(environment)
    }

    public environments(environment: string | string[]): this {
        if (_.isArray(environment)) {

            this._route.environments.push.apply(this._route.environments, environment);
        }
        else {

            this._route.environments.push(environment)
        }

        return this;
    }

    public convertToCamelCase(value: boolean): this {
        this._route.convertToCamelCase = value;
        return this
    }

    public middleware(middleware: string | string[] | MiddlewareHandler | MiddlewareHandler[]): this {

        if (_.isArray(middleware)) {
            return this.middlewares(middleware)
        }

        if (!_.isString(middleware)) {
            this._route.middleware.push(middleware as MiddlewareHandler);
            return this;
        }

        middleware = (function (middlewareId): MiddlewareHandler {

            return function (req: Request, res: Response, next: NextFn) {

                let middleware: IMiddleware = appolo.inject.getObject<IMiddleware>(middlewareId, [req, res, next, req.$route]);

                if (!middleware) {
                    throw new Error("failed to find middleware " + middleware);
                }

                middleware.run(req, res, next, req.$route);
            }
        })(middleware);

        this._route.middleware.push(middleware as MiddlewareHandler);

        return this;
    }

    public middlewares(middleware: string | string[] | MiddlewareHandler | MiddlewareHandler[]): this {

        _.forEach(_.isArray(middleware) ? middleware : [middleware], fn => this.middleware(middleware));

        return this;
    }


    public role(role: string | string[]): this {
        return this.roles(role)
    }

    public roles(role: string | string[]): this {

        if (_.isArray(role)) {

            this._route.roles.push.apply(this._route.roles, role);

        } else {

            this._route.roles.push(role)
        }

        return this;
    }

    route<T>(controller: string | typeof StaticController): Route<T> {
        return new Route<T>(controller || this._route.controller);
    }
}

export default function <T>(controller: string | typeof StaticController | typeof Controller): Route<T> {
    return new Route<T>(controller)
}