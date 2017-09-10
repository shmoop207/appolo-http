"use strict";
import appolo = require('appolo');
import    _ = require('lodash');
import    joi = require('joi');
import router from './router';
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import pathToRegexp = require('path-to-regexp');
import {MiddlewareHandler, NextFn} from "../app/app";
import {IMiddleware, IMiddlewareCtr} from "../interfaces/IMiddleware";
import {IResponse} from "../app/response";
import {IRequest} from "../app/request";
import {IController, IControllerCtr} from "../controller/IController";
import {Util} from "../util/util";
import {Methods} from "../common/enums/methods";

let orderIndex =  0 ;


export class Route<T extends IController> {
    protected _route: IRouteInnerOptions;

    constructor(controller: string | { new(): IController }) {

        this._route = <IRouteInnerOptions>{
            middlewareHandler: [],
            regExp: null,
            methodUpperCase: 'GET',
            route: {
                method: 'get',
                roles: [],
                environments: [],
                middleware: [],
                validations: {},
                controller: _.isFunction(controller) && controller.name ? _.camelCase(controller.name) : controller,
                path: "",
                order: orderIndex++,
                params: {},
                action: null,


            }
        };

        router.getRoutes().push(this._route);
    }

    public path(pathPattern: string): this {

        this._route.route.path = pathPattern;
        let keys = [];
        this._route.regExp = pathToRegexp(Util.addSlashEnd(this._route.route.path), keys);

        this._route.paramsKeys = keys;

        if (pathPattern == "/") {
            this.order(999998)
        } else if (pathPattern == "*") {
            this.order(999999);
            this._route.regExp = new RegExp(".*")
        }

        return this;
    }

    public order(order: number): this {
        this._route.route.order = order;
        return this
    }

    public action(action: ((c: T) => Function) | string): this {

        this._route.route.action = action;

        return this;
    }

    public abstract(abstract: Partial<IRouteOptions>): this {

        let items = _.pick(abstract, ["environments", "roles", "middleware", "validations", "convertToCamelCase", "method", "params"])

        _.forEach(items, (item: any, key: string) => {
            this[key](item);
        });

        return this;
    }

    public extend(opts: { [index: string]: any }): this {
        _.extend(this._route, opts);

        return this;
    }

    public param(key: string, value: any): this {
        this._route.route.params[key] = value;
        return this
    }

    public validation(key: string | { [index: string]: joi.Schema }, validation?: joi.Schema): this {
        return this.validations(key, validation);
    }

    public validations(key: string | { [index: string]: joi.Schema }, validation?: joi.Schema): this {

        if (_.isObject(key)) {

            _.extend(this._route.route.validations, key)

        } else {

            this._route.route.validations[key as string] = validation
        }

        return this;
    }

    public method(method: 'get' | 'post' | 'delete' | 'patch' | 'head' | 'put' | Methods): this {

        this._route.route.method = method;
        this._route.methodUpperCase = method.toUpperCase();

        return this;
    }

    public environment(environment: string | string[]): this {
        return this.environments(environment)
    }

    public environments(environment: string | string[]): this {
        if (_.isArray(environment)) {

            this._route.route.environments.push.apply(this._route.route.environments, environment);
        }
        else {

            this._route.route.environments.push(environment)
        }

        return this;
    }

    public convertToCamelCase(value: boolean): this {
        this._route.route.convertToCamelCase = value;
        return this
    }

    public middleware(middleware: string | MiddlewareHandler | IMiddlewareCtr | ((req: any, res: any, next: any) => void)): this {

        if (_.isArray(middleware)) {
            return this.middlewares(middleware)
        }

        this._route.route.middleware.push(middleware);

        if (Util.isClass(middleware)) {
            middleware = _.camelCase((middleware as IMiddlewareCtr).name)
        } else if (typeof middleware == "function") {
            this._route.middlewareHandler.push(middleware as MiddlewareHandler);
        }


        if (typeof middleware == "string") {

            middleware = (function (middlewareId): MiddlewareHandler {

                return function (req: IRequest, res: IResponse, next: NextFn) {

                    let middleware: IMiddleware = appolo.inject.getObject<IMiddleware>(middlewareId, [req, res, next, req.$route]);

                    if (!middleware) {
                        throw new Error("failed to find middleware " + middleware);
                    }

                    middleware.run(req, res, next, req.$route.route);
                }
            })(middleware);

            this._route.middlewareHandler.push(middleware as MiddlewareHandler);

            return this;
        }
    }

    public middlewares(middlewares: string[] | MiddlewareHandler[] | IMiddlewareCtr[]): this {

        _.forEach(_.isArray(middlewares) ? middlewares : [middlewares], fn => this.middleware(fn));

        return this;
    }


    public role(role: string | string[]): this {
        return this.roles(role)
    }

    public roles(role: string | string[]): this {

        if (_.isArray(role)) {

            this._route.route.roles.push.apply(this._route.route.roles, role);

        } else {

            this._route.route.roles.push(role)
        }

        return this;
    }

    route<T extends IController>(controller: string | IControllerCtr): Route<T> {
        return new Route<T>(controller || this._route.route.controller);
    }
}

export default function <T extends IController>(controller: string | IControllerCtr): Route<T> {
    return new Route<T>(controller)
}