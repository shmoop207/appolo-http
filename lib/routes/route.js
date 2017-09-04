"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("appolo");
const _ = require("lodash");
const router_1 = require("./router");
const pathToRegexp = require("path-to-regexp");
const util_1 = require("../util/util");
let orderIndex = 0;
class Route {
    constructor(controller) {
        this._route = {
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
        router_1.default.getRoutes().push(this._route);
    }
    path(pathPattern) {
        this._route.route.path = pathPattern;
        let keys = [];
        this._route.regExp = pathToRegexp(util_1.Util.addSlashEnd(this._route.route.path), keys);
        this._route.paramsKeys = keys;
        if (pathPattern == "/") {
            this.order(999998);
        }
        else if (pathPattern == "*") {
            this.order(999999);
            this._route.regExp = new RegExp(".*");
        }
        return this;
    }
    order(order) {
        this._route.route.order = order;
        return this;
    }
    action(action) {
        this._route.route.action = action;
        return this;
    }
    abstract(abstract) {
        let items = _.pick(abstract, ["environments", "roles", "middleware", "validations", "convertToCamelCase", "method", "params"]);
        _.forEach(items, (item, key) => {
            this[key](item);
        });
        return this;
    }
    extend(opts) {
        _.extend(this._route, opts);
        return this;
    }
    param(key, value) {
        this._route.route.params[key] = value;
        return this;
    }
    validation(key, validation) {
        return this.validations(key, validation);
    }
    validations(key, validation) {
        if (_.isObject(key)) {
            _.extend(this._route.route.validations, key);
        }
        else {
            this._route.route.validations[key] = validation;
        }
        return this;
    }
    method(method) {
        this._route.route.method = method;
        this._route.methodUpperCase = method.toUpperCase();
        return this;
    }
    environment(environment) {
        return this.environments(environment);
    }
    environments(environment) {
        if (_.isArray(environment)) {
            this._route.route.environments.push.apply(this._route.route.environments, environment);
        }
        else {
            this._route.route.environments.push(environment);
        }
        return this;
    }
    convertToCamelCase(value) {
        this._route.route.convertToCamelCase = value;
        return this;
    }
    middleware(middleware) {
        if (_.isArray(middleware)) {
            return this.middlewares(middleware);
        }
        this._route.route.middleware.push(middleware);
        if (util_1.Util.isClass(middleware)) {
            middleware = _.camelCase(middleware.name);
        }
        else if (typeof middleware == "function") {
            this._route.middlewareHandler.push(middleware);
        }
        if (typeof middleware == "string") {
            middleware = (function (middlewareId) {
                return function (req, res, next) {
                    let middleware = appolo.inject.getObject(middlewareId, [req, res, next, req.$route]);
                    if (!middleware) {
                        throw new Error("failed to find middleware " + middleware);
                    }
                    middleware.run(req, res, next, req.$route.route);
                };
            })(middleware);
            this._route.middlewareHandler.push(middleware);
            return this;
        }
    }
    middlewares(middlewares) {
        _.forEach(_.isArray(middlewares) ? middlewares : [middlewares], fn => this.middleware(fn));
        return this;
    }
    role(role) {
        return this.roles(role);
    }
    roles(role) {
        if (_.isArray(role)) {
            this._route.route.roles.push.apply(this._route.route.roles, role);
        }
        else {
            this._route.route.roles.push(role);
        }
        return this;
    }
    route(controller) {
        return new Route(controller || this._route.route.controller);
    }
}
exports.Route = Route;
function default_1(controller) {
    return new Route(controller);
}
exports.default = default_1;
//# sourceMappingURL=route.js.map