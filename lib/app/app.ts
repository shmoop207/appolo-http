require("./request");
require("./response");

import    http = require('http');
import    url = require('url');
import    Q = require('bluebird');
import    _ = require('lodash');
import    qs = require('qs');
import    querystring = require('querystring');
import router, {Router} from '../routes/router';
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {Util} from "../util/util";
import {IRequest, createRequest} from "./request";
import {IResponse, createResponse} from "./response";
import {HttpError} from "../common/error/httpError";
import appolo = require('appolo');
import {IOptions} from "../interfaces/IOptions";
import {Cache} from "appolo-lru-cache";
import {default as launcher} from "../launcher/launcher";


export type MiddlewareHandler = ((req: IRequest, res: IResponse, next: NextFn) => void)
export type NextFn = (err?: Error) => void


export class App {

    private _routes: IRouteInnerOptions[];
    private _routesLength: number;
    private _middlewares: MiddlewareHandler[];
    private _options: IOptions;
    private _routeCache: Cache<string, { route: IRouteInnerOptions, params: { [index: string]: string } }>;

    private readonly ValidMethods = {"OPTIONS": 1, "HEAD": 1};


    constructor() {
        this._middlewares = [];
    }

    public initialize(options: IOptions) {

        this._routes = _(router.getRoutes()).sortBy(r => r.route.order).value();

        this._middlewares.push((req: IRequest, res: IResponse, next) => this._initRoute(req, res, next));

        this._routesLength = this._routes.length;
        this._options = options;
        this._routeCache = new Cache<string, { route: IRouteInnerOptions, params: { [index: string]: string } }>({maxSize: this._options.maxRouteCache});
    }

    public handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        let req: IRequest = createRequest(request);
        let res: IResponse = createResponse(request, response);

        try {
            this._initRequest(req, res);

            this._handleMiddleware(req, res, 0, this._middlewares);


        } catch (e) {
            this._handleError(e, res);
        }
    }

    private _initRequest(req: IRequest, res: IResponse): void {

        let {query, pathname} = this._options.urlParser === "fast"
            ? Util.parseUrlFast(req.url)
            : url.parse(req.url);

        req.query = this._options.qsParser === "qs"
            ? qs.parse(query as string)
            : querystring.parse(query as string);

        req.pathName = pathname;
        req.originUrl = req.url;
    }

    private _initRoute(req: IRequest, res: IResponse, next: NextFn): void {

        let match, route;

        let cached = this._routeCache.get(req.pathName + req.method);

        if (cached) {
            req.$route = cached.route;
            req.params = cached.params;
            this._handleMiddleware(req, res, 0, req.$route.middlewareHandler);
            return;
        }

        ({match, route} = this._findRoute(req));

        if (!match) {
            next(new HttpError(404, `Cannot ${req.method} ${req.pathName}`));
            return;
        }

        req.params = this._createRouteParams(route, match);
        req.$route = route;
        this._routeCache.set(req.pathName + req.method, {route: req.$route, params: req.params});


        this._handleMiddleware(req, res, 0, req.$route.middlewareHandler);
    }

    private _findRoute(req: IRequest):{route: IRouteInnerOptions,match:RegExpExecArray} {
        let route, match;
        for (let i = 0; i < this._routesLength; i++) {

            route = this._routes[i];

            match = route.regExp.exec(Util.addSlashEnd(req.pathName));

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

    private _handleMiddleware(req: IRequest, res: IResponse, num: number, middlewares: MiddlewareHandler[], err?: Error) {

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
        } catch (e) {
            this._handleError(e, res);
        }

    }

    private _handleError(e: Error | HttpError, res: IResponse) {
        let err: HttpError = e as HttpError;

        let statusCode = (err.status >= 400 && err.status < 600 ) ? err.status : (err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);

        res.statusCode = statusCode;

        if (err.data && err instanceof HttpError) {

            res.send(err.data);

            return;
        }

        let message = (appolo.environment.type == 'development' && statusCode == 500 || this._options.errorStack) ? e.stack : (e.toString && this._options.errorMessage ? e.toString() : statusCode.toString())

        res.send(message);

    }

    public use(fn: ((req: IRequest, res: IResponse, next: (e?: Error) => void) => void) | ((req: any, res: any, next: any) => void)): void {
        this._middlewares.push(fn)
    }

    public viewEngine(fn: (path: string, options?: { cache?: boolean, [otherOptions: string]: any }) => Promise<string>, ext: string = "html"): void {
        launcher.options.viewEngine = fn;
        launcher.options.viewExt = ext;
    }

    public set(name: keyof IOptions, value: any) {
        launcher.options[name] = value;
    }
}


export default new App();
