import _ = require('lodash');
import appolo = require('appolo');


export class Util extends appolo.Util {
    public static convertSnakeCaseToCamelCase(str: string) {
        return str.replace(/(\_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }

    public static getAllPropertyNames(obj) {
        var props = [];

        do {
            if (obj.prototype) {
                props = props.concat(Object.getOwnPropertyNames(obj.prototype));
            }

        } while (obj = Object.getPrototypeOf(obj));

        return props;
    }

    public static isClass(v: any): boolean {
        return typeof v === 'function' && v.name && /^\s*class\s+/.test(v.toString());
    }


    public static decodeParam(val: string): string {
        if (typeof val !== 'string' || val.length === 0) {
            return val;
        }

        try {
            return decodeURIComponent(val);
        } catch (err) {
            if (err instanceof URIError) {
                err.message = `Failed to decode param ${val}`

                throw err;
            }

        }
    }

    public static mixinProperties(obj: any, proto: any, keys?: string[]): any {
        keys = keys || Object.keys(proto);

        for (let i = 0, l = keys.length; i < l; i++) {
            let prop = keys[i];
            obj[prop] = proto[prop];

        }

        return obj;
    }
}