import appolo = require('appolo');
import    joi = require('joi');
import {Controller} from "./../controller/controller";
import {MiddlewareHandler} from "../app/app";
import {StaticController} from "../controller/staticController";
import {IController} from "../controller/IController";

export type Method = 'get' | 'post' | 'delete' | 'patch' | 'head' | 'put'


export interface IRouteOptions {
    controller?: string
    controllerName?: string
    action?: ((c: IController)=>Function) | string
    actionName?: string
    environments?: string[]
    roles?: string[]
    middleware?:  MiddlewareHandler[]
    validations?: { [index: string]: joi.Schema }
    path?: string
    abstract?: boolean,
    convertToCamelCase?: boolean
    method?: Method
    methodUpperCase?: string
    regExp?:RegExp
    paramsKeys?:{name:string}[]
    order:number
    params:{[index:string]:any}

}