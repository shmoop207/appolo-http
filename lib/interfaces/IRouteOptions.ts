import appolo = require('appolo');
import    joi = require('joi');
import {Controller} from "./../controller/controller";
import {MiddlewareHandler} from "../app/app";
import {StaticController} from "../controller/staticController";
import {IController} from "../controller/IController";
import {Methods} from "../common/enums/methods";
import {IMiddlewareCtr} from "./IMiddleware";

export type Method = 'get' | 'post' | 'delete' | 'patch' | 'head' | 'put' | Methods


export interface IRouteOptions {
    controller?: string
    action?: ((c: IController) => Function) | string
    environments?: string[]
    roles?: string[]
    middleware?: (MiddlewareHandler | string | IMiddlewareCtr)[]
    validations?: { [index: string]: joi.Schema }
    path?: string
    abstract?: boolean,
    convertToCamelCase?: boolean
    method?: Method
    order: number
    params: { [index: string]: any }
    controllerName?: string
    actionName?: string


}

export interface IRouteInnerOptions {
    route: IRouteOptions
    middlewareHandler?: MiddlewareHandler[]
    methodUpperCase?: string
    regExp:RegExp
    paramsKeys:{[index:string]:any}

}