"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("appolo");
class Util extends appolo.Util {
    static convertSnakeCaseToCamelCase(str) {
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }
    static getAllPropertyNames(obj) {
        var props = [];
        do {
            if (obj.prototype) {
                props = props.concat(Object.getOwnPropertyNames(obj.prototype));
            }
        } while (obj = Object.getPrototypeOf(obj));
        return props;
    }
    static isClass(v) {
        return typeof v === 'function' && v.name && /^\s*class\s+/.test(v.toString());
    }
    static decodeParam(val) {
        if (typeof val !== 'string' || val.length === 0) {
            return val;
        }
        try {
            return decodeURIComponent(val);
        }
        catch (err) {
            if (err instanceof URIError) {
                err.message = `Failed to decode param ${val}`;
                throw err;
            }
        }
    }
    static mixinProperties(obj, proto, keys) {
        keys = keys || Object.keys(proto);
        for (let i = 0, l = keys.length; i < l; i++) {
            let prop = keys[i];
            obj[prop] = proto[prop];
        }
        return obj;
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map