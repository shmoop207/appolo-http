import appolo = require('appolo');
import {IRouteOptions} from "./IRouteOptions";
import {NextFn} from "../app/app";
import {IResponse} from "../app/response";
import {IRequest} from "../app/request";


export interface IMiddleware{
 run(req:IRequest, res:IResponse, next:NextFn,route:IRouteOptions)
}


export interface IMiddlewareCtr {
    new (...args: any[]): IMiddleware
}