import appolo = require('appolo');
import {IRouteOptions} from "./IRouteOptions";
import {NextFn} from "../app/app";
import {Response} from "../app/response";
import {Request} from "../app/request";


export interface IMiddleware{
 run(req:Request, res:Response, next:NextFn,route:IRouteOptions)
}
