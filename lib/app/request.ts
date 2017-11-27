import    http = require('http');
import    _ = require('lodash');
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {Url} from "url";
import typeis = require('type-is');
import {NextFn} from "./app";


export interface IRequest extends http.IncomingMessage, AppRequest {

}

interface AppRequest {
    query?: { [index: string]: any }
    body?: { [index: string]: any }
    params?: { [index: string]: any }
    model?: { [index: string]: any }
    $route?: IRouteInnerOptions
    next?: NextFn
    pathName: string
    originUrl: string;

    is(types: string | string[]): boolean

    get(name: string): string

    header(name: string): string

    protocol: string
    hostname: string
    secure: boolean

}

let proto = (http.IncomingMessage.prototype as any);


proto.is = function (types: string | string[]) {

    return typeis.apply(typeis, [this].concat(_.toArray(arguments)));
};

proto.get = proto.header = function (name: string) {

    let nameLower = name.toLowerCase();

    switch (nameLower) {
        case 'referer':
        case 'referrer':
            return this.headers.referrer
                || this.headers.referer;
        default:
            return this.headers[nameLower];
    }
};

defineGetter(proto, 'protocol', function(){
    let protocol = this.connection.encrypted
        ? 'https'
        : 'http';

    let header = this.headers['x-forwarded-proto'] || protocol;
    let headerArr = header.split(',');

    return headerArr[0].trim();
});

defineGetter(proto, 'secure', function() {
    return this.protocol === 'https';
});

defineGetter(proto, 'hostname', function() {

    let host = this.headers['x-forwarded-host'];

    if (!host) {
        host = this.headers['host'];
    }

    if (!host) {
        return "";
    }

    return host.split(",")[0].trim();

});



function defineGetter(obj, name, getter) {
    Object.defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        get: getter
    });
}


export function createRequest(request: http.IncomingMessage): IRequest {
    let req = request as IRequest;
    return req;
}
