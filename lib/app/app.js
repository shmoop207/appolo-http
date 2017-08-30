"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const _ = require("lodash");
const router_1 = require("../routes/router");
const util_1 = require("../util/util");
const request_1 = require("./request");
const response_1 = require("./response");
const httpError_1 = require("../common/error/httpError");
const appolo = require("appolo");
const SimpleCache = require("simple-lru-cache");
SimpleCache.prototype.get = function (key) {
    let cacheVal = this.cache[key];
    return cacheVal ? cacheVal.value : undefined;
};
class App {
    constructor() {
        this.ValidMethods = { "OPTIONS": 1, "HEAD": 1 };
        this._middlewares = [];
    }
    initialize(options) {
        this._routes = _(router_1.default.getRoutes()).sortBy(r => r.order).value();
        _.forEach(this._routes, route => route.middleware = [...this._middlewares, ...route.middleware]);
        this._routesLength = this._routes.length;
        this._options = options;
        this._cache = new SimpleCache({ maxSize: this._options.maxRouteCache });
    }
    handleRequest(request, response) {
        let { req, res } = this._mixinReqRes(request, response);
        try {
            this._initRequest(req, res);
            this._initRoute(req);
            this._handleMiddleware(req, res, 0, req.$route.middleware);
        }
        catch (e) {
            this._handleError(e, res);
        }
    }
    _mixinReqRes(req, res) {
        util_1.Util.mixinProperties(req, request_1.request, request_1.RequestKeys);
        util_1.Util.mixinProperties(res, response_1.response, response_1.ResponseKeys);
        return { req: req, res: res };
    }
    _initRequest(req, res) {
        req.urlParse = url.parse(req.url, true);
        req.query = req.urlParse.query;
        res.req = req;
    }
    _initRoute(req) {
        let match, route;
        let cached = this._cache.get(req.urlParse.pathname, false);
        if (cached) {
            req.$route = cached.route;
            req.params = cached.params;
            return;
        }
        ({ match, route } = this._findRoute(req));
        if (!match) {
            throw new httpError_1.HttpError(404, `Cannot ${req.method} ${req.urlParse.pathname}`);
        }
        req.params = this._createRouteParams(route, match);
        req.$route = route;
        this._cache.set(req.urlParse.pathname, { route: req.$route, params: req.params });
    }
    _findRoute(req) {
        let route, match;
        for (let i = 0; i < this._routesLength; i++) {
            route = this._routes[i];
            match = route.regExp.exec(req.urlParse.pathname);
            if (match && (req.method == route.methodUpperCase || this.ValidMethods[req.method])) {
                break;
            }
        }
        return { route, match };
    }
    _createRouteParams(route, match) {
        let params = {};
        for (let i = 0, length = route.paramsKeys.length; i < length; i++) {
            let key = route.paramsKeys[i].name, value = util_1.Util.decodeParam(match[i + 1]);
            if (value !== undefined) {
                params[key] = value;
            }
        }
        return params;
    }
    _handleMiddleware(req, res, num, middlewares, err) {
        if (err) {
            this._handleError(err, res);
            return;
        }
        let fn = middlewares[num];
        if (!fn) {
            return;
        }
        try {
            fn(req, res, (err) => this._handleMiddleware(req, res, num + 1, middlewares, err));
        }
        catch (e) {
            this._handleError(err, res);
        }
    }
    _handleError(e, res) {
        let err = e;
        let statusCode = (err.status >= 400 && err.status < 600) ? err.status : (err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);
        res.status(statusCode);
        if (err.data && err instanceof httpError_1.HttpError) {
            res.send(err.data);
            return;
        }
        let message = (appolo.environment.type == 'development' && statusCode == 500 || this._options.errorStack) ? e.stack : (e.toString && this._options.errorMessage ? e.toString() : statusCode.toString());
        res.send(message);
    }
    use(fn) {
        this._middlewares.push(fn);
    }
}
exports.App = App;
exports.default = new App();
//# sourceMappingURL=app.js.map