import _ = require('lodash');
import    appolo = require("appolo");
import joi = require("joi");
import {Route} from "../routes/route";
import {Methods} from "../common/enums/methods";
import {MiddlewareHandler} from "../app/app";
import {IMiddlewareCtr} from "../interfaces/IMiddleware";
import launcher from '../launcher/launcher';
import {IRouteOptions} from "../interfaces/IRouteOptions";


const EmptyFunction = () => {
};

function addDefinition(name: string, args: any[], type): void {
    if (!type.prototype.__inject__) {
        type.prototype.__inject__ = []
    }

    type.prototype.__inject__.push({name: name, args: args})
}

function addDefinitionClass(name: string, args: any[]): (fn: Function) => void {
    return function (name: string, args: any[], fn: Function) {
        let appoloDef = fn.prototype.__inject__;
        if (!appoloDef || _.isArray(appoloDef)) {
            addDefinition(name, args, fn)
        } else {
            appoloDef[name].apply(appoloDef, args)
        }
    }.bind(null, name, args)
}

function addDefinitionProperty(name: string, args: any[]): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {
    return function (name: string, args: any[], target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        args.unshift(propertyKey);
        addDefinition(name, args, target.constructor)
    }.bind(null, name, args)
}

export function bootstrap() {
    return function (fn: Function): void {
        let name = (fn.name.charAt(0).toLowerCase() + fn.name.slice(1));

        launcher.options.bootStrapClassId = name;
    }
}

export function define(id?: string): (fn: Function) => void {
    return function (id: string, fn: Function) {
        let appoloDef = appolo.define(id || (fn.name.charAt(0).toLowerCase() + fn.name.slice(1)), fn);

        _.forEach(fn.prototype.__inject__, (item: any) => appoloDef[item.name].apply(appoloDef, item.args))

        fn.prototype.__inject__ = appoloDef;

        fn.prototype.__param_inject__ = _.groupBy(fn.prototype.__param_inject__, "method")

        _.forEach(fn.prototype.__param_inject__, (items: any[], method: string) => {
            let oldFn = fn.prototype[method];

            fn.prototype[method] = function (...args: any[]) {
                for (let i = 0, length = (items.length || 0); i < length; i++) {
                    args[items[i].index] = appolo.inject.getObject(items[i].param)
                }

                return oldFn.apply(this, args)
            }
        });


    }.bind(null, id);
}

export function singleton(singleton?: boolean): (fn: Function) => void {
    if (singleton === false) {
        return EmptyFunction;
    }
    return addDefinitionClass("singleton", [])
}

export function lazy(lazy?: boolean): (fn: Function) => void {
    if (lazy === false) {
        return EmptyFunction;
    }

    return addDefinitionClass("lazy", [])
}


export function alias(alias: string): (fn: Function) => void {
    return addDefinitionClass("alias", [alias]);
}


export function aliasFactory(aliasFactory: string): (fn: Function) => void {

    return addDefinitionClass("aliasFactory", [aliasFactory]);
}


export function initMethod(): (target: Function, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("initMethod", []);
}

export function inject(inject?: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any {

    return addDefinitionProperty("inject", [inject]);
}


export function injectFactoryMethod(factoryMethod: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectFactoryMethod", [factoryMethod]);
}

export function injectAlias(alias: string, indexBy?: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectAlias", [alias, indexBy]);
}

export function injectAliasFactory(alias: string, indexBy?: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectAliasFactory", [alias, indexBy]);
}

export function injectArray(arr: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectArray", [arr]);
}

export function injectDictionary(dic: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectDictionary", [dic]);
}

export function injectFactory(factory: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectFactory", [factory]);
}

export function injectObjectProperty(object: string, propertyName: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectObjectProperty", [object, propertyName]);
}

export function injectValue(value: any): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return addDefinitionProperty("injectValue", [value]);
}

function defineRouteProperty(name: string, args: any[]): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {

    return function (name: string, args: any[], target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        let routes = target.constructor.prototype.__route__ || (target.constructor.prototype.__route__ = {});

        let route = <Route<any>>routes[propertyKey];

        if (!route) {
            routes[propertyKey] = route = new Route<any>(target.constructor);
            route.action(propertyKey);
        }

        route[name].apply(route, args)

    }.bind(null, name, args)
}

export function path(path: string): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {
    return defineRouteProperty("path", [path])
}

export function method(method: 'get' | 'post' | 'delete' | 'patch' | 'head' | 'put' | Methods) {
    return defineRouteProperty("method", [method])
}

export function middleware(middleware: string | MiddlewareHandler | IMiddlewareCtr): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {
    return defineRouteProperty("middleware", [middleware])
}

export function validation(key: string | { [index: string]: joi.Schema }, validation?: joi.Schema): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {
    return defineRouteProperty("validation", [key, validation])
}

export function abstract(route: Partial<IRouteOptions>): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void {
    return defineRouteProperty("abstract", [route])
}


export function injectParam(name?: string) {
    return function logParameter(target: any, propertyKey: string, index: number) {
        let args = [];

        // //we have a constructor
        if (!propertyKey) {
            if (target.prototype.__inject__) {
                args = appolo.Util.getFunctionArgs(target);
                target.prototype.__inject__.push({name: "args", args: [{ref: args[index]}]});
            }
            return;
        }

        args = appolo.Util.getFunctionArgs(target.constructor.prototype[propertyKey]);

        if (!target.constructor.prototype.__param_inject__) {
            target.constructor.prototype.__param_inject__ = []
        }


        target.constructor.prototype.__param_inject__.push({
            param: name || args[index],
            method: propertyKey,
            index: index
        })

    }
}