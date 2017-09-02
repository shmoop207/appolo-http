import _ = require('lodash');
import    appolo = require("appolo");
import joi = require("joi");
import {Route} from "../routes/route";
import {Methods} from "../common/enums/methods";
import {MiddlewareHandler} from "../app/app";
import {IMiddlewareCtr} from "../interfaces/IMiddleware";


const EmptyFunction = ()=>{};

function addDefinition(name:string, args:any[], type):void {
    if (!type.prototype.__inject__) {
        type.prototype.__inject__ = []
    }

    type.prototype.__inject__.push({name: name, args: args})
}

function addDefinitionClass(name:string, args:any[]):(fn:Function)=>void {
    return function (name:string, args:any[], fn:Function) {
        let appoloDef = fn.prototype.__inject__;
        if (!appoloDef || _.isArray(appoloDef)) {
            addDefinition(name, args, fn)
        } else {
            appoloDef[name].apply(appoloDef, args)
        }
    }.bind(null, name, args)
}

function addDefinitionProperty(name:string, args:any[]):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {
    return function (name:string, args:any[], target:any, propertyKey:string, descriptor:PropertyDescriptor) {
        args.unshift(propertyKey);
        addDefinition(name, args, target.constructor)
    }.bind(null, name, args)
}

export function define(id?: string):(fn:Function)=>void {
    return function (id:string, fn:Function) {
        let appoloDef = appolo.define(id || (fn.name.charAt(0).toLowerCase() + fn.name.slice(1)), fn);

        _.forEach(fn.prototype.__inject__, (item:any) => appoloDef[item.name].apply(appoloDef, item.args))

        fn.prototype.__inject__ = appoloDef;

    }.bind(null, id);
}

export function singleton(singleton?: boolean):( fn:Function)=>void {
    if (singleton === false) {
        return EmptyFunction;
    }
    return addDefinitionClass("singleton", [])
}

export function lazy(lazy?: boolean):( fn:Function)=>void {
    if (lazy === false) {
        return EmptyFunction;
    }

    return addDefinitionClass("lazy", [])
}


export function alias(alias: string):( fn:Function)=>void {
    return addDefinitionClass("alias", [alias]);
}


export function aliasFactory(aliasFactory: string):( fn:Function)=>void {

    return addDefinitionClass("aliasFactory", [aliasFactory]);
}


export function initMethod():(target:Function, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("initMethod", []);
}

export function inject(inject?: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>any {

    return addDefinitionProperty("inject", [inject]);
}


export function injectFactoryMethod(factoryMethod: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectFactoryMethod", [factoryMethod]);
}

export function injectAlias(alias: string, indexBy?: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectAlias", [alias, indexBy]);
}

export function injectAliasFactory(alias: string, indexBy?: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectAliasFactory", [alias, indexBy]);
}

export function injectArray(arr: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectArray", [arr]);
}

export function injectDictionary(dic: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectDictionary", [dic]);
}

export function injectFactory(factory: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectFactory", [factory]);
}

export function injectObjectProperty(object: string, propertyName: string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectObjectProperty", [object, propertyName]);
}

export function injectValue(value: any):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void {

    return addDefinitionProperty("injectValue", [value]);
}

function defineRouteProperty(name:string, args:any[]):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void{

    return function (name:string,args:any[], target:any, propertyKey:string, descriptor:PropertyDescriptor) {
        let route:Route<any> = target.constructor.prototype.__route__;

        if(!route){
            route = target.constructor.prototype.__route__ = new Route<any>(target.constructor);
            route.action(propertyKey);
        }

        route[name].apply(route, args)

    }.bind(null,name, args)
}

export function path(path:string):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void{
    return defineRouteProperty("path",[path])
}

export function method(method:'get' | 'post' | 'delete' | 'patch' | 'head' | 'put' | Methods){
    return defineRouteProperty("method",[method])
}

export function middleware(middleware: string | MiddlewareHandler | IMiddlewareCtr):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void{
    return defineRouteProperty("middleware",[middleware])
}
export function validation(key: string | { [index: string]: joi.Schema }, validation?: joi.Schema):(target:any, propertyKey:string, descriptor?:PropertyDescriptor)=>void{
    return defineRouteProperty("validation",[key,validation])
}

