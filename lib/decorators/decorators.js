"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const appolo = require("appolo");
const route_1 = require("../routes/route");
const methods_1 = require("../common/enums/methods");
const launcher_1 = require("../launcher/launcher");
const routeModel_1 = require("../routes/routeModel");
const EmptyFunction = () => {
};
function addDefinition(name, args, type) {
    if (type.prototype.__inject__ && !type.prototype.hasOwnProperty("__inject__")) {
        type.prototype.__inject__ = _.cloneDeep(type.prototype.__inject__);
    }
    if (!type.prototype.__inject__) {
        type.prototype.__inject__ = [];
    }
    type.prototype.__inject__.push({ name: name, args: args });
}
function addDefinitionClass(name, args) {
    return function (name, args, fn) {
        //let appoloDef = fn.prototype.__inject__;
        //if (!appoloDef || _.isArray(appoloDef)) {
        addDefinition(name, args, fn);
        //} else {
        //   appoloDef[name].apply(appoloDef, args)
        // }
    }.bind(null, name, args);
}
function addDefinitionProperty(name, args) {
    return function (name, args, target, propertyKey, descriptor) {
        args.unshift(propertyKey);
        addDefinition(name, args, target.constructor);
    }.bind(null, name, args);
}
function bootstrap() {
    return function (fn) {
        let name = (fn.name.charAt(0).toLowerCase() + fn.name.slice(1));
        launcher_1.default.options.bootStrapClassId = name;
    };
}
exports.bootstrap = bootstrap;
function define(id) {
    return function (id, fn) {
        let appoloDef = appolo.define(id || (fn.name.charAt(0).toLowerCase() + fn.name.slice(1)), fn);
        _.forEach(fn.prototype.__inject__, (item) => appoloDef[item.name].apply(appoloDef, item.args));
        //fn.prototype.__inject__ = appoloDef;
        let paramGroups = _.groupBy(fn.prototype.__param_inject__, "method");
        _.forEach(paramGroups, (items, method) => {
            let oldFn = fn.prototype[method];
            fn.prototype[method] = function (...args) {
                for (let i = 0, length = (items.length || 0); i < length; i++) {
                    args[items[i].index] = appolo.inject.getObject(items[i].param);
                }
                return oldFn.apply(this, args);
            };
        });
    }.bind(null, id);
}
exports.define = define;
function singleton(singleton) {
    if (singleton === false) {
        return EmptyFunction;
    }
    return addDefinitionClass("singleton", []);
}
exports.singleton = singleton;
function lazy(lazy) {
    if (lazy === false) {
        return EmptyFunction;
    }
    return addDefinitionClass("lazy", []);
}
exports.lazy = lazy;
function alias(alias) {
    return addDefinitionClass("alias", [alias]);
}
exports.alias = alias;
function aliasFactory(aliasFactory) {
    return addDefinitionClass("aliasFactory", [aliasFactory]);
}
exports.aliasFactory = aliasFactory;
function initMethod() {
    return addDefinitionProperty("initMethod", []);
}
exports.initMethod = initMethod;
function inject(inject) {
    return addDefinitionProperty("inject", [inject]);
}
exports.inject = inject;
function injectFactoryMethod(factoryMethod) {
    if (typeof factoryMethod == "function") {
        factoryMethod = factoryMethod.name.charAt(0).toLowerCase() + factoryMethod.name.slice(1);
    }
    return addDefinitionProperty("injectFactoryMethod", [factoryMethod]);
}
exports.injectFactoryMethod = injectFactoryMethod;
function injectAlias(alias, indexBy) {
    return addDefinitionProperty("injectAlias", [alias, indexBy]);
}
exports.injectAlias = injectAlias;
function injectAliasFactory(alias, indexBy) {
    return addDefinitionProperty("injectAliasFactory", [alias, indexBy]);
}
exports.injectAliasFactory = injectAliasFactory;
function injectArray(arr) {
    return addDefinitionProperty("injectArray", [arr]);
}
exports.injectArray = injectArray;
function injectDictionary(dic) {
    return addDefinitionProperty("injectDictionary", [dic]);
}
exports.injectDictionary = injectDictionary;
function injectFactory(factory) {
    return addDefinitionProperty("injectFactory", [factory]);
}
exports.injectFactory = injectFactory;
function injectObjectProperty(object, propertyName) {
    return addDefinitionProperty("injectObjectProperty", [object, propertyName]);
}
exports.injectObjectProperty = injectObjectProperty;
function injectValue(value) {
    return addDefinitionProperty("injectValue", [value]);
}
exports.injectValue = injectValue;
function defineRouteProperty(params) {
    return function (params, target, propertyKey, descriptor) {
        if (target.constructor.prototype.__route__ && !target.constructor.prototype.hasOwnProperty("__route__")) {
            target.constructor.prototype.__route__ = _.cloneDeep(target.constructor.prototype.__route__);
        }
        let routes = target.constructor.prototype.__route__ || (target.constructor.prototype.__route__ = {});
        let route = routes[propertyKey];
        if (!route) {
            routes[propertyKey] = route = new route_1.Route(target.constructor);
            route.action(propertyKey);
        }
        _.forEach(params, param => {
            route[param.name].apply(route, param.args);
        });
    }.bind(null, params);
}
function path(path) {
    return defineRouteProperty([{ name: "path", args: [path] }]);
}
exports.path = path;
function pathGet(path) {
    return defineRouteProperty([{ name: "path", args: [path] }, { name: "method", args: [methods_1.Methods.GET] }]);
}
exports.pathGet = pathGet;
function pathPost(path) {
    return defineRouteProperty([{ name: "path", args: [path] }, { name: "method", args: [methods_1.Methods.POST] }]);
}
exports.pathPost = pathPost;
function pathPatch(path) {
    return defineRouteProperty([{ name: "path", args: [path] }, { name: "method", args: [methods_1.Methods.PATCH] }]);
}
exports.pathPatch = pathPatch;
function pathPut(path) {
    return defineRouteProperty([{ name: "path", args: [path] }, { name: "method", args: [methods_1.Methods.PUT] }]);
}
exports.pathPut = pathPut;
function pathDelete(path) {
    return defineRouteProperty([{ name: "path", args: [path] }, { name: "method", args: [methods_1.Methods.DELETE] }]);
}
exports.pathDelete = pathDelete;
function method(method) {
    return defineRouteProperty([{ name: "method", args: [method] }]);
}
exports.method = method;
function middleware(middleware) {
    return defineRouteProperty([{ name: "middleware", args: [middleware, "head"] }]);
}
exports.middleware = middleware;
function validation(key, validation) {
    if (key.constructor.prototype == routeModel_1.RouteModel.constructor.prototype) {
        key = key.prototype.__validations__;
    }
    return defineRouteProperty([{ name: "validation", args: [key, validation] }]);
}
exports.validation = validation;
function validationParam(validation) {
    return function (target, propertyKey, descriptor) {
        if (target.constructor.prototype.__validations__ && !target.constructor.prototype.hasOwnProperty("__validations__")) {
            target.constructor.prototype.__validations__ = _.cloneDeep(target.constructor.prototype.__validations__);
        }
        let validations = target.constructor.prototype.__validations__ || (target.constructor.prototype.__validations__ = {});
        validations[propertyKey] = validation;
    };
}
exports.validationParam = validationParam;
function abstract(route) {
    _.forEach(route, (value, key) => {
        //we need to insert middlewares in reverse order
        if (key == "middleware") {
            route[key] = { middleware: _.isArray(value) ? value.reverse() : value, order: "head" };
        }
    });
    return defineRouteProperty([{ name: "abstract", args: [route] }]);
}
exports.abstract = abstract;
function roles(role) {
    return defineRouteProperty([{ name: "roles", args: [role] }]);
}
exports.roles = roles;
function injectParam(name) {
    return function logParameter(target, propertyKey, index) {
        let args = [];
        // //we have a constructor
        if (!propertyKey) {
            if (target.prototype.__inject__) {
                args = appolo.Util.getFunctionArgs(target);
                target.prototype.__inject__.push({ name: "args", args: [{ ref: args[index] }] });
            }
            return;
        }
        args = appolo.Util.getFunctionArgs(target.constructor.prototype[propertyKey]);
        if (!target.constructor.prototype.__param_inject__) {
            target.constructor.prototype.__param_inject__ = [];
        }
        target.constructor.prototype.__param_inject__.push({
            param: name || args[index],
            method: propertyKey,
            index: index
        });
    };
}
exports.injectParam = injectParam;
//# sourceMappingURL=decorators.js.map