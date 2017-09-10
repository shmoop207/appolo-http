"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
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
    static parseUrl(str) {
        let match = this.UrlRegex.exec(str);
        if (match) {
            let pathName = match[1];
            let query = match[2] || "";
            if (query) {
                query = query.substring(1);
            }
            return { pathName, query };
        }
        let parsed = url.parse(str);
        return {
            pathName: parsed.pathname,
            query: parsed.query
        };
    }
    static parseUrlFast(str) {
        let index = str.indexOf('?');
        if (index > -1) {
            let pathName = str.substring(0, index);
            let query = str.substring(index + 1);
            return { query, pathName };
        }
        else {
            return { pathName: str, query: "" };
        }
    }
}
Util.UrlRegex = /^(\/\/?(?!\/)[^?#\s]*)(\?[^#\s]*)?$/;
Util.addSlashEnd = (str) => {
    if (str[str.length - 1] != "/") {
        return str += "/";
    }
    return str;
};
Util.addSlashEndFast = (str) => {
    if (str.charCodeAt(str.length - 1) != 47) {
        return str += "/";
    }
    return str;
};
exports.Util = Util;
//# sourceMappingURL=util.js.map