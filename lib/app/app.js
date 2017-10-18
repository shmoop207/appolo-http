"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./request");
require("./response");
const url = require("url");
const _ = require("lodash");
const qs = require("qs");
const querystring = require("querystring");
const router_1 = require("../routes/router");
const util_1 = require("../util/util");
const request_1 = require("./request");
const response_1 = require("./response");
const httpError_1 = require("../common/error/httpError");
const appolo = require("appolo");
const appolo_lru_cache_1 = require("appolo-lru-cache");
const launcher_1 = require("../launcher/launcher");
class App {
    constructor() {
        this.ValidMethods = { "OPTIONS": 1, "HEAD": 1 };
        this._middlewares = [];
    }
    initialize(options) {
        this._routes = _(router_1.default.getRoutes()).sortBy(r => r.route.order).value();
        this._middlewares.push((req, res, next) => this._initRoute(req, res, next));
        this._routesLength = this._routes.length;
        this._options = options;
        this._routeCache = new appolo_lru_cache_1.Cache({ maxSize: this._options.maxRouteCache });
    }
    handleRequest(request, response) {
        let req = request_1.createRequest(request);
        let res = response_1.createResponse(request, response);
        try {
            this._initRequest(req, res);
            this._handleMiddleware(req, res, 0, this._middlewares);
        }
        catch (e) {
            this._handleError(e, res);
        }
    }
    _initRequest(req, res) {
        let { query, pathname } = this._options.urlParser === "fast"
            ? util_1.Util.parseUrlFast(req.url)
            : url.parse(req.url);
        req.query = this._options.qsParser === "qs"
            ? qs.parse(query)
            : querystring.parse(query);
        req.pathName = pathname;
        req.originUrl = req.url;
    }
    _initRoute(req, res, next) {
        let match, route;
        let cached = this._routeCache.get(req.pathName + req.method);
        if (cached) {
            req.$route = cached.route;
            req.params = cached.params;
            this._handleMiddleware(req, res, 0, req.$route.middlewareHandler);
            return;
        }
        ({ match, route } = this._findRoute(req));
        if (!match) {
            next(new httpError_1.HttpError(404, `Cannot ${req.method} ${req.pathName}`));
            return;
        }
        req.params = this._createRouteParams(route, match);
        req.$route = route;
        this._routeCache.set(req.pathName + req.method, { route: req.$route, params: req.params });
        this._handleMiddleware(req, res, 0, req.$route.middlewareHandler);
    }
    _findRoute(req) {
        let route, match;
        for (let i = 0; i < this._routesLength; i++) {
            route = this._routes[i];
            match = route.regExp.exec(util_1.Util.addSlashEnd(req.pathName));
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
        let next = (err) => this._handleMiddleware(req, res, num + 1, middlewares, err);
        req.next = next;
        try {
            fn(req, res, next);
        }
        catch (e) {
            this._handleError(e, res);
        }
    }
    _handleError(e, res) {
        let err = e;
        let statusCode = (err.status >= 400 && err.status < 600) ? err.status : (err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);
        res.statusCode = statusCode;
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
    viewEngine(fn, ext = "html") {
        launcher_1.default.options.viewEngine = fn;
        launcher_1.default.options.viewExt = ext;
    }
    set(name, value) {
        launcher_1.default.options[name] = value;
    }
}
exports.App = App;
exports.default = new App();
//# sourceMappingURL=app.js.map