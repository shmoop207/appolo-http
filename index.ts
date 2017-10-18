import appolo = require('appolo');
import launcher from './lib/launcher/launcher';
import {IOptions} from "./lib/interfaces/IOptions";

export {
    EventDispatcher,
    Util,
    module,
    inject as injector,
    inject as container,
    loader,
    environment,
    use,
    IEnv,
    IBootstrap,
    IFactory,
    Injector
} from 'appolo';
export {Register, register} from './lib/register/register'
export {default as route, Route} from './lib/routes/route';
export {Controller} from './lib/controller/controller';
export {StaticController} from './lib/controller/staticController';
export * from './lib/decorators/decorators'

export {Middleware} from './lib/middleware/middleware';
export {StaticMiddleware} from './lib/middleware/staticMiddleware';
export {default as router, Router} from './lib/routes/router';
export {Methods} from './lib/common/enums/methods'
export {HttpError} from './lib/common/error/httpError'

export {default as launcher} from './lib/launcher/launcher';
export {default as app} from './lib/app/app';

export  import   validator =  require('joi');

export {IOptions} from "./lib/interfaces/IOptions";
export {IMiddleware} from "./lib/interfaces/IMiddleware";
export {IRouteOptions} from "./lib/interfaces/IRouteOptions";
export {IDefinition} from "./lib/interfaces/IDefinition";
export {App, NextFn} from "./lib/app/app";
export {IRequest} from "./lib/app/request";
export {IResponse} from "./lib/app/response";


export let launch = function (config?: IOptions, callback?: (err?: any) => void): Promise<void> {
    return launcher.launch(config, callback);
};

export let handleRequest = function (req, res): void {
    launcher.handleRequest(req, res);
};


