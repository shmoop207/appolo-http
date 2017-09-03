"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo");
const _ = require("lodash");
const Q = require("bluebird");
const joi = require("joi");
const util_1 = require("../util/util");
const httpError_1 = require("../common/error/httpError");
class Router {
    constructor() {
        this.controllerSuffix = 'Controller';
        this.actionSuffix = 'Action';
        this._routes = [];
    }
    initialize(routes) {
        this._routes.push.apply(this._routes, routes || []);
        this._routes = _(this._routes).map(route => this._createRoute(route)).compact().value();
    }
    getRoutes() {
        return this._routes;
    }
    _createRoute(routeInner) {
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
    static _invokeAction(req, res, next) {
        let controller = appolo.inject.getObject(req.$route.route.controller, [req, res, req.$route.route]);
        if (!controller) {
            throw new Error("failed to find controller " + req.$route.route.controller);
        }
        controller.invoke(req, res, req.$route, req.$route.route.action);
        next();
    }
    static _checkValidation(req, res, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = _.extend({}, req.params, req.query, req.body);
            let options = {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            };
            try {
                let params = yield Q.fromCallback((callback) => joi.validate(data, req.$route.route.validations, options, callback));
                let output = {};
                if ((req.$route.route.convertToCamelCase) !== false) {
                    for (let key in params) {
                        output[util_1.Util.convertSnakeCaseToCamelCase(key)] = params[key];
                    }
                }
                else {
                    output = params;
                }
                req.model = output;
                next();
            }
            catch (e) {
                next(new httpError_1.HttpError(400, e.toString(), {
                    status: 400,
                    statusText: "Bad Request",
                    error: e.toString(),
                    code: 400
                }));
            }
        });
    }
    reset() {
        this._routes.length = 0;
    }
}
exports.Router = Router;
exports.default = new Router();
//# sourceMappingURL=router.js.map