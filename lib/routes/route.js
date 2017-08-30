"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("appolo");
const _ = require("lodash");
const router_1 = require("./router");
const pathToRegexp = require("path-to-regexp");
class Route {
    constructor(controller) {
        this._route = {
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
        router_1.default.getRoutes().push(this._route);
    }
    path(pathPattern) {
        this._route.path = pathPattern;
        let keys = [];
        this._route.regExp = pathToRegexp(this._route.path, keys);
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
        this._route.order = order;
        return this;
    }
    action(action) {
        this._route.action = action;
        return this;
    }
    abstract(abstract) {
        _.extend(this._route, _.cloneDeep(abstract));
        return this;
    }
    extend(opts) {
        _.extend(this._route, opts);
        return this;
    }
    param(key, value) {
        this._route.params[key] = value;
        return this;
    }
    validation(key, validation) {
        return this.validations(key, validation);
    }
    validations(key, validation) {
        if (_.isObject(key)) {
            _.extend(this._route.validations, key);
        }
        else {
            this._route.validations[key] = validation;
        }
        return this;
    }
    method(method) {
        this._route.method = method;
        this._route.methodUpperCase = method.toUpperCase();
        return this;
    }
    environment(environment) {
        return this.environments(environment);
    }
    environments(environment) {
        if (_.isArray(environment)) {
            this._route.environments.push.apply(this._route.environments, environment);
        }
        else {
            this._route.environments.push(environment);
        }
        return this;
    }
    convertToCamelCase(value) {
        this._route.convertToCamelCase = value;
        return this;
    }
    middleware(middleware) {
        if (_.isArray(middleware)) {
            return this.middlewares(middleware);
        }
        if (!_.isString(middleware)) {
            this._route.middleware.push(middleware);
            return this;
        }
        middleware = (function (middlewareId) {
            return function (req, res, next) {
                let middleware = appolo.inject.getObject(middlewareId, [req, res, next, req.$route]);
                if (!middleware) {
                    throw new Error("failed to find middleware " + middleware);
                }
                middleware.run(req, res, next, req.$route);
            };
        })(middleware);
        this._route.middleware.push(middleware);
        return this;
    }
    middlewares(middleware) {
        _.forEach(_.isArray(middleware) ? middleware : [middleware], fn => this.middleware(middleware));
        return this;
    }
    role(role) {
        return this.roles(role);
    }
    roles(role) {
        if (_.isArray(role)) {
            this._route.roles.push.apply(this._route.roles, role);
        }
        else {
            this._route.roles.push(role);
        }
        return this;
    }
    route(controller) {
        return new Route(controller || this._route.controller);
    }
}
exports.Route = Route;
function default_1(controller) {
    return new Route(controller);
}
exports.default = default_1;
//# sourceMappingURL=route.js.map