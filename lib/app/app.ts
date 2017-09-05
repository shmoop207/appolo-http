import    http = require('http');
import    url = require('url');
import    Q = require('bluebird');
import    _ = require('lodash');
import router from '../routes/router';
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {Util} from "../util/util";
import {request, Request, RequestKeys} from "./request";
import {response, Response, ResponseKeys} from "./response";
import {HttpError} from "../common/error/httpError";
import appolo = require('appolo');
import {IOptions} from "../interfaces/IOptions";
import SimpleCache = require("simple-lru-cache");

SimpleCache.prototype.get = function (key) {
    let cacheVal = this.cache[key];
    return cacheVal ? cacheVal.value : undefined
};


export type MiddlewareHandler = ((req: Request, res: Response, next: NextFn) => void)
export type NextFn = (err?: Error) => void


export class App {

    private _routes: IRouteInnerOptions[];
    private _routesLength: number;
    private _middlewares: MiddlewareHandler[];
    private _options: IOptions;
    private _cache: any;

    private readonly ValidMethods = {"OPTIONS": 1, "HEAD": 1};


    constructor() {
        this._middlewares = [];
    }

    public initialize(options: IOptions) {

        this._routes = _<IRouteInnerOptions>(router.getRoutes()).sortBy(r => r.route.order).value();

        _.forEach(this._routes, (route: IRouteInnerOptions) => route.middlewareHandler = [...this._middlewares, ...route.middlewareHandler]);

        this._routesLength = this._routes.length;
        this._options = options;
        this._cache = new SimpleCache({maxSize: this._options.maxRouteCache});
    }

    public handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        let {req, res} = this._mixinReqRes(request, response);

        try {

            this._initRequest(req, res);

            this._initRoute(req);

            this._handleMiddleware(req, res, 0, req.$route.middlewareHandler);

        } catch (e) {
            this._handleError(e, res);
        }

    }

    private _mixinReqRes(req: http.IncomingMessage, res: http.ServerResponse): { req: Request, res: Response } {
        Util.mixinProperties(req, request, RequestKeys);
        Util.mixinProperties(res, response, ResponseKeys);

        return {req: req as any, res: res as any}
    }

    private _initRequest(req: Request, res: Response): void {

        req.urlParse = url.parse(req.url, true);
        req.query = req.urlParse.query;
        res.req = req;
    }

    private _initRoute(req: Request): void {

        let match, route;

        let cached = this._cache.get(req.urlParse.pathname, false);

        if (cached) {
            req.$route = cached.route;
            req.params = cached.params;
            return;
        }

        ({match, route} = this._findRoute(req));

        if (!match) {
            throw new HttpError(404, `Cannot ${req.method} ${req.urlParse.pathname}`);
        }

        req.params = this._createRouteParams(route, match);
        req.$route = route;
        this._cache.set(req.urlParse.pathname, {route: req.$route, params: req.params});
    }

    private _findRoute(req: Request) {
        let route, match;
        for (let i = 0; i < this._routesLength; i++) {

            route = this._routes[i];

            match = route.regExp.exec(Util.addSlashEnd(req.urlParse.pathname));

            if (match && (req.method == route.methodUpperCase || this.ValidMethods[req.method])) {
                break;
            }
        }

        return {route, match}
    }

    private _createRouteParams(route: IRouteInnerOptions, match: RegExpExecArray): { [index: string]: any } {
        let params: { [index: string]: any } = {};

        for (let i = 0, length = route.paramsKeys.length; i < length; i++) {
            let key = route.paramsKeys[i].name,
                value = Util.decodeParam(match[i + 1]);

            if (value !== undefined) {
                params[key] = value
            }
        }

        return params
    }

    private _handleMiddleware(req: Request, res: Response, num: number, middlewares: MiddlewareHandler[], err?: Error) {

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
        } catch (e) {
            this._handleError(e, res);
        }

    }

    private _handleError(e: Error | HttpError, res: Response) {

        let err: HttpError = e as HttpError;

        let statusCode = (err.status >= 400 && err.status < 600 ) ? err.status : (err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);

        res.status(statusCode);

        if (err.data && err instanceof HttpError) {

            res.send(err.data);

            return;
        }

        let message = (appolo.environment.type == 'development' && statusCode == 500 || this._options.errorStack) ? e.stack : (e.toString && this._options.errorMessage ? e.toString() : statusCode.toString())

        res.send(message);

    }

    public use(fn: ((req: Request, res: Response, next: (e?: Error) => void) => void) | ((req: any, res: any, next: any) => void)): void {
        this._middlewares.push(fn)
    }
}


export default new App();
