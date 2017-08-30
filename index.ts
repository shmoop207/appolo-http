import appolo = require('appolo');
import launcher from './lib/launcher/launcher';
import {IOptions} from "./lib/interfaces/IOptions";

export {
    EventDispatcher,
    Util,
    module,
    inject,
    loader,
    environment,
    use,
    IEnv,
    IBootstrap,
    IFactory,
    Injector
} from 'appolo';
export {Define} from './lib/define/define'
export {define} from './lib/define/defineFn'
export {default as route, Route} from './lib/routes/route';

export {Controller} from './lib/controller/controller';
export {StaticController} from './lib/controller/staticController';

export {Middleware} from './lib/middleware/middleware';
export {default as router, Router} from './lib/routes/router';

export {default as launcher} from './lib/launcher/launcher';

export  import   validator =  require('joi');

export {IOptions} from "./lib/interfaces/IOptions";
export {IMiddleware} from "./lib/interfaces/IMiddleware";
export {IRouteOptions} from "./lib/interfaces/IRouteOptions";
export {IDefinition} from "./lib/interfaces/IDefinition";
export {App,NextFn} from "./lib/app/app";
export {Request} from "./lib/app/request";
export {Response} from "./lib/app/response";


export let launch = function (config: IOptions, callback?: (err?: any) => void): Promise<void> {
    return launcher.launch(config, callback);
};



