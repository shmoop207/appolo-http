import    http = require('http');
import    _ = require('lodash');
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {Url} from "url";
import typeis = require('type-is');
import {NextFn} from "./app";


export interface IRequest extends http.IncomingMessage, AppRequest {

}

interface AppRequest extends http.IncomingMessage {
    query?: { [index: string]: any }
    body?: { [index: string]: any }
    params?: { [index: string]: any }
    model?: { [index: string]: any }
    $route?: IRouteInnerOptions
    next?: NextFn
    pathName: string
    originUrl: string;

}

let proto = (http.IncomingMessage.prototype as any)

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


export function createRequest(request: http.IncomingMessage): IRequest {
    let req = request as IRequest;
    return req;
}
