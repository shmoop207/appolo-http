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
    _createRoute(route) {
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
    static _invokeAction(req, res, next) {
        let controller = appolo.inject.getObject(req.$route.controller, [req, res, next, req.$route]);
        if (!controller) {
            throw new Error("failed to find controller " + req.$route.controller);
        }
        controller.invoke(req, res, next, req.$route, req.$route.action);
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
                let params = yield Q.fromCallback((callback) => joi.validate(data, req.$route.validations, options, callback));
                let output = {};
                if ((req.$route.convertToCamelCase) !== false) {
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